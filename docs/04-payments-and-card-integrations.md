# 04 — Payments & Card Machine Integrations

This is the highest-value chapter. Payments determine your PCI burden, your sales
velocity (merchants won't switch EPOS if it means switching acquirer), and eventually
most of your gross profit.

---

## 4.1 The four integration models — choose deliberately

| Model | How it works | PCI impact on you | Effort | Use when |
|---|---|---|---|---|
| **Standalone (unintegrated)** | Staff key the amount into the card machine manually | None | Zero | Never ship this as the plan, but support it as a fallback tender type |
| **Semi-integrated** ✅ **recommended** | POS sends amount to an acquirer-certified terminal (via cloud API or local IP/Bluetooth); the terminal handles the card, PIN and encryption; POS gets back a result object | Minimal — card data never enters your software or network. Merchant likely qualifies for a reduced SAQ; you avoid the PCI Secure Software Standard entirely | 3–8 weeks per acquirer | Always, for card-present |
| **Terminal-embedded (POS-on-terminal)** | Your Android app runs *on* the payment device (Dojo Pocket, PAX A920, Clover, Sunmi P2, Castles) | Low, but the device vendor/acquirer must whitelist and sign your app | 4–10 weeks + device certification | All-in-one budget tier, market stalls, pop-ups, mobile trade |
| **Direct-to-scheme / full EMV** | You build the EMV kernel and certify L1/L2/L3 with schemes | Enormous. PCI PTS, PCI SSF, EMVCo | 12–24 months, £100k+ | **Do not do this.** There is no commercial reason for a POS vendor in the UK to do it |

**Decision: semi-integrated as the default, terminal-embedded as a second tier.** Never
store, process or transmit PAN. Write this into your engineering standards as a hard rule
with a lint/architecture test enforcing it.

---

## 4.2 UK acquirers & card machine providers — the full landscape

### Tier 1 — build these first

| Provider | Why | Integration route | Notes |
|---|---|---|---|
| **Dojo** | The dominant challenger in UK hospitality; huge installed base you can plug into rather than displace | Public developer docs (`docs.dojo.tech`): Pay at Table, Pay at Counter, terminal APIs, EPOS Data API, Tap to Pay on Pocket (your Android POS app on a Dojo Pocket) | Partner contact via `partnertech@dojo.tech`. Some APIs are *partner-hosted* — Dojo defines the spec, **you** host the endpoint and Dojo calls it. Plan for inbound webhooks with high availability |
| **Adyen** | Best-in-class Terminal API, cloud **and** local comms, one integration covers card-present + ecom + Tap to Pay; Adyen for Platforms is your future PayFac route | Adyen Terminal API (JSON/Nexo), Adyen partner programme | Higher merchant onboarding bar, better for groups and enterprise. Also powers some bank-branded offerings |
| **Stripe Terminal** | Excellent DX, WisePOS E / S700 readers, Tap to Pay on iPhone and Android, server-driven or SDK integration, unified with online ordering | Public docs, self-serve sandbox, no gatekeeping | Fastest to a working prototype. Best choice for your kiosk/web-ordering/QR channels even if card-present is elsewhere |

### Tier 2 — add on merchant demand (each is a deal-unblocker)

| Provider | Position |
|---|---|
| **Zettle by PayPal** | Micro-merchant; Reader SDK for Android/iOS; very common in cafés and markets |
| **SumUp** | Same segment; Air/Solo readers; simple SDK |
| **Worldpay (FIS)** | Large legacy UK estate; integrates with third-party EPOS; heavier commercial process |
| **Barclaycard** | Enormous UK SME base via the bank channel; Smartpay Advance/Touch |
| **Global Payments UK** | Strong in hospitality and retail; Genius / unified commerce |
| **Elavon** | Bank-referred merchants, Opayo heritage on the ecom side |
| **Lloyds Cardnet / Tyl by NatWest / HSBC** | Bank-channel merchants — a big share of UK SMEs, and the bank relationship is sticky |
| **Teya**, **takepayments**, **Payment Sense**, **myPOS**, **Viva Wallet (JPMorgan)** | Aggressive SME acquirers, often the incumbent at independents |
| **Verifone**, **Worldline/Ingenico**, **Castles Technology**, **PAX** | Terminal manufacturers — relevant for terminal-embedded and for estate standardisation |
| **Clover (Fiserv)** | Both an acquirer platform and a competing POS — integrate cautiously |

### Tier 3 — alternative payment methods (differentiators)

| Method | Provider options | Why it matters |
|---|---|---|
| **Pay by Bank / open banking** | TrueLayer, Volt, Token, Vyne, Banked, GoCardless | Fees of pennies rather than percent. Transformative on high-value tickets (hotel bills, banqueting, large tabs, retail big-ticket). A genuine "most advanced" claim |
| **Tap to Pay on iPhone / Android** | Available in the UK via Stripe, Adyen, Dojo, Zettle, SumUp, Worldline, Viva and others | Zero-hardware entry tier; great for pop-ups, events, queue-busting |
| **Digital wallets** | Apple Pay, Google Pay | Handled by the terminal; make sure your receipts and reporting record wallet type |
| **BNPL** | Klarna, Clearpay | Retail vertical only; rarely relevant in hospitality |
| **Gift/voucher networks** | One4All, Givex, Toggle | Retail and shopping-centre tenants often *require* this |
| **Payroll/benefit schemes** | Sodexo, Edenred, Pluxee | Workplace catering vertical |

---

## 4.3 The Payment Abstraction Layer (PAL)

Build this **before** the first acquirer integration, not after the second.

```
┌──────────────┐   canonical payment intents   ┌─────────────────────┐
│  Till / KDS  │ ────────────────────────────► │  Payment Abstraction│
│  Kiosk / Web │ ◄──────────────────────────── │       Layer         │
└──────────────┘   canonical payment results   └──────┬──────────────┘
                                                      │
              ┌────────────┬────────────┬─────────────┼──────────┬───────────┐
              ▼            ▼            ▼             ▼          ▼           ▼
          Dojo         Adyen        Stripe        Worldpay    Zettle    OpenBanking
         adapter      adapter       adapter        adapter    adapter    adapter
```

**Canonical interface (minimum):**

```
sale(intent)              refund(ref, amount)      preAuth(intent)
capture(ref, amount)      void(ref)                incrementalAuth(ref, amount)
reverse(ref)              tipAdjust(ref, tip)      cashback(intent)
payAtTable(billRef)       statusQuery(idemKey)     tokenise(consent)
settlementFeed(date)      terminalPair(config)     terminalHealth()
```

**Non-negotiable adapter requirements** (write these as a conformance test suite that
every adapter must pass before it ships):

1. **Idempotency.** Every call carries a client-generated key; replay returns the
   original result, never a second charge.
2. **Recovery.** After a crash, `statusQuery(idemKey)` must resolve any unknown state
   before the till allows another attempt. Build a persisted "in-flight payment" record
   that survives app restart and device reboot.
3. **Partial approvals and partial refunds** handled explicitly.
4. **Reconciliation feed** — a daily machine-readable settlement source per acquirer.
5. **Timeout semantics** documented per adapter; the till never assumes decline on timeout.
6. **Offline behaviour** — declare per adapter whether store-and-forward is supported and
   at what risk limit; if not, degrade to standalone-terminal mode with manual reference
   entry, journalled as such.

---

## 4.4 How to actually get an integration done — the repeatable playbook

This is the process to run for **every** payment partner. Expect **6–16 weeks** end to
end per acquirer; the technical work is often the smallest part.

### Stage 0 — Qualify (½ day)
- Is there a public developer portal and sandbox? (Stripe, Adyen, Dojo: yes.)
- Does the API cover the operations in §4.3? Pay-at-table, tip adjust and reconciliation
  are the usual gaps — check those specifically.
- What's their UK hospitality market share? Ask three prospective customers who they use.
- Any exclusivity or anti-competitive clauses in the partner agreement?

### Stage 1 — Technical spike (1–2 weeks)
- Get sandbox credentials; build a throwaway prototype that does sale → refund →
  tip adjust → reconcile.
- Deliberately break it: kill the app mid-auth, unplug the terminal, submit twice.
- **Write a go/no-go memo.** Many integrations die correctly at this stage.

### Stage 2 — Commercial (runs in parallel, 3–10 weeks)
- Apply to the ISV/partner programme. Ask for:
  - Named partner/solutions engineer and a Slack/Teams shared channel
  - **Revenue share or referral commission** (see §4.6) — always ask; the default answer
    is "no" only if you don't ask
  - Marketing development funds (MDF), joint case studies, listing on their partner
    directory (a real lead source)
  - Test hardware — request terminals free or at cost (£200–£500 each otherwise)
  - Breaking-change notice period (insist on 6–12 months) and sandbox parity commitment
- Sign: partner agreement, DPA (UK GDPR Art. 28), NDA, and their security questionnaire.
  **Budget 2–4 weeks for the security questionnaire alone** — this is where Cyber
  Essentials Plus / ISO 27001 pays for itself.

### Stage 3 — Build (2–6 weeks)
- Implement the adapter against the PAL conformance suite.
- Build the merchant onboarding flow: how does a merchant link *their* acquirer account
  to your POS? (OAuth, API key entry, or a boarding API — boarding APIs are much better
  and worth pushing for.)
- Terminal pairing UX: pairing must be doable by a non-technical manager in under
  two minutes, with clear error states.

### Stage 4 — Certification (2–6 weeks)
- Most acquirers run a **certification test script**: 50–200 scenarios (approve, decline,
  referral, reversal, partial, tip, cashback, contactless, chip & PIN, mag-stripe
  fallback, receipt content requirements).
- You'll need test cards and test terminals. Receipt content is a common failure —
  schemes mandate specific fields (masked PAN, AID, auth code, merchant ID, entry mode,
  verification method).
- Some partners charge a certification fee (£0–£10k, typically £0–£2k for
  semi-integrated). Ask upfront.
- Get written certification sign-off. Keep it — you'll need it for every enterprise
  security review thereafter.

### Stage 5 — Pilot & GA (2–4 weeks)
- 1–3 live merchants, monitored daily, with a documented rollback to standalone.
- Reconciliation must balance to the penny for 14 consecutive days before GA.
- Then: docs, support runbook, training for your support team, partner directory listing,
  joint launch announcement.

### Stage 6 — Steady state
- Quarterly business review with the partner; track referred deals in both directions.
- Subscribe to their changelog; maintain a version-support matrix.
- Monitor per-adapter success rate, latency and decline rate as first-class SLOs.

### The force multiplier: an Integration Framework
Build this in Phase 1 and every subsequent integration gets 3–4× cheaper:
- Canonical domain events + typed adapter SDK
- Contract tests + a recorded-cassette sandbox harness
- Shared retry/idempotency/circuit-breaker/observability plumbing
- Adapter scaffolding CLI and a documented "add an acquirer in 10 days" runbook

**Realistic sequencing:** Stripe Terminal (weeks 1–4, prove the PAL) → Dojo (weeks 4–14,
your volume play) → Adyen (weeks 10–22, enterprise + future PayFac) → then demand-driven.

---

## 4.5 PCI DSS — what you're actually on the hook for

- **As a POS software vendor doing semi-integrated only**, you are typically a **service
  provider** with respect to your cloud platform, but your *software* is out of PCI
  Secure Software Standard scope because it doesn't store, process or transmit account
  data. Protect that position fiercely — one "just capture the card number for MOTO"
  feature request destroys it.
- Merchants using PCI-validated **P2PE** solutions with PTS-approved terminals can use
  **SAQ P2PE**, which is dramatically shorter. Merchants on standalone IP terminals use
  SAQ B-IP. Being able to tell a prospect "we keep you on the short SAQ" is a sales asset.
- **You** will still be asked, by acquirers and enterprise customers, to evidence:
  - PCI DSS v4.0.1 service-provider compliance (SAQ-D-SP, or a Report on Compliance if
    you exceed volume thresholds or a partner insists)
  - Quarterly ASV scans, annual penetration test, secure SDLC
- **MOTO / card-on-file:** if you ever need it (hotel deposits, no-shows, account
  customers), use the acquirer's hosted fields or tokenisation. Never build a card entry
  form yourself.
- **Surcharging:** the Consumer Rights (Payment Surcharges) Regulations ban surcharging
  consumer card payments. Your product must not make illegal surcharging easy — a
  configurable service charge is fine, a "card fee" on consumer cards is not. Build the
  guardrail in.

Cost implications are in [08-costs](08-costs-non-coding.md) §Compliance.

---

## 4.6 Payment economics — where the business actually makes money

UK merchants typically pay a blended **1.0%–1.75%** on card-present transactions. That
splits roughly into interchange (capped at 0.2% debit / 0.3% credit for UK consumer
cards), scheme fees, and acquirer margin. Your opportunity is a slice of that margin.

**Four commercial models, in order of increasing effort and reward:**

| Model | What you do | Typical economics | When |
|---|---|---|---|
| **1. Integration only** | Certify and support the adapter | £0–£300 one-off referral per merchant, or nothing | Day one, for coverage |
| **2. Referral partner** | Introduce merchants to a preferred acquirer | £100–£500 per boarded merchant, sometimes 2–10 bps trailing | Month 3+ |
| **3. Revenue share / ISO** | You resell the acquirer's service under a share of margin | **10–40 bps** of processed volume | Month 9+, needs ~50+ merchants to be worth negotiating |
| **4. Managed PayFac (PayFac-as-a-Service)** | You own pricing, boarding and the merchant relationship on someone else's licence (Adyen for Platforms, Stripe Connect, Payrix, Finix) | **30–80 bps** net, plus you control the merchant experience end to end | Month 18–30, at 300–500+ merchants |
| **5. Full PayFac / Payment Institution** | Your own FCA authorisation | Highest, but adds capital requirements (a Payment Institution needs initial capital in the €125k order), safeguarding, a compliance function, audits | Only above ~2,000 merchants; usually not worth it |

**Worked example.** A single restaurant turning over £600k/yr with 80% card = £480k
processed.

| Model | Your annual revenue from that one site |
|---|---|
| Referral only | ~£200 one-off |
| Rev share at 25 bps | **£1,200/yr** |
| Managed PayFac at 55 bps | **£2,640/yr** |

Compare with SaaS at £120/site/mo = £1,440/yr. **At 300 sites, managed payfac adds
~£790k of high-margin ARR — more than the software itself.** This is why every serious
POS company becomes a payments company. Plan the migration path from day one: PAL
abstraction, merchant boarding flows, and a reconciliation engine that can handle
sub-merchant settlement.

**Caution:** payments revenue brings obligations — merchant underwriting, KYC/AML,
chargeback handling, funding risk, and FCA-regulated conduct if you go beyond referral.
Take proper legal advice before model 4 or 5 (budget £15k–£40k).

---

## 4.7 Reconciliation — the feature that keeps customers

Underrated and consistently badly done by competitors. Build a **three-way match**:

```
POS journal (what we think we sold)
    ↕
Acquirer authorisations (what the terminal actually approved)
    ↕
Settlement / bank credit (what actually landed, net of fees)
```

Surface: unmatched authorisations, missing captures, tips not adjusted, refunds without
originals, fee anomalies, expected-vs-actual payout dates, and a per-site daily
"balanced / not balanced" flag. An operator who can close their day in five minutes
instead of forty will not churn.
