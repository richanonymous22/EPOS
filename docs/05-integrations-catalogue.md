# 05 — Integrations Catalogue

Payments are covered separately in [04](04-payments-and-card-integrations.md). This is
everything else.

**Priority key:** P0 = cannot launch without · P1 = needed within 12 months ·
P2 = demand-driven · P3 = later/opportunistic.
**Effort** assumes an Integration Framework already exists (see 04 §4.4).

---

## 5.1 Delivery marketplaces & online ordering aggregators

The single most requested integration category in UK hospitality.

| Partner | Priority | Route | Effort | How to get it |
|---|---|---|---|---|
| **Deliverect** (aggregator) | **P0** | Partner API — one integration reaches Deliveroo, Uber Eats, Just Eat and 100+ others | 3–5 wks | Apply as a POS partner via their developer platform; commercial terms usually per-location per-month, often billed to the merchant (~£40–£90/site/mo) or at a partner rate with rev share |
| **Deliveroo** (direct) | P1 | Public developer portal (`developers.deliveroo.com`) — menu API + order webhooks + site status | 5–8 wks | Apply for POS partner status, build against sandbox, pass their certification, then joint go-live. Deliveroo has run open POS integration since 2018 |
| **Uber Eats** (direct) | P1 | Uber Eats Marketplace API + Uber Direct for courier-as-a-service | 5–8 wks | Uber developer portal, partner application, sandbox, certification |
| **Just Eat Takeaway** (direct) | P1 | Partner API — historically the least open of the three | 6–12 wks | Requires a commercial partner conversation; many POS vendors reach JET only via an aggregator. Budget more calendar time |
| Otter, Vita Mojo, Flipdish, Slerp, Ordering.co | P2 | Various | 2–4 wks each | Merchant-driven |
| **Order with Google / Reserve with Google** | P2 | Google Business Profile + ordering partner integration | 3–5 wks | Free but requires approved-partner status |

**Strategy:** launch with **Deliverect** (weeks, not months, and instantly credible in a
sales demo), then build **direct** Deliveroo and Uber Eats during year one to remove the
per-site aggregator cost and own the menu-sync quality. Keep the aggregator for the long
tail.

**Hard requirements for any delivery integration:** menu sync (including modifiers,
allergens and per-channel pricing), auto-accept rules, item availability push (86-ing
must propagate in seconds), store open/close and pause, prep-time updates, order status
callbacks, and **channel-specific pricing** (delivery menus are typically uplifted
15–30% to absorb commission).

---

## 5.2 Accounting & finance

| Partner | Priority | Route | How to get it |
|---|---|---|---|
| **Xero** | **P0** | Xero Developer app, OAuth 2.0, Accounting API | Free to register; app review required for public apps; if listed on the Xero App Store and billed through it, Xero takes a revenue share (~15%). Certification takes 4–8 weeks. Very large UK SMB share — this is the one to do first |
| **QuickBooks Online (Intuit)** | **P0** | Intuit Developer, OAuth 2.0 | Free registration; mandatory security assessment before production; app store listing optional |
| **Sage Business Cloud / Sage 50** | P1 | Sage Developer | Sage 50 is desktop and messier; large UK installed base in established operators |
| FreeAgent, Zoho Books, Dext, A2X, Nomi | P2 | Public APIs | Demand-driven |
| **Generic export** | **P0** | CSV / journal file / Making Tax Digital-compatible digital link | Build this first — it unblocks every accountant on day one |

**What to sync:** daily sales journal (by department, tax rate and tender), payments and
banking, purchase invoices, stock valuation, tips/tronc as a separate liability account,
gift card liability, and cash variances. **Post summary journals, not per-transaction** —
flooding a customer's Xero with 4,000 lines a day is a classic rookie mistake and gets
you uninstalled.

---

## 5.3 Hotel PMS `[Hotel vertical]`

| Partner | Priority | Route | Effort | Notes |
|---|---|---|---|---|
| **Mews** | P1 | Mews Marketplace + Connector API | 4–6 wks | Modern REST, good docs, marketplace listing, rev-share model. **Start here** |
| **Oracle OPERA / OPERA Cloud** | P1 (enterprise) | OHIP (Oracle Hospitality Integration Platform) | 10–20 wks | Requires Oracle PartnerNetwork membership and formal certification; expect annual partner fees and sometimes per-property fees. Slow but unlocks large hotels |
| **Guestline** | P1 | Guestline API | 5–8 wks | Strong UK independent hotel presence |
| **apaleo**, **Cloudbeds**, **RMS**, **Little Hotelier**, **protel**, **HotelTime** | P2 | Public APIs / marketplaces | 3–6 wks | Demand-driven |

