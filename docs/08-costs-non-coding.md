# 08 — Costs Beyond Coding

> **The direct answer to "apart from coding / Claude Code, what will this actually cost?"**

All figures are GBP, 2026 UK market rates, ex-VAT. Ranges reflect lean → well-funded.
Treat these as planning estimates to be replaced by real quotes during Phase 0.

**The headline:** AI coding tools compress the *engineering* line. They compress almost
nothing else on this page. In a serious attempt, **engineering is roughly 35–45% of
total spend** — the other 55–65% is people who aren't engineers, compliance,
infrastructure, hardware working capital, and sales.

---

## 8.1 Company, legal & IP

| Item | One-off | Annual | Notes |
|---|---|---|---|
| Ltd company formation | £50–£150 | — | |
| Accountant (bookkeeping, year-end, VAT, payroll) | — | £1,500–£6,000 | More once you have staff and R&D claims |
| R&D tax credit claim preparation | — | £1,500–£5,000 or 10–20% of the claim | **This is a rebate, not just a cost** — genuinely valuable for a product like this |
| Core contract suite (MSA, SLA, DPA, EULA, order form, AUP, reseller agreement) | £6,000–£15,000 | — | Use a solicitor who has done SaaS before; templates cost more later |
| Ongoing legal (redlines, partner agreements, employment) | — | £4,000–£20,000 | Enterprise customers redline everything |
| UK trade mark (3 classes) | ~£270 | ~£270 renewal every 10 yrs | ~£170 first class + ~£50 each extra |
| EU + US trade marks | £2,000–£5,000 | — | Only if expanding |
| ICO data protection fee | — | £52–£3,000 | Tiered by size/turnover |
| Insurance: PI (£1–5m), cyber, public & product liability, employer's liability, D&O | — | £3,000–£15,000 | PI at £5m is often demanded by enterprise buyers |
| Source code escrow (NCC or similar) | £1,000–£3,000 setup | £1,500–£4,000 | Only when an enterprise deal requires it |
| Payments regulatory legal advice (before PayFac) | £15,000–£40,000 | — | Phase 4 only |
| **Subtotal Year 1** | **£8k–£25k** | **£10k–£45k** | |

---

## 8.2 Compliance & certification

| Item | Cost | When |
|---|---|---|
| Cyber Essentials | £300–£600 | Phase 1 — do it immediately, it unblocks partner security reviews |
| Cyber Essentials Plus | £2,000–£6,000/yr | Phase 2 |
| Penetration test (CREST-accredited, web + API + mobile) | £6,000–£20,000/yr | Phase 2 onwards; retest after major changes |
| Quarterly ASV scans (PCI) | £1,000–£3,000/yr | Once in PCI scope |
| PCI DSS service-provider assessment (QSA-assisted SAQ-D-SP) | £5,000–£15,000/yr | Phase 2 |
| PCI DSS full Report on Compliance (if required by a partner or volume) | £20,000–£50,000/yr | Phase 4, if at all |
| ISO 27001 (consultant + Stage 1/2 audit, year 1) | £15,000–£40,000 | Phase 3–4 |
| ISO 27001 surveillance audits | £5,000–£12,000/yr | Ongoing |
| Compliance automation platform (Vanta / Drata) | £8,000–£25,000/yr | Phase 3 — cuts ISO/SOC 2 effort substantially |
| SOC 2 Type II | £20,000–£45,000 | Only if selling to US buyers |
| Acquirer certification fees | £0–£10,000 each | Usually £0–£2k for semi-integrated; **always ask upfront** |
| Test terminals & test cards | £200–£500 per terminal | Ask the acquirer to supply free — many will |
| VAT / tips-law legal & accounting opinions | £3,000–£10,000 | Phase 1–2. Get the VAT engine signed off |
| Accessibility audit (kiosk + web ordering, WCAG 2.2 AA) | £3,000–£8,000 | Phase 3 |
| **Realistic Year-1 total** | **£15k–£45k** | Year 2–3 rises to £40k–£120k |

---

## 8.3 Infrastructure, tooling & third-party services

Scaling with estate size. "Year 1" assumes ≤ 50 sites; "At scale" assumes ~500 sites.

