# 02 — Feature Catalogue

Tiering key:

- **[C] Core** — table stakes. Without it you cannot sell to anyone.
- **[V] Vertical** — needed for a specific vertical pack.
- **[A] Advanced** — expected by multi-site and mid-market operators.
- **[D] Differentiator** — this is where "most advanced in the UK" is earned.

Every item is a candidate epic. Do not build them all before launch — see
[07-roadmap](07-roadmap.md).

---

## 2.1 Till / front-of-house

### Order taking
- [C] Product grid with unlimited pages, colours, images, favourites, search
- [C] Categories, sub-categories, department hierarchy
- [C] Modifiers: required/optional, single/multi-select, min/max, nested modifier groups
- [C] Modifier pricing (add, subtract, replace, priced-by-size)
- [C] Free-text / open item, open price, misc-sale item
- [C] Quantity, decimal quantity (weight/volume), negative quantity
- [C] Void line, void order, quantity reduction — **all with reason codes and audit trail**
- [C] Order notes, line notes, kitchen notes
- [C] Held/parked orders, recall by name/number
- [C] Barcode scanning at till
- [A] Combo / meal deal / set menu builder (fixed price, price-uplift, cheapest-free)
- [A] Upsell prompts and cross-sell suggestions (rule-based)
- [D] AI upsell suggestions driven by basket, weather, time of day, historic attach rate
- [D] Voice order capture for drive-thru and phone orders

### Table service `[V: Restaurant, Bar, Hotel]`
- [V] Visual floor plan editor: multiple rooms/floors/areas, shapes, capacity, merge/split tables
- [V] Table states: vacant, seated, ordered, mains away, dessert, bill dropped, paying, needs clean
- [V] Covers count, seat numbering, seat-level ordering
- [V] Course management: starters/mains/desserts, hold & fire, "away" call, coursing by seat
- [V] Transfer: item→table, table→table, table→tab, waiter→waiter
- [V] Split bill: by seat, by item, by percentage, evenly by N, by custom amount
- [V] Merge bills, partial payment, multiple payment methods per bill
- [V] Table timers and turn-time tracking, colour-coded ageing
- [A] Waiter handheld ordering (Android/iOS) with the same feature set as the fixed till
- [A] Reservation-linked tables (see booking integrations)
- [D] Live "kitchen pacing" — automatic course-fire timing based on kitchen load and prep times

### Bar / pub `[V: Bar]`
- [V] Tabs by name / card pre-auth / room / card swipe-to-open
- [V] Rounds, repeat round, "same again"
- [V] Quick-key drink grids, doubles/singles, mixers, upsell to premium spirit
- [V] Happy hour and time-banded pricing, day-part price levels
- [V] Wet/dry sales split reporting (a UK pub reporting convention — do not skip)
- [V] Measures compliance: 25ml/50ml spirits, 125/175/250ml wine, pint/half — enforced portions
- [V] Cellar / line-cleaning wastage recording
- [A] Pre-auth tab with configurable cap and auto-close at end of session
- [D] Yield/pour analysis vs stock draw-down, with variance alerting per line

### QSR / takeaway `[V: QSR]`
- [V] Order-type routing: eat-in / takeaway / collection / delivery / drive-thru — **each with its own price band and VAT treatment**
- [V] Customer database with address, delivery zone, order history, "usual order"
- [V] Caller ID (CLI) pop-up on inbound call with instant customer lookup — a decisive feature in the UK takeaway trade
- [V] Delivery driver management: assign, cash-out, driver float, driver settlement report
- [V] Delivery zones by postcode / polygon map, per-zone minimum spend and delivery fee
- [V] Order-ahead with scheduled fulfilment times, quoted wait times
- [A] Route optimisation and multi-drop assignment
- [A] On-demand courier dispatch (Uber Direct / Stuart) fallback when own drivers are busy
- [D] Dynamic prep-time quoting from live kitchen load, so quoted times are honest

