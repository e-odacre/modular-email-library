# Laravel migration

Handoff for Evan's email-building workspace. Recorded 2026-09-25.

## Start here

Evan has decided to move this project into a new Laravel project and repository for a better application foundation. The destination has not been supplied yet. This document prepares that move; no Laravel migration has been performed.

When Evan points you to the new location, read this document and the actual source working tree before starting. Preserve the working email engine, content, tests, and brand research. Build the Laravel application around them rather than rewriting the email system in PHP.

Source workspace: `C:\Users\evano\herd\modular-email-blocks`.
Repository recorded in `package.json`: `https://github.com/e-odacre/modular-email-blocks`.
Current HEAD at handoff: `ae6ad0b` (`Document SanEcoTec design research collection workflow and validation`). Recheck Git status and HEAD when migrating.

**The local working tree is essential. A clone of HEAD alone will miss the latest studio interface.** At handoff these changes are uncommitted:

- Modified: `scripts/preview.js`, `docs/getting-started.md`.
- New: `scripts/lib/studio.js`, `scripts/gallery/studio.css`, `scripts/gallery/studio.js`, and this document.
- `.claude/` is unrelated, pre-existing untracked local material. Do not stage, delete, or treat it as application source by default.

The source repo should remain available until the destination works and migration parity has been verified. Do not delete it, commit, push, or deploy as part of merely reading this handoff.

## Product direction: an internal tool

This is for Evan and the people making emails. It is not a client-facing marketing website.

Evan liked the SanEcoTec page's visual design and ease of access and requested that approach across the site. The first redesign carried over the colors, previews, and controls, but also added oversized promotional headings. Evan explicitly corrected that direction:

> “this isnt for another client this is for the guys making the emails so me. i dont need flashy headlines or anything that you would put to try to sell a pretty site.”

For the migrated application:

- Keep useful visual previews, straightforward navigation, search, filters, style selection, and accessible controls.
- Use direct labels such as Emails, Components, Recipes, Brands, Preview, and Export.
- Reduce decorative space, large introductions, promotional copy, and unnecessary scrolling.
- Prioritize finding a design, inspecting its variants, composing emails, and exporting usable HTML.
- Distinguish the workspace interface from the emails themselves. The app's visual style must not alter another brand's email identity.

The previous interface remains in the source as a reference, not a final copy/layout specification. No changes were made in response to Evan's correction because he requested advice only at that point.

## Current inventory

This is a CommonJS Node project requiring Node 20 or newer. Its only direct runtime dependencies are MJML (`^5.4.1`) and Nunjucks (`^3.2.4`); preserve `package-lock.json` for reproducibility.

| Asset | Current state |
| --- | --- |
| Generic components | 116 registered components, with metadata and variants |
| Reusable sections | 11 |
| Generic recipes | 12 |
| Style themes | 13 |
| Globally discovered emails | `flows/welcome.mjml`, `examples/client-test.mjml`, `examples/summer-collection.mjml` |
| Production token discovery | Only `tokens/placeholder.json`; no completed real production brand |
| Brand collection | SanEcoTec: 48 block presets and 12 complete emails in 3 styles |
| Tests | 285 passing in the most recent full run |

Counts are a snapshot; discover them from the registries if source files change.

Themes: `minimal` (default), `luxury`, `editorial`, `bold`, `playful`, `ecommerce`, `saas`, `wellness`, `fashion`, `christmas`, `black-friday`, `valentines`, `summer`.

Recipes: `welcome`, `abandoned-cart`, `back-in-stock`, `black-friday`, `event`, `newsletter`, `post-purchase`, `product-launch`, `review-request`, `saas-feature-launch`, `sale`, `win-back`.

## What to carry over