| Item | Year 1 (monthly) | At scale (monthly) |
|---|---|---|
| Cloud hosting (AWS eu-west-2: EKS, RDS/Aurora, S3, networking, dev/staging/prod) | £1,200–£4,000 | £8,000–£25,000 |
| Data warehouse (Snowflake/BigQuery/ClickHouse) | £200–£800 | £2,000–£8,000 |
| Observability (Datadog / Grafana Cloud) + Sentry | £400–£1,500 | £2,500–£8,000 |
| CI/CD minutes + device farm | £150–£600 | £600–£2,000 |
| Auth/SSO (WorkOS, Auth0) | £150–£800 | £1,000–£4,000 |
| Email + SMS (Postmark, Twilio) | £150–£800 | £1,000–£5,000 |
| **MDM for the terminal fleet** (Esper, Hexnode, Jamf) at £2–£8/device/mo | £200–£1,200 | **£4,000–£16,000** ⚠️ |
| CDN / WAF / DNS (Cloudflare) | £100–£600 | £600–£2,500 |
| Address lookup (Loqate/Ideal Postcodes) ~2–5p per lookup | £50–£400 | £500–£3,000 |
| Maps & routing (Google Maps Platform / Mapbox) | £100–£600 | **£500–£5,000** ⚠️ delivery-heavy estates get expensive fast |
| Feature flags (Flagsmith/LaunchDarkly) | £50–£400 | £400–£1,500 |
| LLM/AI API usage (Claude API etc.) for in-product AI | £200–£1,500 | £1,500–£12,000 |
| Support desk + CRM (Zendesk/Intercom + HubSpot) | £300–£1,200 | £1,500–£6,000 |
| Billing/subscriptions (Stripe Billing/Chargebee) | £100–£400 + % | 0.5–1% of revenue |
| Design & PM tools (Figma, Linear, Notion, 1Password) | £150–£500 | £600–£2,000 |
| Status page, docs hosting, misc SaaS | £50–£300 | £300–£1,000 |
| **Monthly total** | **£3,500–£15,000** | **£26,000–£100,000** |
| **Annualised** | **£42k–£180k** | **£310k–£1.2m** |

Plus one-offs: Apple Developer Program ~£79/yr, Google Play $25 one-off, Windows code
signing certificate £300–£600/yr, Apple Business Manager free.

> ⚠️ **The two costs people forget:** MDM per-device fees and mapping API usage. At
> 2,000 devices, MDM alone can be £8k/month. Model them per-site from day one and price
> them into your subscription.

---

## 8.4 Hardware — and the working-capital trap

Typical unit costs if you resell:

| Item | Cost to you | Typical resale |
|---|---|---|
| Android POS terminal (Sunmi T3, Elo, PAX) | £250–£700 | £400–£1,100 |
| iPad + commercial stand | £400–£800 | £550–£1,100 |
| Receipt printer (Epson TM-m30III / Star) | £150–£300 | £220–£450 |
| Label printer (PPDS/allergen) | £180–£450 | £260–£650 |
| KDS screen + mount | £250–£600 | £400–£900 |
| Cash drawer | £60–£120 | £90–£190 |
| Handheld (Sunmi L2 / Zebra) | £350–£800 | £500–£1,200 |
| Self-service kiosk | £1,200–£3,500 | £1,900–£5,500 |
| Barcode scanner | £80–£300 | £130–£450 |
| Approved retail scale | £400–£2,500 | £600–£3,800 |
| 4G/5G-failover router | £150–£400 | £250–£600 |

**Typical site bundles (cost to you):** small café £1,200–£2,000 · restaurant with KDS
and 2 tills £2,500–£4,500 · QSR with 2 kiosks £6,000–£15,000 · hotel with 4 outlets
£8,000–£20,000.

**The working-capital problem.** You pay the manufacturer 30–60 days before the customer
pays you. At 200 sites averaging £3,000 of hardware, that's **£600,000 of cash tied up**.
Three ways out:

1. **Leasing partner** (Shire Leasing, Johnson Reed, BNP Paribas Leasing) — they pay you
   up front, the merchant pays monthly over 36–60 months. **Strongly recommended.** You
   get cash now and a stickier customer; the finance company takes the credit risk.
   Typically you also earn a small introducer commission.
2. **Hardware-as-a-service** on your own balance sheet — highest margin, needs funding.
3. **Merchant buys direct** from a distributor (you certify the models). Zero margin,
   zero risk, and it makes onboarding messier — acceptable early on.

