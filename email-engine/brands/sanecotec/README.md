# SanEcoTec email blocks — draft

This folder is the first brand-specific collection. It composes the existing library components instead of duplicating their MJML. Only public brand information belongs here; account credentials, subscriber data, and private client material do not.

## Browse the expanded collection

```powershell
npm run gallery:brand -- sanecotec
npm run preview
```

Open `http://localhost:3000/brands/sanecotec/` (or `dist/sanecotec/gallery/index.html` directly) for **48 reusable block presets and 12 assembled emails**, each in `minimal`, `editorial`, and `bold` styles. Search by purpose, filter categories, inspect desktop/phone layouts, download a draft HTML email, or copy composition data. The three style previews do not count as additional unique designs. Rebuild the gallery and refresh after editing collection files.

| Group | Presets | Source |
| --- | --- | --- |
| Headers, footers, notice strip | 6 | `collection/frame.js` |
| Editorial markers, navigation, follow-up and sign-off | 4 | `collection/frame.js` |
| Heroes and introductions | 6 | `collection/heroes.js` |
| Platform, sensors and consulting | 6 | `collection/platform.js` |
| Six industry spotlights and two selectors | 8 | `collection/industries.js` |
| Articles, reading lists and training | 6 | `collection/resources.js` |
| Case-study links, preparation and FAQs | 6 | `collection/proof.js` |
| Calls to action | 6 | `collection/actions.js` |

Complete emails in `collection/emails.js` cover welcome, platform tour, sensors, consulting, pools, growers, buildings, water operations, two newsletter formats, training, and follow-up. Content is draft copy and uses public destinations. Research notes and source mapping are in [RESEARCH.md](RESEARCH.md); editing and the future-brand contract are in [the collection guide](../../docs/brand-collections.md).

The original four include-based blocks below are retained as the first approved batch. The expanded catalog is a separate composition layer using the same core components. The normal build and original preview command still work.

## Start here

From the repository root:

```powershell
node brands/sanecotec/preview.js
```

Open `dist/sanecotec/draft/introduction.html` in a browser. This is a draft review email, not an approved sending template. Klaviyo tags stay visible in a browser and resolve in Klaviyo. Output is gitignored. The script validates the token schema, compiles strict MJML, and runs the normal output checks, including subscription links, address tags, and preservation of Klaviyo syntax. It explicitly reports unresolved brand tokens.

The normal `npm run build` and preview gallery do not discover this folder. That keeps the unfinished brand out of all-brand builds and prevents SanEcoTec copy from appearing in another brand's emails. Once the brand values are complete, promote the token file to `tokens/sanecotec.json` and deliberately integrate brand-specific email selection before adding these compositions to the global email directories.

## The first four blocks

| File | Purpose | Existing component |
| --- | --- | --- |
| `blocks/header.mjml` | Logo linked to the public website | `email/header` |
| `blocks/footer.mjml` | Contact links and Klaviyo subscription controls | `email/footer` |
| `blocks/introduction.mjml` | Text-led platform introduction | `hero/text-only` |
| `blocks/consultation.mjml` | Contact invitation with a working page destination | `saas/cta-section` |

`preview.mjml` assembles the four. Each block can also be included individually inside a base-layout email rendered with these brand tokens:

```njk
[% include "brands/sanecotec/blocks/consultation.mjml" %]
```

Edit words and destinations in a block, brand identity in the token file, and block layout choices in its `settings`. These are brand compositions, not newly registered generic components. No shared metadata changed, so generated component reference pages do not need regeneration for this batch.

## Sources and design decisions

Inspected on 2026-09-24:

