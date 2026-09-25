# Testing

```bash
npm test         # node --test, no extra dependencies
```

## The strategy

The library's risk is not one function being wrong, it is one of 116 components, 369 variants, 13 themes and 12 recipes producing a broken email. So the tests render everything and check the result, and a few targeted tests pin behavior that is easy to get subtly wrong.

| Suite | What it guards |
| --- | --- |
| `components.test.js` | For **every component and every variant**: it renders with its preview data, MJML compiles in strict mode, no leftover `[[`/`[%`, no dropped Klaviyo tags, no `<img>` without alt, no empty `class=""`, no `undefined` leaking into the output. Also validation errors (missing required data, unknown fields, unknown variants and settings), token references in settings, and that a variant changes styling but not data |
| `all-themes.test.js` | Every component rendered under **every theme** in one compile per theme, the same structural checks, that a theme changes styling but never content, that themes carry no colors of their own |
| `themes.test.js` | Theme validation: complete, style-only, references resolve, component defaults are real. Style resolution and `typo()` |
| `registry.test.js` | Every component has a template and metadata, a header comment covering Outlook, Gmail and dark mode, and realistic preview data (no lorem ipsum) |
| `schema.test.js` | The field validator: required and optional, urls, images and alt text, lists, named types, slots, error messages with paths |
| `layout.test.js` | Behavior worth pinning: reversed columns, media-text mobile order, grid rows, slot level checks, container maths, UTM building, VML button, footer compliance tags |
| `recipes.test.js` | Every recipe and section builds from its preview data into nodes that name real components, every recipe renders under every theme and passes the full build checks, optional sections, remix, the variable registry |
| `tokens.test.js` | Brand token validation and the placeholder rules |
| `klaviyo-syntax.test.js` | Klaviyo tags survive the pipeline, the MJML-drops-bare-tags gotcha, output checks |
| `docs.test.js` | Generated docs and the README table are up to date, every component has a page and a README row, the scaffold produces a component that passes everything |

## What the structural checks mean

The list in `components.test.js` is the definition of "not broken": MJML strict validation, no leftover template syntax, Klaviyo tags intact, alt text on every image, no empty attributes. A component that fails any of them cannot merge, whether it is the first or the hundredth.

## Snapshots and fixtures

`tests/fixtures/klaviyo-syntax.mjml` is a fixture with Klaviyo syntax in every position the library uses it (conditionals, loops, attributes, links). The recipes are the snapshot-style coverage: each is rendered in full for every theme and passed through the same checks the build applies, which catches structure regressions without brittle whole-file comparisons.

## What the tests do not cover

They compile and inspect HTML, they do not open it in an email client. Nothing in this repository has been rendered in Outlook, Gmail or Apple Mail, and the dark-mode selectors are checked by reading the output only. That is the first thing to do before a brand goes live, see [Limitations](limitations.md).

## Testing an email in real clients

1. `npm run build`, paste `dist/<brand>/.../<email>.html` into a Klaviyo custom HTML template.
2. Send tests to Gmail (web and app), Outlook desktop, Apple Mail and iOS Mail, light and dark.
3. Check the things this library states as limits: rounded corners in Outlook, background images, `mobileColumns`, `hideOnMobile`, dark-mode swaps, the countdown image.
4. If a `dm-*` selector or a compat note is wrong, fix the component and its `compat` entry.