### Hotel / hospitality `[V: Hotel]`
- [V] Room charge posting to PMS with guest lookup by room/name/folio
- [V] Guest credit limit checking against PMS before posting
- [V] Package/inclusive billing (breakfast included, half board, all-inclusive)
- [V] Multiple outlets under one property: restaurant, bar, spa, room service, mini-bar, conference
- [V] Banqueting / event billing to a master account, function sheets, delegate packages
- [V] Service charge and gratuity rules per outlet
- [A] Cashless resort / wristband accounts, poolside ordering
- [A] Non-resident member accounts, corporate accounts with invoicing terms

### Retail `[V: Retail]`
- [V] Barcode, PLU, SKU, EAN/UPC, multi-barcode per product
- [V] Product variants: size / colour / style matrix
- [V] Integrated scales for weighed goods (approved, verified scale)
- [V] Price embedded barcodes, price-per-unit display
- [V] Promotions engine: BOGOF, 3-for-2, mix-and-match, multibuy, spend-and-save, £ and % off, coupon
- [V] Returns, exchanges, refund to original tender, credit note, gift receipt
- [V] Layaway / special order / customer order
- [V] Serial number and IMEI capture, warranty registration
- [A] Click-and-collect, ship-from-store, endless aisle
- [A] Deposit Return Scheme handling (UK DRS goes live October 2027 — deposit line item, return acceptance, reverse vending reconciliation)

### Payments at the till
- [C] Cash with denomination-aware change calculation and quick-cash buttons
- [C] Card via integrated terminal (see [04-payments](04-payments-and-card-integrations.md))
- [C] Split tender, over-tender, cashback, gratuity at terminal, tip adjust
- [C] Refunds (full, partial, linked to original transaction), voids and reversals
- [C] Non-cash tenders: gift card, voucher, account/on-account, staff discount, complimentary, charity
- [C] "No sale" / drawer open with reason and audit trail
- [A] Pay-at-table handheld, pay-by-QR at table
- [A] Deposits and pre-payments, event ticketing tenders
- [D] Pay by Bank (open banking) as a tender — materially cheaper than cards on high-value tickets
- [D] Store-and-forward card payments where the acquirer supports it, so card keeps working offline
- [D] Split-payment orchestration: one bill, multiple payers, each on their own device

### Cash management
- [C] Till float declaration, blind and sighted cash-up, X-read and Z-read
- [C] Pay-in / pay-out with reason codes, petty cash
- [C] Safe drops, banking declaration, variance reporting
- [A] Multi-drawer, drawer-per-user, shared drawer modes
- [A] Cash-counting device integration (Volumatic CCi, Tellermate)
- [D] Cash variance anomaly detection by user, shift and site with automatic escalation

### Staff, security & anti-fraud
- [C] Staff login by PIN, magnetic fob, RFID, barcode badge or biometric
- [C] Role-based permissions with granular action-level control (who can void, discount, refund, reopen)
- [C] Manager override with reason capture
- [C] Clock in / clock out, break tracking
- [A] Time & attendance export to payroll, holiday and absence markers
- [A] Training mode that is provably segregated from live figures
- [D] Exception reporting engine: voids after payment, high discount rates, refunds without a customer present, no-sales, repeated re-prints — scored per employee, with trend and peer comparison
- [D] CCTV overlay of transaction data (Solink/Envysion-style) for loss prevention

---

## 2.2 Kitchen & production

