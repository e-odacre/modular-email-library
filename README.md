# Modular email library

Laravel workspace for the existing modular email engine. The original project was copied into `email-engine/`, including the uncommitted studio files, brand research, dependency lockfile, templates, and all 285 original tests. The original `modular-email-blocks` folder remains intact.

## Run locally

Herd serves this project at `http://modular-email-library.test`. The daisyUI workspace includes searchable Emails, Components, Recipes, Brands, and Builds. SanEcoTec has native library and review pages with compositions, source links, and downloads; its original static gallery remains available.

For a fresh checkout:

```sh
composer install
# Copy .env.example to .env and configure APP_URL and EMAIL_NODE_BINARY.
php artisan key:generate
php artisan migrate
npm ci
npm ci --prefix email-engine
npm run build
```

Use `php artisan serve` if Herd is unavailable. Use `npm run dev` while editing the application interface, or rebuild its assets with `npm run build`. A separate Node preview server or queue worker is not required.

`EMAIL_NODE_BINARY` defaults to `node`. If PHP cannot find Node on its PATH, set an absolute executable path in your local `.env`. The current machine's Herd path is configured only in `.env`, not application code. Dependencies are installed from the preserved engine lockfile. The migration was verified with Herd PHP 8.4 and Node 23.11.0; npm reports engine-range warnings for locked `abbrev` and `nopt` on this Node version. The rendering tests and builds pass; dependency/runtime modernization is separate work.

## Brief to email workflow

1. Open **New email**, select a brand, recipe, and email style, and write the audience, objective, and approved content. The brief autosaves in this browser when local storage is available.
2. Generate and copy the build prompt into a local coding agent working in this repository. The app prepares instructions; it does not launch an agent or call an AI API.
3. The agent creates `email-engine/drafts/<build-id>.json` using either a recipe and its data or an ordered component-node composition. The prompt includes source references and validation commands. Existing builds cannot be overwritten through the brief form.
4. The file appears in **Builds** automatically. Open it to validate and review desktop/mobile output, warnings, and clean HTML export. Invalid builds remain visible for repair and cannot be exported.

Check an individual build with `npm run email:check -- <build-id>`. JSON build sources belong in version control; generated HTML remains an export. Compilation checks do not replace inbox testing, and draft brands still require completed brand information before delivery. App appearance and email styles are independent.

## Engine commands

From the application root:

```sh
npm run email:test
npm run email:build
npm run email:themes
npm run email:gallery
php artisan test --compact
```

Or run any original command inside `email-engine`, including `npm run preview`, `npm run remix -- list`, `npm run docs:check`, and `node brands/sanecotec/preview.js`. Generated emails remain in `email-engine/dist/` and are ignored by Git. Do not edit generated output as source.

## Integration boundary

- Laravel owns navigation, library pages, previews, downloads, and caching.
- `email-engine/scripts/bridge.js` accepts bounded JSON on stdin and returns JSON on stdout. Operations and discovered IDs are allowlisted. It does not accept arbitrary file paths, templates, JavaScript, or uploaded catalogs.
- `app/Services/EmailEngine.php` invokes Node with an argument array and bounded execution, preserving failures and diagnostics. No compiled email content passes through Blade.
- Preview cache keys include engine source content, dependency lockfile, runtime path, and every render input. Content changes, added or removed files, themes, variants, modes, and brands cannot reuse another request's output. The default file cache requires no queue or database cache table.
- Brand gallery builds are serialized per brand and refreshed after source changes. Only allowlisted generated gallery artifacts are served. The Node CLI gallery remains usable independently.
- Generic pages refresh after source edits. Email exports contain clean renderer output, without reload scripts, workspace controls, or diagnostic banners.
- Generic browsing uses the placeholder brand. SanEcoTec remains a separate draft collection, outside production token discovery. Production-mode exports reject unresolved brand tokens; draft HTML downloads preserve the original review workflow.

The migration includes 116 components, 11 sections, 12 recipes, 13 themes, 3 generic emails, and the SanEcoTec collection of 48 block presets and 12 emails in 3 styles. The 475 copied source files were verified byte for byte against the source working tree before adding the bridge and migration tests.

## Continue working

Read the [session progress index](docs/progress.md) for dated work records and the
next starting point. Add a dated record there at the end of each working session.

Edit shared email templates, themes, recipes, and brand content under `email-engine/`. Follow its [implementation rules](email-engine/CLAUDE.md), [architecture guide](email-engine/docs/architecture.md), and [brand collection guide](email-engine/docs/brand-collections.md). The original [migration handoff](email-engine/MIGRATION.md) is preserved as historical context; this README describes the completed integration.

Application interface work belongs in `resources/views/studio`, `resources/css/workspace.css`, and `resources/js/workspace.js`. Vite bundles the daisyUI interface. Email rendering remains isolated from the application's CSS and JavaScript.

Accounts, database-backed briefs, drag-and-drop editing, and Klaviyo API delivery are not included. Delivery remains manual HTML export. Existing [inbox testing limitations](email-engine/docs/limitations.md) and unresolved SanEcoTec draft values still apply.
