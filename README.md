# UK EPOS / Till Platform — Master Plan

A complete build plan for a multi-vertical EPOS (Electronic Point of Sale) platform
targeting the United Kingdom market: restaurants, bars/pubs, QSR & takeaway, cafés,
hotels & hospitality, and retail.

**Goal:** the most advanced EPOS platform in the UK market — measured by depth of
compliance, payment flexibility, offline reliability, integration breadth, and an open
developer ecosystem.

---

## How to read this

| # | Document | What it answers |
|---|---|---|
| 01 | [Strategy & Market](docs/01-strategy-and-market.md) | Who we beat, where the gap is, what "most advanced" concretely means |
| 02 | [Feature Catalogue](docs/02-feature-catalogue.md) | Every feature, by module and vertical, tiered Core → Differentiator |
| 03 | [Technical Architecture](docs/03-architecture.md) | Offline-first design, stack, multi-tenancy, the immutable sales ledger |
| 04 | [Payments & Card Machines](docs/04-payments-and-card-integrations.md) | Every UK acquirer, integration models, how to certify, payment economics |
| 05 | [Integrations Catalogue](docs/05-integrations-catalogue.md) | ~90 integrations, priority, effort, and how to actually get each one signed |
| 06 | [UK Compliance & Legal](docs/06-uk-compliance.md) | HMRC ESS, Tips Act, VAT, allergens, licensing, PCI, UK GDPR, DRS |
| 07 | [Roadmap](docs/07-roadmap.md) | Phase 0–4, month by month, with exit criteria per phase |
| 08 | [Costs (Non-Coding)](docs/08-costs-non-coding.md) | **The money question** — every cost that is not writing code |
| 09 | [Team, Support & Operations](docs/09-team-support-operations.md) | Who you hire, 24/7 support, installs, hardware logistics |
| 10 | [Go-to-Market & Pricing](docs/10-gtm-and-pricing.md) | Pricing model, unit economics, channels, CAC/LTV |
| 11 | [Risk Register](docs/11-risks.md) | What kills this business and how to de-risk it |
| 12 | [Master Checklist](docs/12-master-checklist.md) | Tickable checklists: build, compliance, integration, launch, per-site install |

---

## The one-paragraph version

Build a cloud-managed, **offline-first** EPOS on a single multi-tenant core with
swappable *vertical packs* (Restaurant, Bar, QSR/Takeaway, Hotel, Retail). Never touch
card data — integrate semi-integrated to multiple UK acquirers behind your own payment
abstraction layer, then graduate to managed payment facilitation where the real margin
is. Win on three things UK incumbents are weak at: an **immutable, hash-chained sales
journal** that makes HMRC Electronic Sales Suppression compliance a selling point; a
**native tronc/tips engine** that satisfies the Employment (Allocation of Tips) Act
2023 without bolt-on software; and an **open API + app marketplace** from day one.
Budget **£700k–£1.2m of non-engineering cash over 24 months** for a serious attempt,
and treat **24/7 support** as a product feature, not an overhead.

---

## Status

This repository currently contains the plan only. Implementation has not started.
Next action: read [docs/07-roadmap.md](docs/07-roadmap.md) Phase 0 and
[docs/12-master-checklist.md](docs/12-master-checklist.md) § Phase 0.
