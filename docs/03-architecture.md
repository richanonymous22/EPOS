# 03 — Technical Architecture

The three architectural decisions that determine whether this product succeeds:

1. **Local-first ordering** — the till is authoritative for its own orders; the cloud is
   a replica, not a dependency.
2. **Event-sourced, hash-chained sales journal** — the sales ledger is append-only and
   cryptographically verifiable. This is both correctness and a compliance moat.
3. **Never touch card data** — the POS orchestrates payments but PAN never enters your
   network. This removes an enormous PCI burden.

Everything else is negotiable.

---

## 3.1 System topology

```
                     ┌────────────────────────────────────────────┐
                     │           CLOUD (AWS eu-west-2)            │
                     │                                            │
  Back office (web)──┤  API gateway → services (catalogue, order, │
  Marketplace apps ──┤  payment, inventory, people, reporting)    │
  Partner APIs    ───┤        │              │            │       │
                     │   Postgres (RLS)  Event bus   Object store │
                     │        │           (Kafka/NATS)            │
                     │   Warehouse (Snowflake/BigQuery) ← CDC     │
                     └───────────────┬────────────────────────────┘
                                     │  mTLS, WebSocket + queued sync
                     ┌───────────────┴────────────────────────────┐
                     │            SITE (venue LAN)                │
                     │                                            │
                     │   Site Hub (optional, mini-PC/Pi)          │
                     │     • authoritative shared state           │
                     │     • printer & KDS broker                 │
                     │     • outbound sync queue                  │
                     │        ├── Till 1 (Android/iPad)           │
                     │        ├── Till 2, handhelds, kiosk        │
                     │        ├── KDS screens                     │
                     │        ├── Printers (Epson/Star)           │
                     │        └── Card terminals (acquirer LAN/BT)│
                     └────────────────────────────────────────────┘
```

**Site Hub is optional but recommended above ~3 terminals.** Below that, elect a leader
terminal. The hub is a £150–£300 fanless mini-PC running the same sync engine in a
container; it is a cache and coordinator, never a single point of failure — if it dies,
terminals fall back to peer-to-peer leader election.

---

## 3.2 Offline-first data model

This is the hardest part of the build. Get it right early; retrofitting it is a rewrite.

**Principle: partition ownership so conflicts are structurally impossible where it matters.**

| Data | Owner | Conflict strategy |
|---|---|---|
| An order/bill | The terminal that opened it, until explicitly transferred | Single-writer; transfer is an explicit, lock-acquiring operation |
| Table occupancy | Site Hub (or elected leader) | Lease-based lock, 30 s TTL, auto-release |
| Catalogue / prices | Cloud | Read-only replica at site; versioned; last-writer-wins from cloud only |
| Stock counts | Site | CRDT counter (PN-Counter) — decrements commute, so parallel sales never lose |
| Customer records | Cloud, with local additive cache | New records created offline get a client UUID, deduped on sync |
| Sales journal | Terminal | Append-only, per-terminal hash chain — never merged, only concatenated |
| Payments | Acquirer | Never reconstructed locally; reconciled against acquirer feed |

**Mechanics**

- Every terminal has a local durable store (SQLite/WatermelonDB or RocksDB) holding the
  full working set: catalogue, open orders, today's journal, staff, customers cache.
- Domain changes are emitted as **immutable events** with `(terminal_id, sequence_no,
  timestamp, prev_hash, payload_hash)`.
- An outbound queue ships events to the cloud; delivery is at-least-once, processing is
  idempotent on `(terminal_id, sequence_no)`.
- Inbound: cloud pushes catalogue/config versions over WebSocket; terminals apply
  atomically with a version stamp so a half-applied menu can never go live.
- **Clock discipline:** never trust device clocks for ordering. Use per-terminal
  monotonic sequence numbers plus an HLC (hybrid logical clock). Record wall-clock
  separately and flag drift > 60 s as an audit event.
- **72-hour offline budget:** size local storage and queue depth for 72 hours of peak
  trading; alert the site at 48 hours.

---

## 3.3 The immutable sales journal (compliance-critical)