- [C] Kitchen printing with routing rules by product, category, order type and station
- [C] Print grouping, consolidation, re-print, cancel chits
- [A] Kitchen Display System (KDS): multi-station, bump/recall, all-day counts, item-level timers
- [A] KDS routing: hot/cold/grill/pass/expo stations, dynamic load balancing
- [A] Order status: preparing → ready → collected, with customer-facing display board and SMS
- [A] Recipe / bill of materials with yields, sub-recipes, and prep items
- [A] Prep lists and production planning from forecast
- [A] Waste recording by reason (spoilage, staff, comp, breakage) with cost impact
- [V] PPDS allergen label printing (Natasha's Law) direct to label printer with ingredient list
- [D] Kitchen load-aware throttling: automatically extend quoted times or pause online channels when the kitchen is over capacity
- [D] Video/AI order accuracy check at the pass (later phase)

---

## 2.3 Menu, product & pricing management

- [C] Central product catalogue with site-level overrides
- [C] Multiple price levels / price bands (dine-in, takeaway, delivery, happy hour, staff)
- [C] Per-channel and per-order-type VAT rules (critical in the UK — see [06-uk-compliance](06-uk-compliance.md))
- [C] Scheduled menus by day-part with automatic switching
- [C] Product availability / 86-ing, with countdown stock
- [A] Menu versioning, draft → approve → schedule → publish workflow
- [A] Estate-wide publish with per-site targeting, staged rollout and rollback
- [A] Nutrition and calorie data per item (mandatory on menus for larger operators in England)
- [A] Allergen matrix (14 allergens) per product, recipe-derived, propagating to all channels
- [D] Menu engineering: contribution margin × popularity quadrant analysis with rewrite suggestions
- [D] AI-assisted menu build — photograph or PDF of an existing menu in, structured catalogue out. This is the single biggest reduction in onboarding cost; make it excellent.

---

## 2.4 Inventory & supply chain

- [C] Stock levels per site, per location within site (bar, cellar, kitchen, store)
- [C] Goods-in / receiving against purchase order, discrepancies
- [C] Stock takes: full, partial, rolling, by area, on handheld
- [C] Stock movements, transfers between sites, wastage
- [A] Purchase orders with supplier catalogues and price lists
- [A] Supplier invoice matching (3-way match: PO, delivery note, invoice)
- [A] Theoretical vs actual usage variance, GP% by product/category/site
- [A] Par levels and automatic reorder suggestions
- [A] Cost price history, weighted average cost, last cost, standard cost
- [D] Forecast-driven purchasing: demand forecast → suggested PO → one-click send to supplier via EDI/email
- [D] Supplier price-change alerting and basket benchmarking across your customer base (anonymised)

---

## 2.5 People, rota & tips

- [C] Employee records, roles, pay rates, sites
- [C] Clock in/out with photo or PIN, break rules
- [A] Rota / scheduling with forecast-driven labour recommendations
- [A] Labour cost % vs sales, live and by day-part
- [A] Payroll export (Xero, Sage, Employment Hero, or generic CSV/FPS-ready)
- [D] **Tronc & tips engine** — the flagship UK differentiator:
  - Capture tips by tender type, employee, shift, site (card tips, cash tips, service charge)
  - Configurable allocation rules: points-based, hours-based, role-weighted, per-site pools
  - Troncmaster independence controls and audit separation
  - Enforce payment by end of the month following receipt
  - Immutable tip ledger and worker-visible statements
  - Written policy generator and 3-year record retention with worker request fulfilment
  - Reports formatted for the statutory Code of Practice and for NIC treatment evidence
- [D] Worker app: shifts, payslip-adjacent tip statements, shift swaps, availability

---

## 2.6 Customers, loyalty & marketing

- [C] Customer records, contact details, marketing consent flags (PECR-compliant)
- [C] Order history, spend, frequency, last visit
- [A] Loyalty: points, stamps, tiers, spend-based rewards, birthday rewards
- [A] Gift cards and vouchers (single and multi-purpose — VAT treatment differs)
- [A] Account customers with credit limits, statements and invoicing
- [A] Email/SMS campaigns with segmentation
- [A] Apple Wallet / Google Wallet loyalty passes
- [D] RFM segmentation and automated lifecycle campaigns (lapsing customer, first-visit follow-up)
- [D] Cross-channel identity resolution: same customer on till, kiosk, web, app and delivery marketplace
- [D] Attribution: which campaign produced which covers and what margin

---

## 2.7 Ordering channels (your own, not marketplaces)

- [A] QR order-and-pay at table (no app install, PWA)
- [A] Branded web ordering for collection and delivery
- [A] Self-service kiosk (accessible, WCAG 2.2 AA, calorie display, allergen filter)
- [A] Branded native mobile app (white-label)
- [A] Drive-thru with lane management and order-ahead matching
- [D] Direct-ordering economics dashboard: shows the operator exactly how much marketplace commission they saved by moving customers to your channel — the strongest retention argument you have

---

## 2.8 Back office, reporting & BI

- [C] Sales by product, category, site, hour, day-part, employee, tender, order type
- [C] X/Z reads, end-of-day, banking summary, VAT summary
- [C] Discount, void, refund and no-sale reports
- [C] Multi-site consolidated dashboards and league tables
- [A] Scheduled report delivery by email
- [A] Budgets vs actuals, like-for-like comparison, weather-adjusted comparison
- [A] Live "trading now" dashboard with alerting
- [A] Data export: CSV, API, direct warehouse sync (Snowflake/BigQuery), Power BI connector
- [D] Natural-language BI: type a question, get a chart and the SQL it ran
- [D] Anomaly detection and proactive insight push ("Site 12's GP is 4pts below the group on draught — likely line loss")
- [D] Forecasting: covers, revenue and item-level demand by day-part

---

## 2.9 Platform, administration & devices

- [C] Multi-tenant organisation → brand → region → site → area → terminal hierarchy
- [C] User management, SSO (SAML/OIDC) for enterprise, 2FA
- [C] Full audit log of every configuration change, who and when
- [A] Site templates and cloning for rapid rollout
- [A] Remote device management: device health, versions, printer status, offline alerts
- [A] Staged software rollout: canary → ring 1 → ring 2 → all, with instant rollback
- [A] Franchise mode: royalty calculation, franchisee-restricted config, brand-locked menus
- [D] Remote support: view and control a terminal with consent, with session recording
- [D] Self-serve site provisioning — the operator can add a site themselves in under 90 minutes

---

## 2.10 Developer platform `[D]`

Treat this as a first-class product from Phase 2, not an afterthought.

- Public REST + GraphQL API covering catalogue, orders, payments, customers, stock, employees, reporting
- Webhooks for every domain event, with retries, signing and a replay console
- OAuth 2.0 app authorisation with per-scope consent by the merchant
- Sandbox with seeded demo estate, and a terminal simulator
- SDKs: TypeScript, Python, PHP (PHP matters — a lot of UK hospitality tooling is PHP)
- App marketplace with merchant-side one-click install, billing and revenue share
- Public status page, changelog, deprecation policy with 12-month notice

---

## 2.11 Non-functional requirements (write these into the definition of done)

| Area | Target |
|---|---|
| Till responsiveness | < 100 ms from tap to visual feedback, always, including offline |
| Order-to-kitchen latency | < 2 s online, < 1 s on LAN |
| Offline tolerance | 72 hours fully offline trading, then graceful degradation |
| Sync convergence | Full estate consistent within 60 s of connectivity restore |
| Cloud availability | 99.95% monthly, measured externally, published on a status page |
| Recovery | RPO ≤ 60 s, RTO ≤ 30 min |
| Data residency | UK region primary (AWS eu-west-2 / Azure UK South), UK/EEA backups only |
| Terminal cold start | < 20 s to order-ready |
| Accessibility | WCAG 2.2 AA for all customer-facing surfaces (kiosk, QR, web ordering) |
| Localisation | en-GB first; Welsh language support for Wales (public-facing screens); multi-language kiosk |
| Peak load | 3× Christmas-Eve peak headroom, load-tested quarterly |
