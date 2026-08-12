# UK EPOS / Till Platform — Master Plan

A complete build plan for a multi-vertical EPOS (Electronic Point of Sale) platform
targeting the United Kingdom market: restaurants, bars/pubs, QSR & takeaway, cafés,
hotels & hospitality, and retail.

**Goal:** the most advanced EPOS platform in the UK market — measured by depth of
compliance, payment flexibility, offline reliability, integration breadth, and an open
developer ecosystem.

---

## How to read this

| # | Document | What it answers |
|---|---|---|
| 01 | [Strategy & Market](docs/01-strategy-and-market.md) | Who we beat, where the gap is, what "most advanced" concretely means |
| 02 | [Feature Catalogue](docs/02-feature-catalogue.md) | Every feature, by module and vertical, tiered Core → Differentiator |
| 03 | [Technical Architecture](docs/03-architecture.md) | Offline-first design, stack, multi-tenancy, the immutable sales ledger |
| 04 | [Payments & Card Machines](docs/04-payments-and-card-integrations.md) | Every UK acquirer, integration models, how to certify, payment economics |
| 05 | [Integrations Catalogue](docs/05-integrations-catalogue.md) | ~90 integrations, priority, effort, and how to actually get each one signed |
| 06 | [UK Compliance & Legal](docs/06-uk-compliance.md) | HMRC ESS, Tips Act, VAT, allergens, licensing, PCI, UK GDPR, DRS |
| 07 | [Roadmap](docs/07-roadmap.md) | Phase 0–4, month by month, with exit criteria per phase |
| 08 | [Costs (Non-Coding)](docs/08-costs-non-coding.md) | **The money question** — every cost that is not writing code |
| 09 | [Team, Support & Operations](docs/09-team-support-operations.md) | Who you hire, 24/7 support, installs, hardware logistics |
| 10 | [Go-to-Market & Pricing](docs/10-gtm-and-pricing.md) | Pricing model, unit economics, channels, CAC/LTV |
| 11 | [Risk Register](docs/11-risks.md) | What kills this business and how to de-risk it |
| 12 | [Master Checklist](docs/12-master-checklist.md) | Tickable checklists: build, compliance, integration, launch, per-site install |

---

## The one-paragraph version

Build a cloud-managed, **offline-first** EPOS on a single multi-tenant core with
swappable *vertical packs* (Restaurant, Bar, QSR/Takeaway, Hotel, Retail). Never touch
card data — integrate semi-integrated to multiple UK acquirers behind your own payment
abstraction layer, then graduate to managed payment facilitation where the real margin
is. Win on three things UK incumbents are weak at: an **immutable, hash-chained sales
journal** that makes HMRC Electronic Sales Suppression compliance a selling point; a
**native tronc/tips engine** that satisfies the Employment (Allocation of Tips) Act
2023 without bolt-on software; and an **open API + app marketplace** from day one.
Budget **£700k–£1.2m of non-engineering cash over 24 months** for a serious attempt,
and treat **24/7 support** as a product feature, not an overhead.

---

---

## The till (working code)

Phase 1 has started. The till and menu engine run today.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # 41 tests
npm run typecheck
```

### What's built

| Area | Status |
|---|---|
| Money engine — integer pence, half-up rounding, exact-sum splits and allocations | ✅ |
| UK VAT engine — rate resolved from (product class × order type × date), effective-dated | ✅ |
| Order engine — modifiers, line merging, quantities, discounts, service charge | ✅ |
| Voids with mandatory reason codes; sent lines can never be silently removed | ✅ |
| Append-only, hash-chained sales journal with a working `verify()` | ✅ |
| Till UI — category rail, product grid, search, order panel, live VAT breakdown | ✅ |
| Modifier sheet with min/max validation and allergen warnings | ✅ |
| Challenge 25 age-verification gate, logged either way | ✅ |
| Payment flow — cash with keypad and change, plus a simulated semi-integrated card terminal | ✅ |
| Journal drawer with chain inspection and a tamper-detection demo | ✅ |
| Kitchen printing, KDS, offline sync, real acquirer adapters, back office | ❌ not yet |

### The three things worth looking at

**1. VAT is not a property of a product.** Put a ham sandwich, a burger and two pints on
a bill and switch between *Eat in* and *Takeaway* in the header. The total stays £80.10,
but VAT moves from £13.35 to £12.27 — the cold sandwich is standard-rated eaten in and
zero-rated taken away. Switch to *Delivery* and the sandwich re-prices to the uplifted
delivery menu. This is resolved live in `src/core/vat.ts`, and it's the single most
common tax bug in EPOS software.

**2. Nothing can quietly leave the bill.** Voids keep the line, flag it, and demand a
reason. There is no delete. `src/core/journal.ts` has an `append` and deliberately no
counterpart — corrections are compensating entries.

**3. The journal proves itself.** Open the journal (top right), press *Verify* — the
chain walks clean. Then press *Demo: alter entry after the fact*, which edits a payment
the way a suppression tool would, and verify again: it fails at the exact entry with the
reason. That's the HMRC Electronic Sales Suppression story from
[docs/06-uk-compliance.md](docs/06-uk-compliance.md) made concrete.

### Layout

```
src/core/     domain logic, zero I/O, zero React — runs identically on a terminal or a server
  money.ts       integer pence, rounding, splitting
  vat.ts         UK rate resolution and gross→net extraction
  order.ts       lines, modifiers, discounts, totals, allocation
  journal.ts     append-only hash-chained ledger + verification
  sha256.ts      dependency-free, synchronous SHA-256
  catalogue.ts   demo gastropub menu exercising every VAT path
  *.test.ts      41 tests, including 400 randomly generated baskets
src/ui/       React components
```

The core has no framework dependency on purpose — per
[docs/03-architecture.md](docs/03-architecture.md), the same pricing and tax code must
run on the till and on the server, or the two will eventually disagree about money.

### Testing

`src/core/order.test.ts` includes a property test that builds 400 randomised baskets
across all three channels, with random discounts, service charges and voids, and asserts
the invariants that matter: `net + vat === total`, every rate band sums to the goods
total, and no line ever reconciles to a different figure than the header.

---

## Status

Plan complete; till and menu engine working. Next per
[docs/07-roadmap.md](docs/07-roadmap.md): kitchen printing and routing, then the
Payment Abstraction Layer with a real acquirer adapter behind it.
