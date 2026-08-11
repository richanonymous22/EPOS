# 12 — Master Checklist

Tickable. Work top to bottom.

---

## A. Phase 0 — before you write product code

### Validation
- [ ] 15+ operator interviews recorded and synthesised (mixed vertical and size)
- [ ] 5 EPOS reseller/dealer conversations
- [ ] 3 hospitality accountant conversations (VAT, tips, MTD)
- [ ] Pain points ranked by "would you switch for this?"
- [ ] 5–8 design partners signed with written terms
- [ ] Ten "most advanced" claims ([01](01-strategy-and-market.md) §1.3) agreed and testable

### Technical de-risking
- [ ] Terminal framework spike (React Native vs Flutter) on real target hardware, with frame-timing measurements
- [ ] Offline sync spike: two terminals, 30-minute partition, clean convergence, zero lost orders
- [ ] Live card payment taken end-to-end on real hardware
- [ ] Journal design proven: hash chain, anchoring, verification tool
- [ ] Architecture Decision Records written for stack, sync model, payment model, multi-tenancy

### Commercial & legal
- [ ] Ltd company incorporated, bank account, accountant, solicitor
- [ ] ICO data protection registration
- [ ] Insurance bound: PI, cyber, public liability, employer's liability
- [ ] Name cleared (Companies House, IPO, domains, socials); trade mark filed
- [ ] Contract suite drafted: MSA, SLA, DPA, order form, AUP, NDA, employment + IP assignment
- [ ] Partner conversations opened with Dojo, Adyen, Stripe — programme terms and rev-share appetite understood
- [ ] Budget agreed with 20% contingency; runway floor set

### Kit
- [ ] Reference hardware bought: 2× Android POS, 1× iPad, Epson + Star printers, KDS, handheld, cash drawer
- [ ] Test card terminals obtained from each Tier-1 acquirer

---

## B. Build checklist (Phase 1–2 engineering)

### Foundations
- [ ] Multi-tenant data model with tenant hierarchy and RLS
- [ ] Immutable, hash-chained sales journal — no UPDATE, no DELETE
- [ ] Daily chain anchoring to WORM storage (S3 Object Lock, 7-year retention)
- [ ] Journal verification tool + HMRC evidence-pack export
- [ ] Shared TypeScript domain core (pricing, tax, promotions) running on terminal and server
- [ ] Offline store, outbound queue, HLC ordering, idempotent ingest
- [ ] Conflict strategy implemented per data class ([03](03-architecture.md) §3.2)
- [ ] Device provisioning with per-device mTLS certificates and remote revocation
- [ ] Staged release rings with automatic rollback
- [ ] Observability: per-site health, OpenTelemetry, Sentry, alerting

### Tax & compliance engine
- [ ] Tax resolution on (product × order type × channel × site × date)
- [ ] Historical rate versioning, so historical reports stay correct
- [ ] Golden-file VAT corpus signed off by an accountant
- [ ] Reason codes mandatory on void, discount, refund, no-sale, override, reopen
- [ ] Training mode on a separate chain, structurally excluded from financial reports
- [ ] Gapless, non-resettable Z-read sequence

### Till
- [ ] Catalogue, nested modifiers, price levels, combos
- [ ] Table plan, courses, seats, transfers, splits, merges
- [ ] Holds, recalls, reprints — all journalled
- [ ] Cash management: float, X/Z, pay in/out, safe drop, blind cash-up
- [ ] Staff auth (PIN/fob/biometric), granular RBAC, manager override
- [ ] Full offline trading verified for 72 hours

### Payments
- [ ] Payment Abstraction Layer with canonical interface
- [ ] Adapter conformance test suite (idempotency, recovery, partials, timeouts, reconciliation)
- [ ] In-flight payment record surviving app restart and device reboot
- [ ] Acquirer adapter #1 certified and live
- [ ] Adapter #2 and #3 certified
- [ ] Three-way reconciliation: journal ↔ authorisations ↔ settlement
- [ ] Architecture test enforcing "no PAN in our systems, ever"
- [ ] Surcharging guardrail (no consumer-card surcharges)

### Peripherals
- [ ] Epson and Star printers, kitchen routing rules, receipt templates with scheme-mandated fields
- [ ] Cash drawer kick sequences tested per printer model
- [ ] KDS with bump/recall, stations, timers
- [ ] Label printer for PPDS/allergen labels
- [ ] Device matrix running in CI on real hardware

### Tips & tronc (the flagship)
- [ ] Tip capture by tender, employee, shift, site
- [ ] Allocation engine with effective-dated rule versions
- [ ] Troncmaster role with segregation of duties
- [ ] Statutory payment-deadline enforcement and alerting
- [ ] Worker statements and records-request fulfilment
- [ ] 3-year retention with legal hold
- [ ] Written policy generator with worker acknowledgement
- [ ] Payroll export preserving the tronc/NIC distinction

---

## C. Integration checklist (run per partner)

- [ ] Stage 0: qualified — public docs, sandbox, API covers our canonical operations
- [ ] Stage 1: technical spike complete, failure modes deliberately tested, go/no-go memo written
- [ ] Stage 2: partner programme applied to; named contact and shared channel; rev share / referral terms asked for; MDF and directory listing requested; test hardware obtained
- [ ] Stage 2: partner agreement, DPA and NDA signed; security questionnaire completed
- [ ] Stage 3: adapter built against the conformance suite; merchant linking/boarding flow built; pairing UX doable by a manager in < 2 minutes
- [ ] Stage 4: certification script passed; receipt content verified; sign-off document filed centrally
- [ ] Stage 5: 1–3 pilot merchants live; reconciliation balanced for 14 consecutive days
- [ ] Stage 5: docs, support runbook, support-team training, partner directory listing, launch announcement
- [ ] Stage 6: named owner, SLO dashboard, changelog subscription, QBR scheduled

