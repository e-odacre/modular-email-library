# CLAUDE.md

A modular email design system (MJML components, variants, themes, campaign recipes) for Klaviyo. See `README.md` for usage, `docs/` for the guides.

## Commands

- `npm run build` / `npm run build:brand -- <brand> [--theme <name|all>]` / `npm run preview -- <brand> <email>` / `npm test`
- `npm run remix -- recipe <name> --theme <t>` / `npm run new:component -- <category> <name>` / `npm run new:theme -- <name>`
- `npm run docs` regenerates `docs/components/`, `docs/themes.md`, `docs/recipes.md`, `docs/variables.md` and the README compatibility table. `npm run docs:check` fails when they are stale, and a test runs it, so run `npm run docs` after changing any component metadata, theme, recipe or variable.
- Node scripts, not shell, because development is on Windows.

## Shape of the code

- A component is `components/<category>/<name>.njk` (template) plus `<name>.meta.js` (fields, settings, variants, responsive, previewData, compat). The registry finds them, nothing else needs editing. Render with `c('category/name', data, { variant, settings })`.
- Sections (`sections/`) and recipes (`recipes/`) only produce nodes (`{ component, variant, data, settings }`), never markup, so remix can change the theme or a variant without touching content.
- Settings resolve as: component defaults, theme defaults, variant, call site. Values may be token references such as `@colors.accent`, `@theme.card.radius`.

## Rules that are easy to get wrong

- **Two delimiter sets.** Nunjucks is `[[ ]]` / `[% %]` / `[# #]`. Klaviyo's `{{ }}` and `{% %}` are output, never build-time. Do not change the Nunjucks delimiters.
- **MJML silently drops Klaviyo tags between `mj-*` elements.** Wrap those in `<mj-raw>`. The build fails if a tag goes missing.
- **No token inheritance.** Every brand defines every key, validated against `tokens/placeholder.json`. Adding a token means adding it to `placeholder.json` and to every brand file. Themes are the same: every theme spells out every style key, validated against `themes/minimal.json`.
- **Themes are style-only.** They may override the type, spacing, radius and shadow scales and choose which brand color roles to use. Never colors, fonts, logos or brand values, and no hex colors in a theme file.
- **Never invent brand values.** Unknown brand values stay marked in `_placeholders`. Building a non-placeholder brand fails until the list is empty.
- **Components read from `t`, settings and `typo()`, never hard-code brand values.** Token values go into MJML attributes, so no double quotes in them. Text fields that land in an attribute need `attr: true`.
- **Klaviyo tags must be checked against Klaviyo's docs**, not memory. Put them in `variables/klaviyo.json` with a source and `verified`, and ask for them with `v('name')`. `{% unsubscribe_link %}` goes in `href`, the bare `{% unsubscribe %}` does not.
- **Every component gets a header comment** on Outlook, Gmail and dark-mode limits, a `compat` entry in its metadata (which generates its README row), realistic preview data (no lorem ipsum), and validation that fails loudly instead of producing a broken email. Images require alt text or `decorative: true`.
- **Dark-mode classes come from `dm()` or `tone(s)`**, so a block with its own colors never flips.
- **Do not claim more than was tested.** Only Gmail on the web (desktop, light mode) and one Klaviyo preview send have been checked, keep `docs/limitations.md` honest.
- `dist/` is gitignored. `mjml` and `nunjucks` are the only dependencies, keep it that way unless there is a strong reason. Schema validation is hand-rolled for that reason.
