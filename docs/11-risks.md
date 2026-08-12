# 11 — Risk Register

Scored **Likelihood × Impact** (1–5 each). Review monthly; owners named at kick-off.

---

## Critical (score ≥ 16)

| # | Risk | L | I | Score | Mitigation |
|---|---|---|---|---|---|
| R1 | **Outage during peak trading** destroys reputation in a tight-knit, referral-driven market | 4 | 5 | **20** | Offline-first architecture as a hard requirement; error budgets that halt feature work; change freezes on peak dates; 24/7 support from Phase 2; public status page and honest post-mortems |
| R2 | **Underestimating the offline sync problem** and needing a rewrite in year two | 4 | 5 | **20** | Prove it in a Phase 0 spike before any product code; single-writer ownership model; chaos tests in CI from week one; hire someone who has built distributed sync before |
| R3 | **Payment integration delays** — certification queues you don't control block go-live | 4 | 4 | **16** | Start partner conversations in Phase 0; run commercial and technical tracks in parallel; always have two acquirers in flight; keep a standalone-terminal fallback tender so a site can trade regardless |
| R4 | **Running out of money before retention is proven** | 4 | 5 | **20** | Standard budget scenario with 20% contingency; design partners for early revenue; don't hire sales until churn < 1.5%/mo; monthly runway review with a 6-month hard floor |
| R5 | **A pricing/VAT/tips bug causing customer financial loss** | 3 | 5 | **15–20** | Property-based tests plus an accountant-signed golden-file corpus; sign-off required for any tax-code change; PI insurance at £5m; contractual liability caps; a documented incident and remediation process |

---

## High (9–15)

| # | Risk | L | I | Score | Mitigation |
|---|---|---|---|---|---|
| R6 | Scope creep across five verticals produces a product mediocre at all of them | 4 | 4 | 16 | One vertical at a time with published exit criteria; a written "not now" list; no bespoke promises in the sales room |
| R7 | Support cost per site never falls, killing gross margin | 4 | 3 | 12 | Tickets-per-site as a board KPI; standing engineering objective on the top 5 ticket drivers; sell managed routers; invest in self-serve and in-product help |
| R8 | Enterprise security reviews block deals for months | 4 | 3 | 12 | Cyber Essentials Plus in Phase 2, ISO 27001 programme in Phase 3; maintain a pre-built security pack (pen-test summary, DPA, ROPA, architecture diagram, sub-processor list) |
| R9 | Hardware working capital exhausts cash | 3 | 4 | 12 | Leasing partner from the first sale; don't hold stock you haven't sold; consider merchant-direct purchasing early |
| R10 | Key-person dependency on one or two engineers | 4 | 4 | 16 | Architecture decision records; pair on payment and sync code; no single-owner subsystems; documented runbooks; competitive retention |
| R11 | An incumbent (Zonal, Lightspeed, Toast, Square) ships your differentiator | 3 | 4 | 12 | Compound advantages that are hard to copy — the journal architecture, the tronc engine's depth, the developer ecosystem — rather than single features; ship faster than a company with a 12-month release train |
| R12 | UK GDPR / data breach involving customer or employee data | 2 | 5 | 10 | Encryption everywhere, least privilege, annual pen tests, cyber insurance, tested 72-hour breach-notification runbook, minimise what you store |
| R13 | Delivery platforms change terms or restrict POS API access | 3 | 4 | 12 | Aggregator plus direct integrations in parallel; push operators to your own direct-ordering channel (also better for them) |
| R14 | A customer asks you to build something that is effectively an ESS tool | 3 | 5 | 15 | Written policy, refusal template, log every request, immediate escalation to legal; make the architecture make it impossible rather than merely prohibited |
| R15 | Certification/onboarding cost per site makes independents unprofitable | 3 | 4 | 12 | AI menu import; self-serve provisioning; site templates; charge for onboarding; target 90-minute go-live |

---

## Medium (4–8)

| # | Risk | Mitigation |
|---|---|---|
| R16 | Android POS hardware supply-chain delays (8–16 week lead times) | Dual-source; certify 2+ models per category; hold buffer stock |
| R17 | Hospitality market downturn increases customer failure rate | Diversify into retail and hotels; keep contracts short enough to stay competitive; monitor debtor days |
| R18 | Cloud/vendor cost inflation compresses margin | Annual vendor review; reserved instances; CPI-linked price increases in customer contracts |
| R19 | Reseller/dealer channel conflict with direct sales | Clear territory and account-registration rules from day one |
| R20 | DRS (Oct 2027) or another regulatory change lands mid-roadmap | Compliance watch as a standing quarterly agenda item; configurable rules engine rather than hard-coded law |
| R21 | AI features produce wrong answers in BI or forecasting and erode trust | Always show the underlying query/data; never let AI write to the financial ledger; label estimates clearly |
| R22 | Payments revenue brings chargeback and underwriting losses | Start with referral/rev-share models; take proper advice before PayFac; reserve against losses |
| R23 | Open-source licence contamination in the terminal app | Automated licence scanning in CI; approved-licence policy |

---

## Assumptions to validate early (each is a hidden risk)

| Assumption | How to test | By when |
|---|---|---|
| Operators will switch EPOS for compliance benefits | Put the ESS/tips proposition in front of 15 operators and count who leans forward | Phase 0 |
| Acquirer-agnostic payments is a real objection-killer | Track how often "I'd have to change card provider" appears in lost-deal logs | Phase 1–2 |
| A payment partner will share revenue with a small ISV | Ask all three Tier-1 acquirers in Phase 0 | Phase 0 |
| A one-day onboarding is achievable | Time your first 10 installs and plot the trend | Phase 2 |
| Independents will pay ~£99/site/mo | Price the design partners properly after the free period ends | Phase 2 |
| Tickets per site can be driven below 1/month | Measure from the first live site | Phase 2–3 |

---

## Early-warning indicators (put these on the weekly dashboard)

| Indicator | Threshold | Meaning |
|---|---|---|
| Tickets per site per month | rising 2 months running | Product quality regressing — churn follows in ~6 months |
| Payments attach rate | falling | Your payment story isn't landing; margin at risk |
| Offline events per site | rising | Network or sync regressions |
| Time from signed contract to go-live | > 30 days | Onboarding doesn't scale |
| Sales-cycle length | lengthening | Positioning or competitive problem |
| Error-budget consumption | > 50% by mid-month | Stop feature work now |
| Runway | < 9 months | Start fundraising immediately, not at 6 |
