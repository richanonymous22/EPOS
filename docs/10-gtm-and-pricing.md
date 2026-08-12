# 10 — Go-to-Market & Pricing

---

## 10.1 Pricing model

Five revenue lines. The mistake is relying on the first one.

### 1. Software subscription (per site + per terminal)

| Tier | Target | Price | Includes |
|---|---|---|---|
| **Essential** | Cafés, single-site independents | **£49/site/mo** + £25 per extra terminal | Till, payments, printing, core reports, 1 vertical pack, email support |
| **Professional** ✅ most customers | Restaurants, bars, takeaways | **£99/site/mo** + £35 per extra terminal | + KDS, stock, tips/tronc engine, delivery integrations, accounting sync, handheld, loyalty, phone support |
| **Multi-site** | Groups of 3–50 | **£149/site/mo** + £35 per terminal | + consolidated reporting, estate publish, franchise mode, API access, priority support |
| **Enterprise** | 50+ sites, hotels | **Quote** (typically £180–£320/site/mo) | + SSO, dedicated tenancy, custom SLA, named CSM, escrow, 24/7 P1 |

**Add-on modules** (£15–£45/site/mo each): self-service kiosk, branded web ordering,
branded mobile app, advanced BI & forecasting, AI suite, PMS connector, DRS/retail
compliance pack, loss prevention.

**Pricing principles**
- Publish your prices. The UK EPOS market is full of "request a quote" — transparency is
  a differentiator and it filters out tyre-kickers.
- **Annual contracts, monthly billing**, 10–15% discount for annual pre-pay. Avoid the
  36–60 month lock-ins the incumbents use — make "you can leave" a selling point, and win
  on retention instead.
- Never discount the list price; discount the *onboarding fee* or add months. Discounted
  MRR never recovers.
- Index-linked annual increase clause (CPI capped at ~5%) in every contract from day one.

### 2. Payments (the real business)
20–40 bps under revenue share; 30–80 bps under managed PayFac. See
[04-payments §4.6](04-payments-and-card-integrations.md). At scale this typically exceeds
software revenue.

### 3. Hardware
20–35% margin on resale, or introducer commission via a leasing partner. Don't compete
on hardware price — bundle it.

