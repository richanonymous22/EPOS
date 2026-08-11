# 09 — Team, Support & Operations

Software is maybe half of an EPOS business. The other half is getting hardware into
buildings, training staff who turn over three times a year, and answering the phone at
9pm on a Saturday. Competitors lose customers here far more often than on features.

---

## 9.1 Team by phase

| Phase | Roles | Headcount |
|---|---|---|
| **0–1** | Founder/product, 2–3 senior engineers, 1 QA | 4–5 |
| **2** | + mobile/device engineer, payments/integrations specialist, implementation consultant, 2 support agents, 1 BDM | 9–12 |
| **3** | + 2–3 engineers, 2 support, field engineer, customer success, marketing manager, 2 sales | 16–22 |
| **4** | + engineering leads, data/AI engineer, security/compliance lead, finance/ops, enterprise AE, more support | 28–40 |

**The three hires people get wrong:**

1. **QA engineer too late.** In POS, a pricing bug is a financial incident across every
   customer simultaneously. Hire QA in Phase 1, not Phase 3.
2. **A support lead too late.** By the time support is on fire it's too late to design
   the function. Hire someone who has run hospitality support by month 8.
3. **Hiring salespeople before the product retains.** Selling into a leaky bucket burns
   both cash and your reputation in a market where operators all know each other.

**The one hire that pays for itself fastest:** an **ex-EPOS implementation consultant**
from a competitor (Zonal, ICRTouch, Epos Now, Lightspeed). They bring the install
playbook, the objection handling, the migration tricks, and often a relationship network.
Worth paying above market.

---

## 9.2 Support — the operating model

**Tiering**

| Tier | Handles | Target |
|---|---|---|
| L0 | Self-serve: in-product help, guided troubleshooting, status page, community | Deflect 30–40% |
| L1 | Password resets, printer offline, menu edits, "how do I", card terminal pairing | Resolve 70–80% of contacts |
| L2 | Config problems, integration failures, reconciliation discrepancies | Resolve 15–25% |
| L3 | Engineering — bugs, data corruption, platform incidents | < 5% |

**Hours.** This is a hard commercial requirement:

- Phase 1–2: 8am–11pm, 7 days, plus overnight on-call for P1
- Phase 3+: 24/7, with genuine cover on Friday/Saturday nights, bank holidays,
  Christmas Eve and New Year's Eve — the highest-revenue, highest-risk hours in the sector
- Publish response targets and honour them. SLA credits are cheap; a lost Saturday isn't

**Channels:** phone first (hospitality operators call, they don't raise tickets),
then in-product chat, WhatsApp (widely used by independent operators), and email.

**Severity definitions**

| Sev | Definition | Response | Resolution target |
|---|---|---|---|
| P1 | Site cannot trade or cannot take payment | 15 min, 24/7 | 2 hours or documented workaround |
| P2 | Major function degraded (KDS down, printing down, one channel down) | 1 hour | Same day |
| P3 | Feature issue, workaround exists | 4 business hours | 5 business days |
| P4 | Cosmetic, question, request | 1 business day | Backlog |

**Support-as-product.** Every ticket is a product defect until proven otherwise. Tag
every ticket with a root-cause category, review weekly, and give engineering a standing
"top 5 ticket drivers" objective each sprint. Track **tickets per site per month** as a
board-level KPI.

**The single biggest ticket source is networking.** Sell or mandate a managed router
with 4G/5G failover. It removes an entire category of "your system is broken" calls,
and you can charge for it.

---

## 9.3 Onboarding & implementation

Onboarding cost determines whether you can profitably serve independents. Target: a
single-site restaurant live in **one day of your team's time**, and a self-serve site in
**90 minutes with no involvement from you at all**.

**Standard implementation runbook**

1. **Pre-sales survey** — sites, terminals, network, printers, current acquirer, current
   system, menu size, go-live date, peak trading times
2. **Data capture** — menu (photo/PDF → AI import), staff list, table plan, tax mapping,
   opening hours, delivery zones
3. **Build** — configure in a sandbox tenant, internal QA against a checklist
4. **Hardware staging** — image, label, pre-pair, test print, box with a printed quick-start
5. **Install** — on-site or remote; network check, device pairing, terminal pairing, test
   transactions, printer routing verification
6. **Training** — 2 hours for managers, 45 minutes for staff, plus laminated quick-cards
   at each till and short videos in-product
7. **Go-live** — attend the first service in person for the first 3 sites of any group
8. **Day 2, Day 7, Day 30 check-ins** — with a specific agenda, not "how's it going"
9. **Handover to customer success** with a written account plan

**Migration from a competitor.** Build importers for the common UK systems (Epos Now,
Lightspeed, Square, Zonal, ICRTouch exports) — product catalogue, customers, gift card
balances, and historic sales summaries. "We'll bring your data across" removes the single
biggest switching objection.

**Never go live on a Friday.** Tuesday or Wednesday morning, always.

---

## 9.4 Hardware operations

| Function | Approach |
|---|---|
| Sourcing | 2 distributors per category — never single-source. Watch USD/EUR exposure and lead times (8–16 weeks on some POS hardware) |
| Staging | In-house until ~30 sites/month, then a 3PL that can image and kit |
| Stock holding | 4–8 weeks of forecast demand; 5–8% spares pool |
| Logistics | Next-day courier with pre-noon option; track by site |
| RMA | Advance replacement for anything trading-critical — ship the replacement before the faulty unit comes back. It costs float and buys enormous goodwill |
| Asset register | Every device serialised, linked to site and tenant, with warranty dates. Essential for support and for theft/loss |
| End of life | 3–5 year refresh cycle; plan the upsell, and handle WEEE disposal properly |

---

## 9.5 Internal systems to stand up (Phase 2)

- CRM (HubSpot/Pipedrive) — pipeline, sites, renewal dates
- Support desk with a customer-facing knowledge base
- Asset/inventory register (can start in the product itself)
- Contract & e-signature (DocuSign)
- Billing with automated dunning — hospitality has plenty of failed cards
- Internal wiki with runbooks: every P1 has a written runbook before it recurs
- On-call rota and paging (PagerDuty/Opsgenie)
- Incident management with blameless post-mortems published to customers for P1s

---

## 9.6 Reliability operations

- **Error budgets.** 99.95% monthly = ~22 minutes of downtime. When the budget is spent,
  feature work stops until reliability work restores it. Enforce this.
- **Change freezes** on the highest-risk trading periods: Fri/Sat evenings, bank
  holidays, Valentine's Day, Mother's Day, Christmas period, New Year's Eve.
- **Per-site health** as a support-facing dashboard: last sync, offline duration, printer
  status, terminal status, app version, error rate. Support should see a site's problem
  before the customer calls.
- **Proactive outreach.** If a site's printer has been offline for 20 minutes, ring them.
  This converts a future complaint into a testimonial.
- **Quarterly DR drill** — restore from backup into a clean account, measure RTO/RPO,
  write it up.
- **Public status page and honest post-mortems.** UK hospitality operators talk to each
  other constantly; being visibly honest about an outage is better than being quiet.

---

## 9.7 Culture rules specific to POS

1. Every engineer does a **support shift** once a month and an **on-site install** once a
   quarter. Nothing else produces the same empathy for the product.
2. **Dogfood in a real venue** — run the office café or a partner site on the product.
3. **A "Saturday night" test** before any significant release: would you be comfortable
   with this deploying to a 300-cover restaurant at 8pm? If not, it isn't ready.
4. Publish the roadmap to customers. Operators forgive a missing feature; they don't
   forgive being surprised.