---

## D. Compliance checklist

### HMRC / financial
- [ ] Append-only journal with verification tool ✅ (see B)
- [ ] No bulk delete, no sale editing, no back-dating — anywhere in the product
- [ ] Written policy for refusing ESS-style customer requests, with a logging process
- [ ] MTD-compatible digital-link export to Xero / QuickBooks / Sage / CSV
- [ ] VAT engine signed off by an accountant

### Employment
- [ ] Tips Act engine complete ✅ (see B)
- [ ] Written tipping-policy template reviewed by an employment solicitor

### Food & licensing
- [ ] 14-allergen data model, recipe-derived, propagating to every channel
- [ ] Product cannot go live without an allergen decision recorded
- [ ] PPDS label printing (Natasha's Law)
- [ ] Calorie (kcal) display on menus, kiosks and online ordering
- [ ] Licensable-hours enforcement with journalled override
- [ ] Challenge 25 prompts, verification-method capture, refusals register
- [ ] Prescribed alcohol measures enforced in the catalogue
- [ ] Approved/verified scales supported for weighed goods
- [ ] Price Marking Order support in retail displays and labels

### Data protection
- [ ] ICO registration current
- [ ] ROPA maintained; DPIAs for AI, biometrics and CCTV features
- [ ] DPA (Art. 28) annex as standard; sub-processor list published with change notice
- [ ] UK/EEA data residency (`eu-west-2`); IDTA/SCCs where any transfer occurs
- [ ] 72-hour breach-notification runbook, tested
- [ ] Retention schedule implemented in code, not policy
- [ ] Merchant-operable DSAR tooling (access, erasure, rectification, portability)
- [ ] PECR-compliant consent capture with audit trail in the marketing module

### Security
- [ ] Cyber Essentials → Cyber Essentials Plus
- [ ] Annual CREST penetration test; remediation tracked to closure
- [ ] PCI DSS v4.0.1 service-provider evidence; quarterly ASV scans
- [ ] SBOM per release; signed artefacts; dependency and container scanning
- [ ] ISO 27001 programme started (Phase 3)

### Accessibility
- [ ] WCAG 2.2 AA on kiosk, QR ordering, web ordering, customer displays
- [ ] Kiosk physical accessibility: reach range, audio output, high contrast, no timeout traps
- [ ] Accessibility statement published

---

## E. Per-site go-live checklist (give this to implementation)

**Pre-install**
- [ ] Site survey: network, power, printer locations, terminal positions, peak times
- [ ] Broadband speed and stability tested; 4G/5G failover router specified
- [ ] Menu captured and built in sandbox; QA'd against the customer's printed menu
- [ ] Tax mapping reviewed item by item (eat-in vs takeaway especially)
- [ ] Staff list, roles, permissions and PINs configured
- [ ] Table plan built to match the actual room
- [ ] Kitchen routing rules defined per station
- [ ] Acquirer confirmed; terminals ordered and pre-paired
- [ ] Delivery channels, zones, fees and uplifted pricing configured
- [ ] Accounting integration connected and mapped
- [ ] Go-live date set — **never a Friday**; Tuesday or Wednesday morning

**Install day**
- [ ] Hardware installed, cabled, labelled; drawer and printer tested
- [ ] Every terminal paired; every printer prints from every terminal
- [ ] Test transactions: cash, card, split, refund, void, tip, each order type
- [ ] Offline test: disconnect the network, take an order, reconnect, confirm sync
- [ ] X/Z read run and explained
- [ ] Manager training (2h) and staff training (45m) delivered
- [ ] Quick-reference cards placed at each till; support number displayed
- [ ] Old system data archived and accessible

**Post go-live**
- [ ] Attend first service (first 3 sites of any group)
- [ ] Day-2 call: reconciliation checked, first cash-up reviewed
- [ ] Day-7 call: reporting walkthrough, open issues cleared
- [ ] Day-30 review: account plan, referral ask, case-study consent
- [ ] Site added to health monitoring and the asset register

---

## F. Launch-readiness checklist (before selling to strangers)

- [ ] 5 design-partner sites trading daily for 6+ consecutive weeks
- [ ] Zero P1 incidents during service for 3 consecutive weeks
- [ ] Reconciliation balanced to the penny for 14 consecutive days
- [ ] 99.9%+ availability for 3 consecutive months, externally measured
- [ ] Public status page and published SLA live
- [ ] Support hours, severity definitions and on-call rota in place
- [ ] 5 case studies with hard numbers, plus 3 reference customers who will take calls
- [ ] Published pricing page
- [ ] Onboarding runbook proven at < 1 day of internal time per single site
- [ ] Security pack ready: pen-test summary, DPA, ROPA, architecture diagram, sub-processor list, Cyber Essentials certificate
- [ ] Migration importers for at least 3 competitor systems
- [ ] Billing, dunning and contract e-signature operational
- [ ] Insurance limits adequate for the contracts you're signing
- [ ] Incident and post-mortem process written and rehearsed
- [ ] Roadmap published to customers

---

## G. Ongoing cadences

| Frequency | Review |
|---|---|
| Daily | Incidents, per-site health, reconciliation exceptions |
| Weekly | Metrics dashboard, churn risk, lost-deal reasons, top ticket drivers, error budget |
| Monthly | Risk register, competitor pricing scan, integration SLOs, support cost per site, runway |
| Quarterly | 3× peak load test, DR drill, partner QBRs, pen-test remediation, compliance watch, integration cull |
| Annually | Penetration test, PCI evidence refresh, ISO surveillance, insurance review, pricing review |
