# 01 — Strategy & Market

## 1.1 The UK EPOS landscape (2026)

The UK market is unusually crowded and unusually stale at the same time. Roughly four
bands:

| Band | Players | Typical price | Weakness you exploit |
|---|---|---|---|
| **Free / micro** | Square, SumUp, Zettle by PayPal | £0/mo, 0.99–1.75% per transaction | Payments-led, thin hospitality features, no multi-site depth, locked to their own acquiring |
| **SMB cloud** | Epos Now (~£25–39/mo + ~1.7%), Lightspeed (from ~£79/mo first terminal, Plus tiers to ~£189/mo), Toast UK (~£80/mo), Nobly, Tillo/Storekit | £25–£190/terminal/mo | Reliability and support reputations are the sector's open wound; shallow UK-specific compliance |
| **UK hospitality incumbents** | Zonal (quote-only, e.g. ~£229/mo rental on 36-month terms + ~£1,100 deployment), ICRTouch, Access EPoS, Comtrex, Tevalis, Vita Mojo, Centegra | £150–£400/site/mo, long contracts | Closed systems, slow release cadence, on-prem heritage, weak APIs, painful multi-site rollouts |
| **Enterprise / global** | Oracle Simphony (MICROS), NCR Aloha, PAR Brink, Agilysys | £300–£1,000+/site/mo | Cost, implementation time (6–18 months), rigidity, poor fit below 50 sites |

**Sources for the price points above:** UK EPOS comparison surveys published Feb–Jun
2026 (see Sources at the end of this document). Treat every figure as *list price* —
real deals discount 20–40% and bundle hardware.

## 1.2 Where the actual gap is

Five gaps, ranked by how defensible they are:

1. **Compliance as a product, not a PDF.** HMRC's Electronic Sales Suppression regime
   (Finance Act 2022, in force 24 February 2022) makes *making, supplying or promoting*
   a till-suppression tool punishable by penalties up to £50,000, with further penalties
   for possession. Almost no UK EPOS vendor markets a cryptographically verifiable sales
   journal. Similarly, the Employment (Allocation of Tips) Act 2023 (in force
   1 October 2024) created record-keeping and fair-allocation duties that most operators
   currently satisfy with spreadsheets or a third-party troncmaster. **Build both into
   the core and it becomes a compliance-led sale, which is a much easier sale than a
   feature-led one.**

2. **Payment freedom.** Most SMB systems tie you to one acquirer, or charge you to
   escape. An acquirer-agnostic payment abstraction layer — where the merchant keeps
   Dojo, or moves to Adyen, without changing till — is a genuine differentiator and
   later becomes your highest-margin revenue line.

3. **Offline that actually works.** UK hospitality Wi-Fi is bad. Cellars, basements,
   marquees, festivals, Victorian buildings with thick walls. "Cloud POS" that degrades
   to a read-only screen when the line drops loses the site on the first busy Saturday.
   Truly local-first ordering with deterministic conflict resolution is hard, which is
   why it's defensible.

4. **Open ecosystem.** Incumbents treat integrations as a rationed favour. A published
   API, webhooks, sandbox, and a self-serve app marketplace turns every complementary
   vendor (rotas, stock, loyalty, feedback, EPoS-adjacent hardware) into a distribution
   channel instead of a support ticket.

5. **One platform, many verticals.** Operators increasingly run mixed estates — a hotel
   with three restaurants and a retail shop; a brewery with a taproom and an online
   store. Running three systems is a real pain. A single core with vertical packs, one
   back office, one report set, one payment relationship, is a strong land-and-expand
   story.

## 1.3 What "most advanced in the UK" means concretely

Vague ambition kills products. Define it as ten falsifiable claims you can demo:

| # | Claim | Proof in a 20-minute demo |
|---|---|---|
| 1 | Tamper-evident sales ledger | Show hash-chained journal; attempt a back-dated edit; show verification failing and the audit event |
| 2 | Tips Act compliant out of the box | Capture tips → tronc rules → worker statement → 3-year record export, no third-party tool |
| 3 | Acquirer-agnostic payments | Same till, two terminals, two different acquirers, one reconciliation report |
| 4 | Zero-degradation offline | Pull the network cable mid-service; keep taking orders, printing, splitting bills; reconnect and show clean sync |
| 5 | Sub-second menu deploy to 500 sites | Push a price change to an estate and show timestamped confirmation per terminal |
| 6 | Real-time cross-channel stock | Sell the last portion on kiosk, watch it 86 on till, KDS, web and Deliveroo simultaneously |
| 7 | Natural-language BI | Ask "wet sales Tuesdays vs last year by site" in plain English, get the chart |
| 8 | Forecast-driven ordering & labour | Show forecast → suggested purchase order → suggested rota → variance report |
| 9 | Open API + marketplace | Live sandbox, docs, a third-party app installed in front of the customer |
| 10 | 90-minute site go-live | Configure a new site from a template and take a live payment inside 90 minutes |