| Path | Purpose and migration treatment |
| --- | --- |
| `components/` | Preserve all `.njk` templates, `.meta.js` metadata, partials, and shared helpers. |
| `layouts/` | Preserve the base email layout, responsive rules, and dark-mode handling. |
| `tokens/` | Complete brand token schemas and placeholder reference. |
| `themes/` | Complete style presets; separate from brand identity. |
| `sections/`, `recipes/` | JavaScript composition builders and preview data. |
| `variables/` | Klaviyo variable registry, sources, and verification markers. |
| `flows/`, `campaigns/`, `examples/` | Email source files; examples remain placeholder-only for normal builds. Preserve an empty campaigns directory conceptually even if Git omits it. |
| `brands/` | All brand-specific content, catalogs, draft tokens, research, and original includes. |
| `scripts/lib/` | Rendering, discovery, validation, composition, and style engine. `studio.js` is UI generation, not email rendering. |
| `scripts/build.js`, `remix.js`, `docs.js`, `new-component.js`, `new-theme.js` | Keep CLI workflows functional during migration. |
| `scripts/brand-gallery.js`, `scripts/gallery/gallery.*` | Existing reusable static brand gallery generator and interface. |
| `scripts/preview.js`, `scripts/gallery/studio.*` | Current development server and shared studio UI; port their useful behavior into Laravel. |
| `tests/` | Preserve every suite and fixture. |
| `docs/`, `README.md`, `CLAUDE.md` | Preserve reference material, limitations, and implementation rules. |
| `package.json`, `package-lock.json`, `.gitignore` | Retain engine dependency and build configuration; adapt paths deliberately. |

Do not copy `node_modules/` or use `dist/` as the source of truth. Reinstall dependencies and regenerate outputs. Generated review screenshots and browser profiles are not application source. Preserve useful local artifacts separately only if needed.

## Engine architecture and integration points

Pipeline:

```text
Brand tokens + theme + component/recipe/composition data
  -> Nunjucks composition and validation
  -> MJML source
  -> strict MJML compilation
  -> HTML output checks
  -> preview/export artifacts
```

Important modules:

- `scripts/lib/paths.js`: computes the engine root relative to itself and defines discovery directories. Moving this file without its expected directory structure will break discovery.
- `registry.js`: discovers component templates and metadata automatically.
- `schema.js`: validates fields without a schema-library dependency.
- `components.js`: implements component and node rendering.
- `style.js`, `themes.js`, `typography.js`: resolve settings, references, theme overrides, and typography.
- `recipes.js`, `remix.js`: compose sections/recipes and change variants/settings without changing content.
- `tokens.js`, `variables.js`, `checks.js`: brand validation, Klaviyo tags, and generated-output checks.
- `render.js`: public rendering functions described below.
- `brand-collection.js`: separate draft collection loading, validation, composition, and rendering.

Existing renderer entry points:

```js
renderEmail(templatePath, tokens, opts)
renderComponent(id, tokens, opts)
renderRecipe(name, data, tokens, opts)
createEnv(tokens, opts)

loadCollection(brand)
composeItem(collection, kind, id)
renderCollectionItem(collection, kind, id, theme)
```

Read the functions before adding a wrapper. The generic render functions return HTML, MJML, and MJML errors; they do not all run the complete export checks themselves. A Laravel integration must explicitly preserve `runChecks` and production token validation. The collection renderer runs output checks and throws on errors, while retaining draft token issues separately.

Components are addressed as `category/name`. Each metadata file defines fields, settings, variants, responsive options, preview data, compatibility notes, and optionally custom validation. Nodes describe composition as data:

```json
{
  "component": "content/button",
  "variant": "outline",
  "data": { "label": "Read more", "href": "https://example.com" },
  "settings": {}
}
```

Nodes can nest through slot fields. Components are content-level or section-level; the registry enforces valid nesting. Sections and recipes return nodes, not markup. This is the foundation for a future editor, but no visual editor currently exists.

## Rendering rules that must survive

1. **Keep template languages separate.** Nunjucks uses `[[ ]]`, `[% %]`, and `[# #]`. Klaviyo owns `{{ }}` and `{% %}`. Do not run compiled email content through Blade or change those delimiters.
2. **Preserve Klaviyo tags verbatim.** Tags between MJML elements need `<mj-raw>` wrappers. The engine checks tags before and after compilation to catch silent MJML removal.
3. **No silent brand inheritance.** Every brand must define every required token. Unknown values remain listed in `_placeholders`. Do not invent brand values or remove flags to pass validation.
4. **Themes are style-only.** Brand colors, fonts, logos, and content remain brand-owned. Themes alter scales, treatments, and color-role choices; they do not bring their own palette.
5. **Keep settings precedence.** Component defaults -> theme component defaults -> variant -> call-site settings.
6. **Preserve validation.** Missing fields, invalid references, missing image alt text (unless explicitly decorative), and unsafe attribute values must remain detectable.
7. **Preserve email checks.** Subscription links, organization address tags, template syntax, Klaviyo tag preservation, and size reporting must survive the wrapper.
8. **Keep draft and production paths distinct.** Browsing draft previews is allowed; production brand validation must still reject unresolved placeholders.
9. **Keep brand content isolated.** SanEcoTec copy/assets stay in its collection, never in shared components or another brand's output.
10. **Do not weaken dark-mode logic.** Components use `dm()`/`tone()` so blocks with their own colors do not incorrectly flip.