**Other hardware-related costs:** staging/imaging/configuration labour (£15–£40 per
device), warehousing and 3PL (£1,500–£6,000/mo at scale), courier and packaging
(£15–£40 per site), spares pool (hold 5–8% of the fleet — £20k–£80k tied up), RMA and
warranty handling, and a device lab for CI (6–10 units of each supported model, £5k–£15k).

---

## 8.5 People — the largest line by far

UK salary ranges plus **~15% employer NIC and ~3–5% pension**; add ~20% on top of base.
Recruitment agency fees are 15–25% of first-year salary if you use them.

| Role | Base salary | When you need it | Why AI doesn't remove it |
|---|---|---|---|
| Founder/product lead | £0–£70k (often deferred) | Day 1 | — |
| Senior engineer × 2–3 | £65k–£95k each | Phase 0–1 | AI accelerates writing code; it does not own architecture, on-call, or the decision that a payment edge case is unacceptable |
| Mobile/device engineer | £60k–£85k | Phase 1 | Printer drivers, terminal SDKs, kiosk lockdown — deeply physical work |
| QA / test engineer | £45k–£65k | Phase 1 | **Do not skip.** POS bugs cost customers money in real time |
| Payments/integrations specialist | £70k–£100k | Phase 2 | Half the job is partner relationship management |
| Implementation / onboarding consultant | £35k–£50k | Phase 2 | Menu builds, site config, training |
| Support agents × 3–6 | £26k–£38k each | Phase 2 | See §8.6 |
| Field engineer (+ van, ~£6k/yr running) | £35k–£48k | Phase 3 | Installs and emergency callouts |
| Sales (BDM) × 1–3 | £35k–£45k base + OTE to £70k–£90k | Phase 2 | |
| Customer success / account manager | £35k–£50k | Phase 3 | Retention is cheaper than acquisition |
| Marketing manager | £40k–£60k | Phase 2–3 | |
| Finance/ops manager | £45k–£65k | Phase 3 | |

**Fully-loaded team cost by phase:**

| Phase | Headcount | Annual cost |
|---|---|---|
| Phase 0–1 (months 0–7) | 3–5 | £220k–£420k |
| Phase 2 (months 7–12) | 6–10 | £400k–£750k |
| Phase 3 (months 12–20) | 14–22 | £900k–£1.7m |
| Phase 4 (months 20–30) | 25–40 | £1.8m–£3.2m |

**Outsourcing levers:** offshore/nearshore L1 support (£1,500–£3,500 per person/month),
outsourced helpdesk (£8–£25 per ticket), contract implementation consultants
(£250–£450/day), fractional CFO/CTO (£1,000–£2,500/month).

---

## 8.6 24/7 support — treat it as a product cost, not overhead

**This is non-negotiable in UK hospitality.** Your customers' revenue is concentrated
into Friday and Saturday nights and bank holidays — exactly when normal support is
closed. One unanswered call at 8pm on a Saturday loses the account and the referral.

Options, cheapest first:

| Model | Cost | Reality |
|---|---|---|
| Founder's mobile | £0 | Works to ~30 sites and destroys the founder |
| On-call rota with in-house team | £150–£400 per week per person on call, plus TOIL | Works to ~150 sites |
| Extended hours in-house (8am–midnight) + overnight on-call | £120k–£220k/yr | The realistic Phase 3 answer |
| Outsourced L1 + in-house L2/L3 | £3,000–£12,000/mo + in-house | Good at 200+ sites |
| Follow-the-sun offshore | £8,000–£25,000/mo | 500+ sites |

**Benchmark to manage against:** tickets per site per month. Start around 3–5; a good
product drives it below 1. Every 0.5 you remove is roughly one support head per 400 sites.

---

## 8.7 Sales & marketing

| Item | Cost |
|---|---|
| Brand identity, website, product video | £15,000–£50,000 |
| Photography and demo content | £2,000–£8,000 |
| Demo kit (portable full setup × 2–3) | £4,000–£10,000 |
| **Trade shows** — HRC (ExCeL), Restaurant & Bar Tech Live, Casual Dining Show, Retail Technology Show | Stand £5,000–£25,000 + build/travel/staff → **£10,000–£40,000 per show**. Do 2–3 per year |
| Paid search (EPOS keywords are competitive, £8–£30 CPC) | £3,000–£20,000/mo |
| Content, SEO, PR | £2,000–£8,000/mo |
| Trade press and directory listings | £500–£3,000/mo |
| Sales collateral, case studies, ROI calculators | £5,000–£15,000 |
| Partner/reseller commissions | 10–20% of MRR, or £200–£800 per site |
| Referral incentives to existing customers | £150–£500 per referral |
| **Year-1 total** | **£80k–£350k** |