If you can't demo it, don't claim it.

## 1.4 Target segments and sequencing

Do **not** launch multi-vertical. Sequence it:

| Wave | Segment | Why this order | Target sites |
|---|---|---|---|
| 1 | Independent & small-group **restaurants / gastropubs / bars** (1–10 sites) | Highest feature density (tables, courses, splits, tronc) — if you win here the other verticals are subsets; short sales cycle; owner is the decision-maker | 40 by month 12 |
| 2 | **QSR & takeaway** (incl. delivery-heavy, telephone-order Indian/pizza/kebab trade) | Huge UK segment, underserved by cloud players, delivery integrations are the whole game, caller-ID popup is a killer feature | 150 by month 18 |
| 3 | **Cafés, bakeries, coffee** | Fast to serve, high volume, good reference logos, PPDS allergen labelling need | 250 by month 20 |
| 4 | **Hotels & hospitality** | PMS room-posting integration is the moat; higher ARPU; longer cycle | 40 properties by month 24 |
| 5 | **Retail** (convenience, deli, garden centre, forecourt-adjacent) | Different feature set (scales, barcode, promotions, DRS from Oct 2027) — a later, separate pack | 100 by month 30 |
| 6 | **Enterprise / multi-site chains (50+)** | Only once you have uptime evidence and SOC 2 / ISO 27001 | 3 logos by month 30 |

## 1.5 Positioning statement

> For UK hospitality and retail operators who are tired of choosing between a cheap
> till that can't run their business and an enterprise system that takes a year to
> install, **[Brand]** is the EPOS platform that keeps trading when the internet
> doesn't, proves its own numbers to HMRC, distributes tips lawfully, and lets you keep
> whichever card machine you already have.

Three-word version internally: **Reliable. Compliant. Open.**

## 1.6 Naming, brand & trade mark (do this in Phase 0)

- Check availability at Companies House, UK IPO trade mark search, `.co.uk`/`.com`, and
  social handles **before** any design spend.
- UK trade mark: ~£170 online for the first class (~£50 per additional class). File in
  classes 9 (software), 35 (business/retail services), 42 (SaaS). Consider EU and US
  filings later (~£1,000–£2,500 each with an attorney).
- Avoid names containing "EPOS", "Till", "POS" as the distinctive element — they are
  descriptive and hard to register.

## 1.7 Competitive intelligence, ongoing

Build the habit in Phase 0 and never stop:

- Quarterly pricing teardown of the ten competitors above (mystery shop them).
- Track their release notes and status pages — outages are your best lead source.
- Monitor UK hospitality Facebook groups, r/BritishSuccess, Caterer, BigHospitality,
  Propel Info newsletters for churn signals.
- Log every lost deal with the reason; review monthly. If you lose three deals for the
  same missing feature, that feature moves up the roadmap.

---

## Sources

- [Compare EPOS Systems UK (2026) — pricing & features](https://www.expertsure.com/uk/epos-systems/compare-epos-systems/)
- [EPOS System Costs UK 2026](https://www.expertsure.com/uk/epos-systems/epos-costs/)
- [Lightspeed EPOS Review 2026](https://www.expertsure.com/uk/epos-systems/lightspeed-review/)
- [Epos Now Review 2026](https://www.expertsure.com/uk/epos-systems/epos-now-review/)
- [EPOS and Till Systems UK: What One Actually Costs in 2026](https://whito.co.uk/tools/epos-system-cost-uk/)
- [HMRC — Electronic Sales Suppression: software standards consultation](https://www.gov.uk/government/consultations/electronic-sales-suppression-introduction-of-software-standards/electronic-sales-suppression-introduction-of-software-standards-in-eposmpos-systems)
- [Employment (Allocation of Tips) Act 2023](https://www.legislation.gov.uk/ukpga/2023/13)