Catalog and recipe `.js` files are trusted repository code. They are not a safe upload format for untrusted users. Nunjucks currently has `autoescape: false`; existing rich-text behavior must be considered when adding editable input. A future application should validate structured inputs and constrain renderer operations, IDs, and paths rather than execute submitted templates or JavaScript.

## Current browsing workflows

The live preview server is `scripts/preview.js`; default port is 3000, overridable through `PORT`. It uses filesystem watching and SSE at `/__reload` to refresh when email sources change.

| Route | Behavior |
| --- | --- |
| `/` | Overview linking emails, recipes, components, and discovered brand collections |
| `/emails` | Visual email library |
| `/recipes` | Searchable recipe library |
| `/components` | Searchable component library with category filters |
| `/recipes/<id>` | Recipe preview, style selection, desktop/phone sizes, HTML open/download |
| `/components/<category>/<name>` | Component variants, style selection, desktop/phone sizes, field/settings details |
| `/<flows|campaigns|examples>/<name>` | Email preview wrapper and HTML actions |
| `/frame/email/...`, `/frame/recipe/...`, `/frame/component/...` | Rendered content used in preview frames |
| `/brands/sanecotec/` | Generated SanEcoTec gallery, built separately |
| `/studio/...` | Allowlisted shared studio assets |

Libraries show nine entries initially, support Show more, retain search/category in URL parameters, and carry the selected theme through navigation. Generic previews are live compilations, whereas the brand collection gallery serves prebuilt HTML.

Current studio files reuse the SanEcoTec gallery's warm paper/navy/peach styling. They have keyboard focus styles, a skip link, labeled filters, status messages, and sandboxed email frames. Preserve the useful accessibility behavior during the UI port.

The current development frame endpoints can include warning banners/live-reload code. The Laravel app should use clean renderer output for exported email files and show diagnostics in the app separately.

## SanEcoTec: preserve the whole collection

Read `brands/sanecotec/README.md`, `RESEARCH.md`, and `docs/brand-collections.md` before modifying this brand.

- `catalog.js` assembles 48 block presets and 12 complete emails.
- Collection modules: `frame`, `heroes`, `platform`, `industries`, `resources`, `proof`, `actions`, `emails`, and shared helpers.
- Styles offered: `minimal`, `editorial`, `bold`; 180 generated previews in total. Styles are not additional unique designs.
- `tokens.draft.json` is structurally complete but retains unresolved semantic colors and an unused hero image. It is intentionally outside `tokens/` production discovery.
- Original includes remain in `blocks/header.mjml`, `footer.mjml`, `introduction.mjml`, and `consultation.mjml`, assembled by `preview.mjml` and its original `preview.js` command.
- Brand research records public sources, observed colors/fonts, asset URLs, and newly written draft copy. Preserve provenance and source links.
- Some imagery is website WebP and remote assets may change. Preserve format warnings; do not claim delivery-ready hosting or approved content.

The collection gallery supports email/block switching, category/search/style filters, a preview dialog, desktop/phone sizing, HTML downloads, source links, and copying composition JSON. A standalone block is shown with a header/footer for context; its copied composition contains only the block's nodes. Complete email compositions contain ordered block IDs. Preserve that distinction.

## Laravel direction

The agreed reason for Laravel is a better application foundation, not an automatic speed improvement. No destination, Laravel version, frontend stack, database, authentication design, or hosting choice has been selected in this conversation.

Recommended starting architecture, to adapt to the destination project:

- Laravel owns pages, navigation, application state, and eventually saved drafts, assets, and brand management.
- Keep the existing Node/MJML engine as a contained directory/package within the same application repo initially. A separate deployed rendering service is not required to start.
- Add a narrow structured interface between Laravel and the engine. A proposed bridge would accept operation, brand, theme, ID, and validated composition data; return HTML/artifact references and structured diagnostics. This bridge does not exist yet.
- Use structured process input and bounded execution. Keep JSON output separate from logs; preserve meaningful failures and exit statuses.
- Cache generated previews and rebuild when relevant source, token, theme, composition, or engine inputs change. Do not key only on a design ID and accidentally reuse another brand/theme's output.
- Background rendering and thumbnail images are potential performance improvements. Queue infrastructure and thumbnails are not currently implemented, and speed has not been benchmarked.