**Expect CAC of £800–£3,000 per site in year one**, falling toward £400–£1,200 as
referrals and partner channels mature. Hospitality is a referral market — a delighted
operator will bring you three more. Budget for customer events and hospitality
(£10k–£30k/yr); it works in this sector.

---

## 8.8 Integration & partnership costs

| Item | Cost |
|---|---|
| Deliverect / aggregator per-location fees | £40–£90/site/mo (usually passed to the merchant, but you'll absorb some in deals) |
| Xero App Store listing (if billed through it) | ~15% revenue share on App Store subscriptions |
| Oracle PartnerNetwork (for OPERA/OHIP) | Membership + certification fees, often £3,000–£15,000/yr and sometimes per-property |
| Mews / PMS marketplaces | Usually revenue share rather than fees |
| Supplier data pools (Erudus etc.) | £1,000–£6,000/yr |
| Test/sandbox accounts and partner hardware | £2,000–£8,000 one-off |
| Partner marketing contributions | £2,000–£15,000/yr (often offset by MDF you receive) |

---

## 8.9 Three budget scenarios (non-engineering cash)

Excludes founder salary; includes everything else on this page. Engineering salaries are
included because they're a cost you incur regardless of AI tooling — see §8.5 for how
much AI actually shifts.

| | **Lean** | **Standard** ✅ | **Ambitious** |
|---|---|---|---|
| Ambition | 1 vertical, 20–40 sites | 2–3 verticals, 150–250 sites | Full multi-vertical + PayFac, 750+ sites |
| Team peak | 3–5 | 8–12 | 25–40 |
| **Year 1** | £280k–£450k | £650k–£1.0m | £1.4m–£2.2m |
| **Year 2** | £350k–£600k | £900k–£1.6m | £2.2m–£3.8m |
| **24-month total** | **£630k–£1.05m** | **£1.55m–£2.6m** | **£3.6m–£6.0m** |
| Non-engineering share | ~50% | ~58% | ~62% |
| Funding route | Bootstrap + revenue + design partners | Angel/pre-seed £750k–£1.5m | Seed £2.5m–£5m |

**Recommendation: Standard.** Lean cannot fund 24/7 support or compliance, and support
and compliance are the product. Ambitious burns capital before you have proof the
retention holds.

Add **20% contingency** to whichever you pick. Integration timelines and certification
queues slip in ways you cannot control.

---

## 8.10 What AI coding actually changes

Be honest about this in your financial model:

| Area | Effect of AI-assisted development |
|---|---|
| Feature code, CRUD, adapters, tests, docs, migrations | **Large saving — 30–50% fewer engineer-hours.** This is real |
| Architecture, offline/distributed-systems design, payment edge cases | Modest. Judgement and accountability don't transfer |
| Debugging live incidents at 9pm on a Saturday | Little. You need a human who knows the system |
| QA on physical hardware | None. Someone has to plug in the printer |
| Certification, security questionnaires, partner relationships | None |
| Support, installation, training, sales | None |
| Hosting, hardware, MDM, insurance, compliance, trade shows | None |

**Net: AI might reduce total 24-month spend by 15–25%, not 60%.** Plan the budget as if
it saves 15% and treat anything more as upside.

---

## 8.11 Cost checklist — things founders forget

- [ ] Employer NIC (~15%) and pension on **every** salary figure
- [ ] Recruitment fees (15–25% of first-year salary)
- [ ] MDM per-device fees at fleet scale
- [ ] Mapping/geocoding API bills on delivery-heavy estates
- [ ] Hardware working capital and the spares pool
- [ ] Reverse logistics, RMAs and dead-on-arrival replacements
- [ ] 24/7 on-call allowances and bank-holiday cover
- [ ] Chargebacks and payment losses once you take payments margin
- [ ] Bad debt (hospitality has a high failure rate — 1–3% of revenue)
- [ ] Free/discounted design-partner sites (real revenue forgone)
- [ ] The cost of *removing* an integration you shouldn't have built
- [ ] Annual price rises from every SaaS vendor on §8.3
- [ ] Currency risk on hardware bought in USD/EUR
- [ ] VAT cash-flow timing on hardware purchases