Every financially significant action becomes a journal entry:

```
entry {
  id, terminal_id, seq, hlc, wall_clock,
  type,               // SALE_LINE_ADDED, LINE_VOIDED, PAYMENT_TAKEN, Z_READ, ...
  actor,              // staff id + auth method
  payload,            // typed, versioned
  reason_code,        // required for voids, discounts, refunds, no-sale
  prev_hash,          // SHA-256 of previous entry in this terminal's chain
  hash                // SHA-256(prev_hash || canonical(payload))
}
```

Rules, enforced in code, not policy:

- **No UPDATE, no DELETE, ever.** Corrections are compensating entries.
- Each terminal chain is anchored: on every Z-read, publish the chain head hash to the
  cloud, and daily anchor the estate root hash to a WORM store (S3 Object Lock,
  compliance mode, 7-year retention).
- Provide a **verification tool** that re-walks any period's chain and produces a
  pass/fail report plus a signed evidence pack. This is what you hand an HMRC officer.
- Training mode writes to a physically separate chain with a different key namespace and
  is excluded from all financial reports by construction, not by a filter.
- Reprints, re-opens and back-office edits are all journalled.

**Why this matters commercially:** HMRC's Electronic Sales Suppression regime penalises
*making or supplying* suppression tools (up to £50,000). A verifiable chain means you can
prove your software cannot be used that way — and the operator can prove their takings.
See [06-uk-compliance](06-uk-compliance.md).

---

## 3.4 Recommended stack

Opinionated, chosen for hiring pool in the UK and for sharing domain logic across
terminals and cloud.

| Layer | Choice | Why |
|---|---|---|
| Shared domain core | **TypeScript**, pure functions, zero I/O | Same pricing/tax/promotion engine runs on terminal and server — a whole class of "till and back office disagree" bugs disappears |
| Terminal app | **React Native** (Android + iPadOS), Hermes, Reanimated | One codebase across Android POS hardware and iPad; native modules where needed |
| Native modules | Kotlin / Swift | Printers, card terminal SDKs, cash drawer, scales, NFC, kiosk lockdown |
| Kiosk | Same RN app in kiosk mode, or Android WebView shell | Reuse |
| Site Hub | Node.js in Docker on Debian | Same TS core |
| Back office & marketplace | **Next.js** (React) | SSR, good SEO for public docs |
| Backend services | **NestJS (TypeScript)**; Go for the hot ingest path | Shared types end-to-end; Go where throughput matters |
| Database | **PostgreSQL 16+** with Row-Level Security | Multi-tenant with `tenant_id` RLS; dedicated schema/cluster for enterprise tenants |
| Analytics store | ClickHouse or BigQuery/Snowflake via CDC (Debezium) | Never run reporting on the OLTP database |
| Event bus | NATS JetStream (start) → Kafka (scale) | Ordered, replayable, durable |
| Cache/locks | Redis | Leases, rate limits, sessions |
| Object store | S3 with Object Lock | Journal anchors, receipts, exports, images |
| Search | OpenSearch or Postgres FTS | Product/customer lookup |
| Infra | AWS eu-west-2, EKS, Terraform, ArgoCD | UK residency; boring and hireable |
| Observability | OpenTelemetry → Grafana Cloud or Datadog; Sentry | Per-site health is a support product, not just ops |
| Feature flags | OpenFeature + Flagsmith/LaunchDarkly | Per-tenant, per-site rollout |
| Auth | WorkOS or Auth0 for B2B SSO; own PIN/fob auth on-terminal | Don't build SAML |

**Alternative worth considering:** Flutter instead of React Native if you want tighter
frame-timing control on cheap Android POS hardware. Decide with a two-week spike on your
actual target device (see Phase 0).

**Do not** build the till as a browser tab. Peripherals, kiosk lockdown, offline
durability and OS-level reliability all argue for a native shell.

---

## 3.5 Multi-tenancy & data model shape

```
Organisation (the customer account)
 └── Brand (franchise/concept)
      └── Region / Area
           └── Site (venue)
                └── Revenue centre / Outlet (bar, restaurant, room service)
                     └── Terminal / Device
```