- [Public website](https://sanecotec.com/): brand spelling, platform offering, and public destinations. Email copy is newly written draft copy based on that offering, not approved campaign copy. No invented testimonials, savings figures, certifications, or dashboard metrics.
- [Main stylesheet](https://sanecotec.com/assets/site.1f7a2a67ff.css): navy `#061E2B`, primary blue `#124C67`, secondary blue `#059EC6`, near-white `#FEFFFE`; Roboto headings and Open Sans body text.
- [Additional stylesheet](https://sanecotec.com/assets/static.82277b2eb4.css): CTA peach `#FEB06A`, link cyan `#6DE6F5`, and the font declarations.
- [Public PNG logo](https://sanecotec.com/assets/a8687bba-4dbe7910-7aed-475f-aa37-e70b41eabeea.950c83db82.png): visually inspected; used instead of the homepage's WebP variant. It is remotely hosted and could change or disappear when the website deploys.
- [Platform](https://sanecotec.com/services/water-health-index-app) and [contact](https://sanecotec.com/about/contact): link destinations. Website modal buttons are replaced by normal page links for email.

The dark navy surface and peach buttons adapt the website to email. The 600px canvas, typography sizes, spacing, radii, and shadows use the library's existing email defaults, not claimed official SanEcoTec guidelines. The logo is displayed at 200px. Font stacks include Arial/Helvetica fallbacks. MJML emits web-font references for Roboto and Open Sans; actual client support and loading determine whether they or the fallback fonts appear.

`tokens.draft.json` is complete structurally but deliberately retains `_placeholders` for success/warning/error roles, muted text, border, and the unused hero image. Status colors and the unused image retain reference values. Muted text temporarily uses the observed near-white for readability; the border uses observed primary blue. Their semantic roles remain unconfirmed. Do not remove these flags merely to make a production build pass.

No separate dark-mode palette is claimed. The email starts dark, and automatic client recoloring is untested. The footer's physical address comes from Klaviyo organization settings, which must be set for SanEcoTec when preparing a send.

## Future commit groups

Nothing should be committed or pushed until explicitly requested. Keep related implementation and checks together:

1. **Brand foundation:** this guide and `tokens.draft.json`.
2. **Email frame:** `blocks/header.mjml` and `blocks/footer.mjml`.
3. **Introduction and consultation:** the other two blocks, `preview.mjml`, and `preview.js`.
4. **Later batches:** industry/service blocks, then resource/case-study blocks, after their content is selected. Each batch gets its own reviewable preview and checks.

Groups 2 and 3 depend on the foundation. These are logical commit boundaries within one working tree, not separate security boundaries. Future committing should stage only the named files for the requested group; leave unrelated files such as `.claude/` alone.

## Review before sending

Review the copy and proportions, resolve the marked tokens, confirm durable image hosting, and test the resulting email in the intended clients and Klaviyo account. Browser review and MJML validation do not establish inbox compatibility. No SanEcoTec email has been sent or checked in a real inbox as part of this work.

## Expanded collection commit groups

The first batch above is already committed. Leave new work uncommitted until requested. Suggested increments for this expansion:

1. Shared collection renderer and gallery tooling: `scripts/lib/brand-collection.js`, `scripts/brand-gallery.js`, `scripts/gallery/`, and the npm command.
2. Brand catalog foundation, frame, and introductions: `collection/shared.js`, `collection/frame.js`, `collection/heroes.js`.
3. Platform and industry presets: `collection/platform.js`, `collection/industries.js`.
4. Resources, case-study/process presets, and actions: `collection/resources.js`, `collection/proof.js`, `collection/actions.js`.
5. Catalog assembly and validation: `catalog.js`, `collection/emails.js`, collection tests, research notes, and documentation links.

The final assembly group makes the gallery discoverable; earlier groups are supporting modules. No generated previews or local browser profiles should be committed.

## Validation recorded for this expansion

On 2026-09-24, all library tests passed, including the new collection tests; the normal build and original SanEcoTec draft preview also passed. All 180 generated previews compiled in strict MJML with the expected address and unsubscribe tags, image alt attributes, no leaked placeholder URLs, and sizes below 102 KB. The largest compiled email was 48,402 bytes.

A local Chrome audit exercised search, category filtering, style selection, the preview dialog, and the phone-width toggle. All 180 previews were checked at a 375px viewport after fonts loaded, with no document-level horizontal overflow or failed images. Selected desktop and phone screenshots were visually reviewed. Browser artifacts are in `dist/sanecotec/gallery/_review/` on the working machine and are not versioned. These results do not establish Outlook, Gmail-app, dark-mode, or Klaviyo-send compatibility.
