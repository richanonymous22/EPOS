# 06 — UK Compliance, Legal & Regulatory

> **Not legal advice.** Every item below needs sign-off from a UK solicitor and a
> qualified accountant before launch. Budget for it — see
> [08-costs](08-costs-non-coding.md).

The UK has **no till fiscalisation** in the continental sense (no certified fiscal
memory, no mandatory government signing device as in Italy, Poland, Portugal or
Germany's KassenSichV). That is a blessing and a trap: the bar is lower, so competitors
have been lazy, and the actual UK obligations sit in tax law, employment law, food law
and licensing law instead. Meeting them properly is your differentiator.

---

## 6.1 HMRC — Electronic Sales Suppression (ESS) 🔴 highest priority

**What it is.** ESS ("till fraud" / "zapper" software) is deliberate manipulation of
electronic sales records to hide takings. The Finance Act 2022 introduced powers
effective **24 February 2022**.

**Why it matters to you as a vendor, not just to your customers.** The regime creates
penalties for **making, supplying, or promoting** an ESS tool — up to **£50,000** — plus
penalties for possession (an initial £1,000 with daily penalties up to a further
£50,000). An "ESS tool" is defined broadly: any software, code, device or data capable
of suppressing, falsifying, manipulating, hiding or destroying electronic sales records.
HMRC also has strengthened information powers and has consulted on introducing **software
standards for EPOS/MPOS systems**.

**Design consequences (mandatory):**

- ✅ Append-only, hash-chained sales journal — no UPDATE, no DELETE (see
  [03-architecture](03-architecture.md) §3.3)
- ✅ Every void, discount, refund, no-sale, price override, reopen and reprint is
  journalled with actor, timestamp and reason code
- ✅ Training mode is a physically separate chain, structurally excluded from financial
  reports
- ✅ Z-reads are sequential, gapless, non-resettable, and publish a chain-head hash
- ✅ Daily anchoring of the estate root hash to immutable storage (S3 Object Lock, 7 years)
- ✅ An **HMRC evidence pack** export: a signed, verifiable report for any date range
- ❌ Never build: bulk delete, "clear day's sales", back-date a transaction, edit a
  completed sale, hide a terminal from reporting, or a second "real" set of books
- ❌ Never accept a customer request for any of the above — log the request, decline in
  writing, and take advice. This is a criminal-adjacent area

**Turn it into marketing.** "Provably tamper-evident takings" is a claim no UK SMB EPOS
vendor currently makes loudly. Operators facing an HMRC enquiry will pay for it.

---

## 6.2 VAT

**Making Tax Digital (MTD) for VAT** applies to all VAT-registered businesses. Your EPOS
is not the filing tool, but it is the start of the **digital link** chain: records must
flow to the accounting/bridging software without manual re-keying. Provide a clean,
digitally-linked export to Xero/QuickBooks/Sage and a digital-link-compatible CSV.
(MTD for Income Tax is also phasing in for sole traders and landlords — relevant to your
smaller customers' expectations.)

**UK food & drink VAT is genuinely hard, and getting it wrong in software is a liability.**
The engine must support, at minimum:

| Scenario | Treatment |
|---|---|
| Hot takeaway food | Standard rate |
| Cold takeaway food (most) | Zero rate |
| Anything consumed on the premises | Standard rate |
| Confectionery, crisps, soft drinks, alcohol | Standard rate regardless of channel |
| Catering and eat-in seating areas incl. shared food courts | Standard rate |
| Discretionary service charge | Generally outside the scope of VAT |
| Mandatory service charge | Follows the supply |
| Deposits and pre-payments | Tax point rules apply |
| Single-purpose vouchers | VAT at issue |
| Multi-purpose vouchers | VAT at redemption |
| Marketplace/delivery-platform sales | Check deemed-supplier and agent/principal treatment per platform |

**Requirements this creates:**

- Tax rules resolve on **(product × order type × channel × site × date)** — not a single
  rate per product
- Full historical rate versioning, so a report re-run for last year uses last year's rates
- Multiple rates within one bill, and correct rounding at line level with a header
  reconciliation
- Reverse charge, VAT-exempt and out-of-scope handling
- **A golden-file test corpus signed off by an accountant** ([03](03-architecture.md) §3.9)
- Northern Ireland nuances, and Republic of Ireland is a *different* regime with actual
  fiscal-style requirements if you expand

---

## 6.3 Employment (Allocation of Tips) Act 2023 🔴 high priority differentiator

In force **1 October 2024**, with a statutory **Code of Practice** employers must have
regard to. Core duties:

- Qualifying tips, gratuities and service charges must be passed on to workers **in full**
- No deductions except those required by law (e.g. tax/NICs)
- Allocation must be **fair and transparent**
- Payment no later than the **end of the month following** the month of receipt
- A **written tipping policy** where tips are received more than occasionally
- **Records kept for three years**, and workers have a right to request them
- Agency workers are included
- Enforcement via employment tribunal

**Tronc systems** remain permitted and, when genuinely independent, can carry NIC
advantages — but the employer's arrangement must still meet the Code's fairness
principles.

**Product requirements:**

- Tip capture by tender type (card tip at terminal, cash tip, service charge), by
  employee, shift, site and date
- Allocation engine: points, hours, role weighting, site pooling, kitchen/FOH splits,
  with effective-dated rule versions
- Troncmaster role with segregation of duties and an independence audit trail
- Immutable tip ledger; corrections are compensating entries
- Deadline enforcement and alerting (flag any pool unpaid past the statutory date)
- Worker-facing statement and self-service records request fulfilment
- 3-year retention with legal-hold support
- Written policy generator with versioning and worker acknowledgement
- Payroll export that preserves the tronc/NIC distinction

Most UK EPOS systems make the operator solve this with a spreadsheet or a separate
troncmaster service. **Solving it natively is worth real money and drives inbound leads.**

---

## 6.4 Food law

| Requirement | What the product must do |
|---|---|
| **Allergens (14 regulated allergens)** | Allergen data per ingredient → recipe → product, surfaced on till, KDS, kiosk, web, printed menus and delivery channels. Never allow a product to go live without an allergen decision recorded |
| **Natasha's Law / PPDS labelling** | Prepacked-for-direct-sale items need a label with the full ingredient list and allergens emphasised. Drive a label printer directly from the recipe |
| **Calorie labelling (out-of-home)** | Larger operators in England must display kcal on menus, boards, kiosks and online ordering. Support kcal per item, per portion size, and "adults need around 2000 kcal a day" statements |
| **Food safety / HACCP** | Optional module or integration; temperature logs, cleaning schedules |
| **Nutrition & HFSS** | Product classification for high fat/salt/sugar promotion restrictions in retail — affects the promotions engine (location and volume-price restrictions) |

---

## 6.5 Licensing, age restriction & trading standards

- **Licensing Act 2003** — alcohol sales require a personal/premises licence; the till
  should support licensable-hours enforcement per site and per outlet, and block sales
  outside permitted hours with a manager override that is journalled.
- **Challenge 25** — mandatory age prompts on age-restricted products (alcohol, tobacco,
  vapes, knives, solvents, lottery, fireworks, some medicines, energy drinks by policy).
  Require an explicit staff action, capture the verification method, and maintain a
  **refusals register** in the product.
- **Digital ID** — acceptance of digital identity for age checks is expanding in UK
  licensing; design the verification step to accept multiple methods (physical ID, digital
  ID app, Yoti-style attestation) rather than hard-coding "check the driving licence".
- **Weights & Measures** — prescribed alcohol measures (25/50 ml spirits;
  125/175/250 ml wine; pint/half pint for draught beer and cider), and only
  **approved and verified** scales for goods sold by weight. Enforce portion sizes in the
  product catalogue.
- **Price Marking Order** — retail price display and unit pricing obligations; your
  customer display and shelf-label output must support it.
- **Consumer Rights (Payment Surcharges) Regulations** — no surcharging consumer card
  payments. Do not ship a feature that makes this easy (see
  [04](04-payments-and-card-integrations.md) §4.5).
- **Deposit Return Scheme** — UK DRS is scheduled to go live in **October 2027** across
  England, Northern Ireland and Scotland (Wales is following a separate path). Retail POS
  will need deposit line items, return handling and reconciliation. Build DRS-readiness
  into the retail pack — being ready early is a strong retail wedge.
- **Extended Producer Responsibility (packaging)** — reporting obligations for larger
  businesses; packaging data capture is a nice-to-have hook.
- **Single-use item charges** (e.g. carrier bag charge) — configurable statutory charges
  with separate reporting.

---

## 6.6 Data protection — UK GDPR & PECR

- **Register with the ICO** (data protection fee, tiered roughly £52–£3,000/yr depending
  on size and turnover — confirm your tier).
- **Roles:** you are a **processor** for your customers' customer data, and a
  **controller** for your own customer/employee data. Your contracts must reflect both.
- **Required artefacts:** Record of Processing Activities (ROPA), DPIA for the CCTV,
  biometric-login and profiling features, an incident-response plan with the **72-hour**
  breach notification path, retention schedule, sub-processor list with change
  notification, and a UK/EEA data-residency commitment (host in `eu-west-2`).
- **DPA (Art. 28) as a standard annex** to your MSA. Every enterprise customer will
  redline it — have a pre-approved position.
- **International transfers:** if any sub-processor is outside the UK, you need the UK
  IDTA or the EU SCCs plus the UK Addendum, and a transfer risk assessment. This alone is
  a reason to prefer UK/EU vendors for logging, support and AI services.
- **Special category data:** biometric staff login and any health/allergy data about
  named individuals are higher-risk — DPIA required, and offer PIN/fob alternatives.
- **PECR** governs electronic marketing: your loyalty and campaign modules must enforce
  consent capture, granular opt-in per channel, an audit trail of consent, and one-click
  unsubscribe. Soft opt-in rules differ from GDPR consent — model both.
- **Data subject rights** must be operable *by the merchant* through your back office:
  access, erasure, rectification, portability. Build the tooling; don't do it by hand.

---

## 6.7 PCI DSS

Covered in [04](04-payments-and-card-integrations.md) §4.5. Summary of your position:

- Stay semi-integrated → your software is out of PCI Secure Software Standard scope
- Your cloud platform will still need service-provider PCI DSS v4.0.1 evidence
  (SAQ-D-SP typically), quarterly ASV scans and an annual penetration test
- Help merchants qualify for the shortest possible SAQ (SAQ P2PE with validated P2PE, or
  SAQ B-IP for standalone IP terminals) and say so in your sales material

---

## 6.8 Accessibility & equality

- **Equality Act 2010** — reasonable adjustments. Self-service kiosks are the exposure
  point: screen height and reach range, wheelchair approach, audio output with a
  headphone jack, high-contrast and large-text modes, no colour-only information, no
  timeout traps, and a staffed alternative.
- **WCAG 2.2 AA** for all customer-facing digital surfaces (kiosk, QR ordering, web
  ordering, receipts, customer displays). Public-sector customers will require an
  accessibility statement.
- **Welsh Language Standards** — if you sell to Welsh public bodies or operate in Wales,
  bilingual public-facing interfaces may be expected. Build i18n properly from the start.

---

## 6.9 Your own commercial & corporate compliance

- **Company:** UK Ltd, Companies House filings, PSC register, confirmation statement
- **VAT registration** for your own business once over threshold; consider voluntary
  registration earlier to reclaim input VAT on hardware
- **Contracts you need drafted:** MSA/T&Cs, order form, SLA, DPA, AUP, hardware sale &
  lease terms, reseller/partner agreement, NDA, employment contracts and IP assignment
  (critical — contractors must assign IP), privacy notice, cookie policy
- **Consumer vs business customers:** most customers are businesses, but sole traders may
  attract consumer protections — check your contracting model
- **Insurance:** professional indemnity (£1–5m — enterprise buyers ask for £5m), cyber,
  public liability, employer's liability (legally required once you employ), D&O,
  product liability if you resell hardware
- **Source code escrow** (NCC Group or similar) — enterprise and public-sector buyers
  increasingly require it
- **Cyber Essentials / Cyber Essentials Plus** — cheap, quick, and asked for on nearly
  every UK B2B security questionnaire. Do it in Phase 1
- **ISO 27001** — needed for enterprise and public sector; plan for month 18–24
- **Employment law:** working time, right-to-work checks, national minimum/living wage,
  the employer's NIC rate and threshold changes since April 2025 materially affect your
  payroll model
- **AI-specific:** if you ship AI features, document your model providers as
  sub-processors, offer opt-out, don't train on customer data without explicit consent,
  and keep an AI use register. UK enterprise procurement now routinely asks

---

## 6.10 Compliance sequencing

| Phase | Do this |
|---|---|
| **Phase 0** | Ltd company, ICO registration, insurance, core contracts drafted, trade mark filed, accountant + solicitor retained |
| **Phase 1** | ESS-proof journal built, VAT engine + golden-file corpus signed off by accountant, Cyber Essentials, DPA template, privacy notice |
| **Phase 2** | Tips Act engine, allergen/PPDS/calorie support, first penetration test, PCI SP evidence, Cyber Essentials Plus |
| **Phase 3** | ISO 27001 programme starts, DPIAs for AI/biometrics/CCTV, licensing & age-verification module, accessibility audit of kiosk |
| **Phase 4** | ISO 27001 certified, SOC 2 Type II if selling to US, DRS-ready retail pack, payments regulatory advice if pursuing PayFac |

---

## Sources

- [HMRC — Electronic Sales Suppression: introduction of software standards in EPOS/MPOS systems (consultation)](https://www.gov.uk/government/consultations/electronic-sales-suppression-introduction-of-software-standards/electronic-sales-suppression-introduction-of-software-standards-in-eposmpos-systems)
- [Penalties: Electronic Sales Suppression — Ross Martin](https://www.rossmartin.co.uk/penalties-a-compliance/penalties-appeals/5794-new-penalty-regime-for-electronic-sales-suppression-tools)
- [Employment (Allocation of Tips) Act 2023 — legislation.gov.uk](https://www.legislation.gov.uk/ukpga/2023/13)
- [The Employment (Allocation of Tips) Act 2023 — practical impact since implementation](https://www.charlesrussellspeechlys.com/en/insights/expert-insights/employment/2026/the-employment-allocation-of-tips-act-2023--practical-impact-since-implementation/)
- [PCI SSC — SAQs for PCI DSS v4.0.1 bulletin](https://www.pcisecuritystandards.org/wp-content/uploads/2024/10/SAQs_for_PCI_DSS_v4.0.1_Bulletin.pdf)
- [PCI DSS v4.0 SAQ P2PE](https://listings.pcisecuritystandards.org/documents/PCI-DSS-v4-0-SAQ-P2PE.pdf)