### 4. Services
Onboarding/implementation £250–£1,500 per site (charge it — free onboarding attracts
customers who won't do the work and churn). Additional training £300/day. Custom
integration work £700–£1,100/day.

### 5. Marketplace
15–20% revenue share on third-party apps. Small at first; strategically important because
it makes the platform the default place to build.

---

## 10.2 Unit economics (Professional tier, worked)

| Line | Monthly |
|---|---|
| Subscription (avg 2.2 terminals) | £141 |
| Add-on modules (avg 0.8 attached) | £24 |
| Payments (£45k/mo processed × 30 bps) | £135 |
| Hardware amortised margin | £15 |
| **Total ARPU** | **£315/site/mo** |
| Hosting, MDM, third-party costs | −£28 |
| Support (allocated) | −£45 |
| Payment partner costs | −£12 |
| **Gross profit** | **£230 (73%)** |

| Metric | Target |
|---|---|
| CAC | £1,200 (year 1) → £700 (year 3) |
| Payback | ~5 months |
| Gross logo churn | < 12%/yr (hospitality closure rate alone is ~5–8%) |
| Net revenue retention | > 110% |
| LTV (4-yr life) | ~£11,000 |
| LTV:CAC | > 9:1 |

At **500 sites**: ~£1.9m ARR, ~£1.4m gross profit. At **1,500 sites**: ~£5.7m ARR.

---

## 10.3 Channels, in order of effectiveness

1. **Referrals from existing customers** — the dominant channel in UK hospitality.
   Operators cluster (same landlord, same brewery, same accountant, same suppliers).
   Formalise it: £300 credit for both parties, and *ask* at the day-30 check-in.
2. **Payment partner referrals** — Dojo, Adyen, Stripe and bank acquirers all have
   merchant bases wanting a better till. Get on their partner directories. This is why
   §4.4 Stage 2 insists on partner-directory listing.
3. **Accountants and hospitality bookkeepers** — they influence system choice heavily,
   especially where the tips/tronc and VAT story is strong. Build an accountant partner
   programme with a revenue share and a partner portal.
4. **Resellers / dealers** — the traditional UK EPOS channel. A network of regional
   dealers gives you local installation and support without headcount. They'll want
   20–35% margin and a proper dealer portal. Worth it from Phase 3.
5. **Brewery, pubco and franchise relationships** — one agreement can put you into
   dozens of sites. Long sales cycles, huge payoff.
6. **Trade shows** — HRC at ExCeL, Restaurant & Bar Tech Live, Casual Dining Show, Retail
   Technology Show. Expensive but this sector still buys in person.
7. **Content & SEO** — win the compliance long-tail: "Tips Act EPOS", "HMRC till
   records", "EPOS VAT eat in takeaway", "Natasha's Law labels EPOS", "DRS ready till".
   These have commercial intent and no incumbent owns them.
8. **Paid search** — expensive (£8–£30 CPC) but converts. Use for competitor-alternative
   pages and bottom-of-funnel terms only.
9. **Outbound** — works for multi-site groups, not for independents.

---

## 10.4 Sales process

| Stage | Activity | Duration |
|---|---|---|
| Qualify | Sites, current system, contract end date, acquirer, pain | 15 min |
| Discovery | Understand their service model, not their feature list | 30–45 min |
| Demo | Configured with **their menu** — this alone wins deals | 45 min |
| Site visit | For 3+ sites, always | 2 hours |
| Proposal | Fixed pricing, clear onboarding plan, named go-live date | — |
| Reference call | With a similar operator | — |
| Close | E-signed contract, deposit, install date | — |

**Independents: 2–6 weeks. Small groups: 1–3 months. Enterprise: 6–18 months.**

**Objection handling — prepare these:**
- *"We're locked in until next March."* → Diary it, offer a parallel pilot at one site,
  and offer buy-out contribution as a closing lever.
- *"We'd have to change card provider."* → You don't. Show two acquirers running side by
  side. **This is your single strongest objection-killer.**
- *"We've been burned by a cloud till going down."* → Pull the network cable during the
  demo and keep taking orders.
- *"You're new / small."* → Design-partner references, published status page and uptime
  history, escrow, and a shorter contract than the incumbent offers.
- *"It's cheaper elsewhere."* → Total cost of ownership: card fees, support downtime,
  tronc software, reconciliation labour, hardware lock-in.

---

## 10.5 Launch plan

| When | Action |
|---|---|
| Phase 0 | Holding page collecting waitlist; start the content engine now — SEO takes 9 months to bite |
| Phase 1 | Private beta with design partners; no public claims until the product survives six weeks |
| Phase 2 | Public launch: 5 case studies with hard numbers, published pricing, first trade show, partner directory listings, PR to Propel Info / BigHospitality / The Caterer |
| Phase 3 | Vertical launches (QSR, retail, hotel) as separate campaigns with their own case studies; dealer programme opens; developer platform launch with a hackathon |
| Phase 4 | Enterprise campaign; payments proposition front and centre; industry awards submissions |

---

## 10.6 Metrics dashboard

**Growth:** new sites/mo, pipeline coverage, CAC by channel, win rate, sales-cycle length.
**Retention:** logo & revenue churn, NRR, NPS (target > 50), reason-for-churn log.
**Product:** tickets per site per month, uptime, P1 count, offline events, time-to-first-transaction.
**Financial:** ARR, ARPU, gross margin, payments attach rate & bps, months of runway.
**Payments:** attach rate, processed volume, bps realised, chargeback rate.

Review weekly. The two leading indicators of failure are **rising tickets per site** and
**falling payments attach rate** — both show up months before churn does.