**Minimum viable PMS integration:** guest lookup by room/name, credit-limit check,
charge posting with department mapping, reversal/adjustment, folio query, and end-of-day
reconciliation. Package/inclusive handling comes second.

---

## 5.4 Reservations & table management

| Partner | Priority | Notes |
|---|---|---|
| **ResDiary** | P1 | Very strong UK independent restaurant share |
| **OpenTable** | P1 | Brand recognition; integration via their partner programme |
| **SevenRooms** | P2 | Premium/group segment |
| **DesignMyNight / Collins** | P2 | UK bars and late-night — significant in that segment |
| **TheFork**, **Quandoo**, **Tablein**, **Eat App** | P3 | Demand-driven |

**What good looks like:** two-way sync — booking creates/holds a table on the floor plan;
seating and bill-closing push status back; guest spend history flows to the CRM so the
front-of-house app can show "regular, always orders the Malbec".

---

## 5.5 Rota, HR & payroll

| Partner | Priority | Notes |
|---|---|---|
| **Deputy**, **Planday**, **RotaCloud** | P1 | Push actual hours from clock-in; pull scheduled shifts; sales feed enables labour forecasting |
| **Fourth / S4Labour**, **Harri**, **Bizimply**, **Nory** | P1 | Established UK hospitality workforce platforms |
| **Xero Payroll**, **Sage Payroll**, **BrightPay**, **Employment Hero** | P1 | Hours + **tronc allocations** export. Tronc treatment affects NIC — get this right |
| **Access Group / Workforce** | P2 | Mid-market and enterprise |

---

## 5.6 Stock, purchasing & suppliers

| Partner | Priority | Notes |
|---|---|---|
| **Fourth (Adaco)**, **MarketMan**, **Growyze**, **Kitchen CUT**, **Nory** | P1 | Where the operator already has stock software, don't fight it — integrate |
| **Bidfood, Brakes, Booker, Nisbets, Matthew Clark, LWC** | P1 | Supplier catalogues and EDI ordering. Getting real supplier price files is a genuine moat — start those conversations early, they're slow |
| **Erudus / Foodservice data pools** | P2 | Product, allergen and nutrition data — saves enormous menu-setup effort |

---

## 5.7 Hardware & peripherals

