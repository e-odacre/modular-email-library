# SanEcoTec collection research

Reviewed 2026-09-24. The collection adapts common email layout patterns into this repository's existing component/node system. It does not contain copied third-party template source, paid template assets, or another sender's campaign copy. No additional framework or dependency was installed.

## Email design references

| Reference | What informed our collection | Where it appears |
| --- | --- | --- |
| [Cerberus templates](https://www.cerberusemail.com/templates) and [components](https://www.cerberusemail.com/components) | Narrow single-column messages, composable table layouts, descriptive actions, and explicit mobile fallbacks | Letter introduction, personal follow-up, outlined action, frame previews |
| [Foundation email templates](https://get.foundation/emails/email-templates.html) | Distinct hero, sidebar, marketing, newsletter, and drip structures | Split hero, reading rail, capability trio, illustrated resource pair |
| [Foundation newsletter preview](https://get.foundation/emails/templates/newsletter.html) | A main reading sequence followed by additional destinations | Field-notes and reading-list email recipes |
| [Foundation marketing preview](https://get.foundation/emails/templates/marketing.html) | A lead proposition followed by shorter supporting modules | Welcome, sensor overview, and consulting email recipes |
| [MJML template gallery](https://mjml.io/templates) | Campaign variety built around email-specific composition | Reuse of this project's MJML components instead of importing a second layout system |
| [Maizzle component overview](https://maizzle.com/docs/components/overview) | A reusable component layer beneath complete emails | Brand-local presets and email block lists on top of shared library components |

These references inform layout choices; their email-client test results do not transfer to our implementations. If upstream code is imported in a later batch, inspect its exact license and retain the required attribution with that code.

## SanEcoTec source map

Each block records its source URLs in `sources`, also exposed by the gallery. Text is original draft email copy, limited to invitations, general offering descriptions, and links. Source headings are not a license to invent numerical outcomes or delivery promises.

| Source | Used for |
| --- | --- |
| [Homepage](https://sanecotec.com/) | Brand identity, sector navigation, contact-oriented tone |
| [Water Health Index](https://sanecotec.com/services/water-health-index-app) | Platform, trend-review, and monitoring introductions |
| [Sensors](https://sanecotec.com/services/sensors) | Sensor illustration and the SPI Online / SPI OnTheGo pathways |
| [Consulting](https://sanecotec.com/services/consulting) | System review, operating-practice, and training discussion prompts |
| [Pools](https://sanecotec.com/industries/municipal-commercial-pools) | Pool-operator outreach |
| [Growers](https://sanecotec.com/industries/greenhouses-field-crops) | Incoming water and irrigation-loop outreach |
| [Buildings](https://sanecotec.com/industries/building-water) | Building-system perspective |
| [Drinking water](https://sanecotec.com/industries/drinking-water) | Operator-focused monitoring and record visibility |
| [Process water](https://sanecotec.com/industries/industrial-process-water) | Incoming, treatment, and reuse discussion |
| [Residential](https://sanecotec.com/industries/residential) | A residential service introduction |
| [Article index](https://sanecotec.com/resources/articles) | Published article destinations and editorial imagery |
| [Case-study index](https://sanecotec.com/resources/case-studies) | Pool, grower, and hospital-campus case-study invitations; no quoted outcomes |
| [Education](https://sanecotec.com/resources/education) | Evergreen learning invitations without event dates or availability claims |

## Image handling

The PNG brand logo remains the one used by the first batch. Four public website WebP assets are referenced by URL in `collection/shared.js`. The sensor and monitoring images were visually inspected. Editorial alt text is based on the website's published descriptions. No new product renders, testimonials, or dashboard numbers were fabricated.

WebP is a draft limitation: before inbox delivery, replace these URLs with approved, durably hosted PNG/JPEG equivalents. These are direct public-site URLs, not an image-hosting service provided by this repository. The text-only alternatives are `hero-statement`, `hero-letter`, `editorial-digest`, and `personal-followup`.

## Design decisions

- Navy, primary blue, near-white, and peach panels use observed brand colors through existing token roles. Paper panels explicitly set readable navy text; this is a proposed email composition, not an assertion about official brand guidelines.
- Three existing themes offer restrained (`minimal`), spacious (`editorial`), and heavier (`bold`) typography. These are style previews of the same designs, not 180 unrelated designs.
- Every full email has an organization-address tag and subscription controls. No new Klaviyo variable was introduced.
- No medical, regulatory-compliance, savings, or disinfection-performance guarantees are made by the draft copy.
- The draft tokens remain outside automatic production brand discovery. Nothing in this batch removes unresolved-value flags.