- Config resolves by inheritance with explicit override at any level, and the UI must
  always show *where* a value came from. Operators lose days to "why is the price wrong
  at site 7" — make inheritance visible.
- Every table carries `tenant_id`; RLS policies are the last line of defence, not the
  first. Application-level scoping plus RLS plus tenant-scoped API keys.
- Enterprise tenants (50+ sites) can be moved to a dedicated database on the same code
  path — plan the sharding key from day one even if you never use it.

---

## 3.6 Payment architecture

Detailed in [04-payments](04-payments-and-card-integrations.md); architecturally:

- A **Payment Abstraction Layer (PAL)** with one canonical interface. Adapters per
  acquirer. Nothing in the till or the order service knows what "Dojo" is.
- Canonical operations: `authorise`, `capture`, `sale`, `void`, `reverse`, `refund`,
  `tip_adjust`, `pre_auth`, `incremental_auth`, `cashback`, `tokenise`, `pay_at_table`,
  `mo/to`, `status_query`, `reconcile`.
- Every operation is idempotent with a client-generated key, and every terminal exchange
  is recoverable — **the single most important payment requirement is "what happens when
  the till crashes between authorisation and receipt"**. Design the recovery path first,
  then the happy path.
- Reconciliation service ingests acquirer settlement files/APIs nightly and
  three-way-matches: journal ↔ acquirer authorisations ↔ settlement.
- **PAN never enters your systems.** You store: scheme, last 4, auth code, acquirer
  reference, token (if provided by the acquirer). Nothing else.

---

## 3.7 Security

- Cyber Essentials Plus early (cheap, and UK buyers ask for it), ISO 27001 by month 18–24.
- mTLS between terminal and cloud; per-device certificates issued at provisioning,
  revocable from back office (stolen-terminal path must be a one-click kill).
- Secrets in AWS Secrets Manager / KMS; no secrets in the terminal app bundle.
- All terminal-local data encrypted at rest with a device-bound key; remote wipe.
- Least-privilege RBAC internally; break-glass access with recording and approval.
- Annual CREST-accredited penetration test plus continuous dependency and container
  scanning; quarterly ASV scans if in PCI scope.
- Supply chain: pinned dependencies, SBOM per release, signed artefacts, protected
  branches, mandatory review, no direct pushes to main.
- Bug bounty (start private on Intigriti/HackerOne) from Phase 3.

---

## 3.8 Release & device management

- Trunk-based development, feature flags, CI on every PR, automated e2e on real device
  farm (a rack of your actual POS hardware in the office — buy 6–10 units).
- Release rings: internal → 3 friendly sites → 10% → 50% → 100%, with automatic rollback
  on error-rate regression.
- **Never deploy on a Friday, never deploy during service.** Terminals apply updates in
  a maintenance window defined per site by the operator's trading hours.
- MDM for the fleet (Esper, Hexnode, or Android Enterprise + Apple Business Manager /
  Jamf) — kiosk lockdown, remote reboot, app pinning, OS patching. Budget this: it's
  £2–£8 per device per month and it is not optional at scale.

---

## 3.9 Testing strategy (POS-specific)

POS bugs cost the customer money in real time. Test accordingly:

- **Property-based tests on the pricing/tax/promotion engine** — generate random baskets
  and assert invariants (total ≥ 0, VAT sums to header, discounts never exceed line value).
- **Golden-file tests for VAT**: a corpus of UK scenarios (eat-in vs takeaway, hot vs
  cold, service charge, deposits, vouchers) with expected outputs, reviewed by an
  accountant. Any change to tax code that alters a golden file requires sign-off.
- **Chaos testing the network**: automated tests that kill connectivity mid-order,
  mid-payment, mid-sync, and assert convergence and no double-charging.
- **Payment recovery matrix**: for each acquirer, test every failure point (terminal
  timeout, till crash post-auth, duplicate submit, partial approval, torn receipt).
- **Soak/peak tests**: simulate a 500-cover Saturday and a 12-site New Year's Eve.
- **Device matrix**: every supported terminal model, every supported printer model, in CI.
