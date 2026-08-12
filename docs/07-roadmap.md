# 07 — Roadmap

30 months, five phases. Each phase has **exit criteria** — do not start the next phase
until they're met. The most common way this product fails is scaling sales before the
software is reliable.

Assumed team shape is in [09-team-support-operations](09-team-support-operations.md).

---

## Phase 0 — Foundations (Months 0–2)

**Goal:** de-risk the three decisions you can't easily reverse, and be legally able to trade.

| Workstream | Deliverables |
|---|---|
| Discovery | 25+ structured interviews: 15 operators (mixed vertical/size), 5 EPOS resellers, 3 hospitality accountants, 2 troncmasters. Record everything. Rank pain by "would you switch for this?" |
| Design partners | Sign **5–8 venues** as design partners: free/discounted software for 24 months in exchange for access, feedback and a case study. Get it in writing |
| Technical spikes | (a) React Native vs Flutter on your actual target Android POS hardware — measure frame timing under load; (b) offline sync engine proof: two terminals, network partition, converge cleanly; (c) Stripe Terminal end-to-end payment in a week |
| Payments strategy | Meetings with Dojo, Adyen and Stripe partner teams. Understand programme terms and rev-share appetite *before* you design the PAL |
| Legal & corporate | Ltd company, bank, accountant, solicitor, ICO registration, insurance, trade mark filed, contract templates drafted |
| Brand | Name cleared, logo, domain, holding site |
| Hardware | Buy the reference kit: 2× Android POS, 1× iPad, 2× printers (Epson + Star), 1× KDS, 1× handheld, 1× cash drawer, test card terminals from each Tier-1 acquirer |

**Exit criteria**
- [ ] Offline sync spike survives a 30-minute partition with two terminals and converges with zero lost orders
- [ ] A live card payment taken on the spike, on real hardware
- [ ] 5+ design partners signed
- [ ] Company trading, insured, ICO-registered, contracts drafted
- [ ] Written architecture decision records for stack, sync model and payment model

---

## Phase 1 — MVP: one vertical, one acquirer (Months 2–7)

**Goal:** a restaurant can trade a full week on this and nobody has to phone you.

**Scope — build:**
- Immutable hash-chained journal, X/Z reads, cash-up, banking
- Catalogue: products, categories, modifiers (nested), price levels, per-channel VAT engine
- Till: order taking, table plan, courses, transfers, splits, holds, voids with reasons
- Payments: PAL + **first acquirer adapter** (Stripe Terminal, then Dojo)
- Printing: Epson + Star, kitchen routing rules, receipt templates
- Basic KDS
- Staff: PIN login, roles/permissions, clock in/out
- Back office: catalogue management, users, sites, core reports (sales, product, staff, tender, VAT)
- Offline: full trading offline, sync on reconnect
- Provisioning: device pairing, remote config, staged updates

**Explicitly out of scope:** loyalty, kiosk, delivery integrations, stock, rotas, retail,
hotel, marketplace, AI.

**Rollout:** design partners go live one at a time from month 5, with an engineer
physically on site for the first three services of each.

**Exit criteria**
- [ ] 5 design-partner sites trading daily for 6 consecutive weeks
- [ ] Zero P1 incidents during service in the final 3 weeks
- [ ] Card reconciliation balances to the penny for 14 consecutive days
- [ ] Median till interaction < 100 ms; cold start < 20 s
- [ ] A site survives a 4-hour internet outage during service with no lost orders
- [ ] VAT golden-file corpus signed off by an accountant
- [ ] An operator can complete end-of-day unaided in < 10 minutes

---

## Phase 2 — Commercial readiness (Months 7–12)

**Goal:** sellable to strangers, not just to friends.

- **Second and third acquirer adapters** (Dojo, Adyen)
- **Delivery:** Deliverect integration, then Deliveroo direct
- **Accounting:** Xero + QuickBooks + generic export
- **Tips & tronc engine** (the Tips Act flagship) — this is the marketing centrepiece
- Stock: goods-in, stock takes, wastage, recipes/BOM, GP reporting
- Rota basics + Deputy/Planday integration
- Customers, loyalty (points/stamps), gift cards
- Multi-site: consolidated reporting, site templates, estate publish with staged rollout
- Handheld ordering app
- Support tooling: remote device view, per-site health dashboard, in-product help
- Self-serve onboarding: AI menu import from a photo/PDF
- Cyber Essentials Plus; first penetration test; PCI service-provider evidence
- Public status page, changelog, SLA