| Category | Devices | Notes |
|---|---|---|
| **Receipt printers** | **Epson** TM-m30III / TM-T88VII (ePOS-Print XML + SDK), **Star Micronics** (CloudPRNT, WebPRNT), Bixolon | Support Epson **and** Star from day one; between them they're most of the UK installed base. CloudPRNT is invaluable for printers behind hostile networks |
| **Label printers** | Zebra, Brother, Star | PPDS allergen labels (Natasha's Law) |
| **Cash drawers** | Any RJ11 kicked from the printer | Trivial, but test the sequences per printer model |
| **POS terminals** | Sunmi (T3/D3/T2), Elo, PAX, Castles, iPad + Heckler/Bouncepad stands | Get vendor SDK/partner accounts for firmware, kiosk mode and OTA |
| **Handhelds** | Sunmi L2/V2, Zebra TC series, iPhone/iPad mini | Battery life and drop-rating matter more than spec |
| **KDS screens** | Elo, Sunmi, generic Android + bump bars | Must survive kitchen heat and grease — specify IP-rated where possible |
| **Kiosks** | Sunmi K2, Elo, Zonal/Vita Mojo-style enclosures | Accessibility: reach range, screen height, audio jack, high-contrast mode |
| **Scales** `[Retail]` | Avery Berkel, Bizerba, CAS | Must be **approved/verified** for trade use under Weights & Measures |
| **Barcode scanners** | Zebra, Honeywell, Datalogic | USB-HID is easy; imaging scanners for phone screens (loyalty QR) |
| **Cash handling** | Volumatic CCi, Tellermate, SafePoint | Counts and safe drops straight into the cash-up |
| **Networking** | Teltonika/Draytek routers with 4G/5G failover, Ubiquiti | **Sell this.** Bad networks cause most "your POS is broken" tickets. A £250 router with automatic failover pays for itself in support cost |
| **Customer displays** | Pole displays, second screens | Price display is a Price Marking Order consideration in retail |
| **Pagers / call systems** | LRS, SpectrumPOS | Table-ready notification for counter service |

---

## 5.8 Customer-facing & marketing

| Category | Partners | Priority |
|---|---|---|
| Loyalty platforms | Como, Airship, Toggle, Yoyo, Stampede, Punchh | P2 (build native first) |
| Email/SMS | Mailchimp, Klaviyo, Twilio, MessageBird | P1 |
| Feedback/reviews | Yumpingo, Feed It Back, Google Reviews API, Trustpilot | P2 |
| Gift cards | One4All, Givex, Toggle, YourGiftCard | P2 |
| Wallet passes | Apple Wallet, Google Wallet | P2 |
| Booking/events | Eventbrite, DesignMyNight | P3 |
| Charity round-up | Pennies, Work for Good | P3 (cheap goodwill, popular in UK retail) |

---

## 5.9 Operations, compliance & site systems

| Category | Partners | Priority | Why |
|---|---|---|---|
| **Age verification / digital ID** | Yoti, Luciditi, OneID | P2 | Challenge 25 workflows; digital ID acceptance is expanding in UK licensing |
| **Address lookup** | Loqate, Ideal Postcodes, getAddress.io | **P0** for delivery | Per-lookup pricing (~2–5p); cache aggressively |
| **Mapping & routing** | Google Maps Platform, Mapbox, HERE | P1 for delivery | Watch the bill — Google Maps can run £500–£5,000/mo on a delivery-heavy estate |
| **On-demand couriers** | Uber Direct, Stuart, Gophr | P2 | Overflow capacity for own-fleet takeaways |
| **HACCP / temperature** | Checkit, Navitas, Monika | P3 | Food safety logs on the same tablet |
| **CCTV exception reporting** | Solink, Envysion, Hanwha | P3 | Loss prevention — high-value for multi-site retail |
| **Energy / BMS** | Smart meters, Utility Aid | P3 | Cost-per-cover analytics |
| **Footfall** | ShopperTrak, Aura Vision | P3 | Retail conversion metrics |
| **Telephony / CLI** | Twilio, Voipfone, Gamma SIP | **P1 for takeaway** | Caller-ID pop-up. Underrated, decisive in the UK takeaway market |
| **eCommerce** `[Retail]` | Shopify, WooCommerce, BigCommerce, Squarespace | P1 for retail | Two-way stock and order sync for omnichannel |
| **Marketplaces** `[Retail]` | Amazon, eBay, Etsy (directly or via ChannelAdvisor/Linnworks) | P2 | |

---

## 5.10 Internal / platform integrations

| Purpose | Tool |
|---|---|
| Support desk & knowledge base | Zendesk, Intercom, HubSpot Service |
| CRM & sales pipeline | HubSpot or Pipedrive |
| Billing & subscriptions | Stripe Billing, Chargebee, or Paddle (Paddle acts as merchant of record — simplifies VAT if you sell internationally) |
| E-signature | DocuSign, Dropbox Sign |
| Status page | Atlassian Statuspage, Better Stack |
| Data warehouse & BI | Snowflake/BigQuery + Metabase/Looker Studio |
| Product analytics | PostHog (self-hostable — good for data-residency answers) |
| Compliance automation | Vanta or Drata (ISO 27001 / SOC 2) |
| Hardware leasing | Shire Leasing, Johnson Reed, BNP Paribas Leasing — see [08-costs](08-costs-non-coding.md) |

---

## 5.11 Integration governance

Rules that stop this catalogue from becoming a maintenance swamp:

1. **No integration without a named customer** (or a clear volume thesis). Every adapter
   costs 10–20% of its build effort per year to maintain.
2. **Every integration has an owner and an SLO** — success rate, latency, and a
   dashboard. If it breaks, it pages someone.
3. **A deprecation policy**: 12 months' notice, published. You will need to remove things.
4. **Certification artefacts stored centrally** — you will be asked for them repeatedly.
5. **Annual review**: usage, revenue attributed, support-ticket cost. Kill the bottom
   decile.
6. **Prefer the merchant's incumbent.** The fastest way to lose a deal is telling an
   operator to change their accountant, their acquirer, or their rota software.

---

## Sources

- [Deliveroo Developer Portal](https://developers.deliveroo.com/)
- [Deliveroo opens up POS integration via API — TechCrunch](https://techcrunch.com/2018/06/07/deliveroo-opens-up-pos-integration-for-restaurant-partners-via-an-api/)
- [Deliverect developer platform](https://developers.deliverect.com/)
- [Dojo Developer Docs](https://docs.dojo.tech/docs)
- [Adyen — Tap to Pay on iPhone](https://docs.adyen.com/point-of-sale/mobile-ios/build/tap-to-pay)
- [Stripe Terminal — Tap to Pay](https://stripe.com/terminal/tap-to-pay)
- [Apple — Tap to Pay on iPhone in the UK](https://www.apple.com/uk/newsroom/2023/07/apple-introduces-tap-to-pay-on-iphone-in-the-uk/)