Database editing, accounts, drag-and-drop, automatic Klaviyo delivery, and multi-user permissions are potential later features, not requirements already approved for the first migration. First preserve current functionality in the new foundation with the practical UI Evan requested.

## Suggested migration sequence

1. Inspect the supplied destination and its project instructions. Re-read source Git status so uncommitted studio work is included.
2. Establish an inventory and test baseline. Preserve source files and dependency lockfiles; do not move generated output as authoritative content.
3. Bring the engine into the destination with its relative paths intact. Prove existing CLI rendering and tests work before replacing the browsing layer.
4. Add the Laravel-to-Node boundary, structured diagnostics, clean exports, and separate draft/production behavior.
5. Port navigation, libraries, filters, styles, previews, variants, and collection access. Use compact workbench labels and layouts rather than the current promotional intros.
6. Introduce preview caching with correct invalidation. If queued, expose pending/failed/ready states and prevent older renders from replacing newer edits.
7. Verify generic and SanEcoTec parity, document startup/build commands, and report what was tested and what remains unverified.

Do not begin by converting all components into Blade or database records. Preserve the proven renderer and establish parity before expanding scope.

## Commands and verification

Run from the engine root in the source repo; adapt the working directory in the new application:

```sh
npm ci
npm test
npm run docs:check
npm run build
npm run build:themes
npm run preview
npm run gallery:brand -- sanecotec
node brands/sanecotec/preview.js
npm run remix -- list
```

For a quicker collection build: `npm run gallery:brand -- sanecotec --theme minimal`.
Run `npm run docs` after modifying component metadata, themes, recipes, or variable definitions; documentation freshness is tested.

Environment notes: development uses Windows, PowerShell, and Laravel Herd. Prefer Node scripts for portable engine tasks. During this session `node`/`npm` were missing from the agent's PATH; the installed Node executable was `C:/Users/evano/.config/herd/bin/nvm/v23.11.0/node.exe`, accessed with sandbox approval. This is a machine-specific fallback, not a path to hardcode. `rg` was unavailable in the session.

Latest verification on 2026-09-25:

- All 285 existing Node tests passed, covering components/variants, all themes, recipes, schema, tokens, registry, layout, Klaviyo syntax, docs, and brand collections.
- An ad hoc Chromium/Playwright check exercised studio navigation, search/no-results/reset, category filtering, style persistence, email previews, phone-width controls, and mobile page overflow. No JavaScript page errors were observed in those checks.
- Home and mobile library screenshots were visually reviewed. A mobile filter layout adjustment was made and browser checks rerun successfully.
- The browser check used an existing Playwright installation from a different local project. Playwright was not added as a dependency. Temporary scripts/screenshots are not committed tests or migration dependencies.
- A preview server was started on port 3017 for review. Do not assume it is still running or treat that port as a project requirement.

Migration acceptance should additionally confirm: every catalog item remains discoverable; variant/theme rendering and brand isolation still work; exports contain no studio controls; Klaviyo syntax survives unchanged; draft collections remain excluded from production builds; copied compositions retain their meaning; missing/invalid input produces actionable failures; cache invalidation cannot return stale or cross-brand output.

## Real-world limits and source priorities

Browser previews are not inbox certification. `docs/limitations.md` records one Klaviyo preview send viewed in desktop Gmail light mode on 2026-09-21. Outlook, Apple Mail, phone email clients, dark mode, and production audience sends remain unverified. SanEcoTec has browser/compilation checks but no recorded real inbox send.

Delivery currently means exporting a complete email and manually pasting it into a Klaviyo custom HTML template. There is no API delivery integration, visual editor, drag-and-drop builder, or hybrid-editor snippet support.

Some older README wording is stale: the root compatibility introduction says nothing was tested in clients, while `docs/limitations.md` records the limited Gmail test; older brand text describes earlier discovery behavior. Use the actual source, the latest detailed validation records, and the explicit user direction in this handoff rather than treating every old sentence as current.

Further reading: `CLAUDE.md`, `docs/architecture.md`, `docs/rendering.md`, `docs/component-metadata.md`, `docs/tokens.md`, `docs/themes-guide.md`, `docs/recipes-guide.md`, `docs/variants-and-remix.md`, `docs/responsive.md`, `docs/testing.md`, `docs/limitations.md`, and the SanEcoTec documents named above.