**Exit criteria**
- [ ] 40 paying sites, ≥ 20 acquired without a founder in the room
- [ ] Monthly logo churn < 1.5%
- [ ] Support: 90% of tickets resolved without an engineer
- [ ] Onboarding a new single-site restaurant takes < 1 day of your time
- [ ] 99.9%+ measured cloud availability for 3 consecutive months
- [ ] Gross margin per site positive after support and hosting

---

## Phase 3 — Scale & vertical expansion (Months 12–20)

**Goal:** multi-vertical, multi-channel, and an ecosystem.

- **QSR/takeaway pack:** delivery zones, drivers, CLI pop-up, order-ahead, driver settlement
- **Retail pack:** barcode, variants, scales, promotions engine, returns/exchanges, ecommerce sync
- **Hotel pack:** Mews + Guestline PMS posting, room charge, outlets, banqueting
- **Own channels:** QR order-and-pay, branded web ordering, self-service kiosk (WCAG 2.2 AA)
- **Uber Eats + Just Eat** direct integrations
- **Developer platform:** public API, webhooks, OAuth apps, sandbox, SDKs, docs
- **App marketplace** v1 with 5–10 launch partners
- **BI:** natural-language querying, warehouse export, Power BI connector
- **Forecasting:** covers/revenue forecast → labour and purchasing suggestions
- Exception reporting & loss prevention
- ISO 27001 programme starts; bug bounty (private)
- Franchise mode

**Exit criteria**
- [ ] 250 sites across ≥ 3 verticals
- [ ] ≥ 15 live integrations, ≥ 5 built by third parties on the public API
- [ ] Payments attach rate > 40% of new sites
- [ ] Net revenue retention > 105%
- [ ] A 10-site group onboarded in < 3 weeks

---

## Phase 4 — Advanced & enterprise (Months 20–30)

**Goal:** the "most advanced in the UK" claim becomes demonstrable, and payments margin
becomes the main business.

- **Managed PayFac** — own the merchant relationship, 30–80 bps
- **AI suite:** natural-language BI, demand forecasting, auto-purchasing, menu
  engineering, anomaly/fraud detection, AI voice ordering for phone and drive-thru,
  AI-assisted support deflection
- **Enterprise:** SSO/SAML, advanced RBAC, dedicated tenancy, custom SLAs, escrow,
  procurement-ready security pack
- **Pay by Bank** as a first-class tender
- **DRS-ready** retail pack ahead of the October 2027 go-live
- ISO 27001 certified; SOC 2 Type II if pursuing US or US-headquartered customers
- Republic of Ireland expansion assessment (different VAT, different regulatory posture)
- Estate-scale operations: 3× peak headroom, chaos engineering in production, per-site SLOs

**Exit criteria**
- [ ] 750+ sites, ≥ 3 enterprise logos (50+ sites each)
- [ ] Payments revenue ≥ 45% of total revenue
- [ ] 99.95% availability sustained for 12 months
- [ ] All ten "most advanced" claims from [01-strategy](01-strategy-and-market.md) §1.3 demoable

---

## Cross-cutting cadences (start in Phase 1, never stop)

| Cadence | Activity |
|---|---|
| Daily | Incident review, per-site health triage, reconciliation exceptions |
| Weekly | Release to a ring; churn-risk review; lost-deal reasons |
| Monthly | Competitor pricing scan; integration SLO review; support-cost-per-site |
| Quarterly | Load test at 3× peak; DR drill (restore from backup, measure RTO/RPO); partner QBRs; pen-test remediation review |
| Annually | Penetration test; PCI evidence refresh; ISO surveillance audit; integration cull |

---

## Sequencing rules (the ones people break)

1. **Reliability before features.** A missing feature loses a deal; an outage on a
   Saturday night loses a customer and their entire network.
2. **One vertical at a time.** Multi-vertical from day one produces a product that is
   mediocre at all of them.
3. **Payments abstraction before the first adapter.** Retrofitting it costs 3× more.
4. **Never sell ahead of the roadmap.** Custom promises made in the sales room are the
   fastest route to an unmaintainable product.
5. **Don't scale support headcount to cover product defects.** Fix the defect. Track
   "tickets per site per month" as a product KPI and drive it down every quarter.
