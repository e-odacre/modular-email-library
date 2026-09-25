# Adding a component, a variant or a theme

## A component

```bash
npm run new:component -- commerce gift-card
npm run new:component -- loyalty points-balance --level section
```

This creates `components/<category>/<name>.njk` and `<name>.meta.js` with a working minimal component. It renders and passes the tests as it is. Then:

1. **Template.** Edit `<name>.njk`. It emits MJML. Read colors, fonts and sizes from tokens and settings (`s.background`, `typo('h2')`), never hard-code brand values. Render other components with `c()` or `cn()` instead of writing raw `mj-section` and `mj-text`. Keep the header comment on Outlook, Gmail and dark-mode limits accurate.
2. **Metadata.** In `<name>.meta.js` define what the component takes (`fields`), how it can look (`settings`, each with a default), its `variants`, and which `responsive` options make sense. See [Component metadata](component-metadata.md).
3. **Validation.** Mark required fields, use the named types (`products`, `image`, `cta`) so validation is shared, and add `validate()` for rules that span fields. Do not let it generate a broken email silently.
4. **Preview data.** Replace the sample with realistic content. The gallery and the tests render it.
5. **Try it.** `npm run preview`, open `/components/<category>/<name>`, look at every variant, and switch themes with the bar.
6. **Docs.** `npm run docs` writes its page and its row in the README compatibility table.
7. **Tests.** `npm test`. Every component is rendered for every variant and in every theme, its MJML is compiled, and its output is checked for leftover template syntax, dropped Klaviyo tags, images without alt text and empty class attributes. You do not write a test unless the component has behavior worth pinning (see `tests/layout.test.js`).

Nothing else needs editing. The registry finds the files, the gallery lists it, the docs and tests cover it. A new category is just a new folder.

Rules that are easy to get wrong:

- Content-level components go inside columns, section-level ones are top level. Do not mix.
- Klaviyo tags between `mj-*` elements need `<mj-raw>`. Tags inside `mj-text`, `mj-button` and attributes are fine.
- Values that go into attributes cannot contain double quotes. Use `attr: true` on such text fields.
- Add dark-mode classes only through `dm()` or `tone(s)`, so a block with its own colors never flips.
- Do not add a dependency.

## A variant

Add it to `variants` in the metadata, listing only the settings it changes. See [Variants and remix](variants-and-remix.md#adding-a-variant).

## A theme

```bash
npm run new:theme -- autumn
```

Edit `themes/autumn.json`. Themes are style-only and complete, see [Themes](themes-guide.md#adding-a-theme).

## A section or a recipe

Add a file to `sections/` or `recipes/` that exports `name`, `description`, `fields`, `previewData` and `build`. See [Recipes and sections](recipes-guide.md).

## A brand token

Add it to `tokens/placeholder.json` and to every brand file (there is no inheritance), and use it from a template through `t`. See [Design tokens](tokens.md).
