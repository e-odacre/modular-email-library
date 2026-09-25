# Architecture

## The layers

```
Design tokens          tokens/<brand>.json              what the brand is
   |
Base components        components/content, decorative   text, heading, image, button, ...
   |
Component variants     variants in each .meta.js        the same component, styled differently
   |
Layout components      components/layout                sections, columns, grids, media-text
   |
Content blocks         hero, commerce, promotional, ... composed from the layers above
   |
Sections               sections/*.js                    reusable groups ("best sellers", "social proof")
   |
Campaign recipes       recipes/*.js                     whole emails ("welcome", "abandoned cart")
   |
Complete emails        flows/, campaigns/, examples/    .mjml files, rendered to dist/
```

Themes cut across the layers: a theme restyles tokens and component defaults without touching content.

Lower layers know nothing about higher ones. A `content/button` does not know it is in a hero, a hero does not know it is in a welcome email.

## How a component is built

A component is two files in `components/<category>/`:

- `<name>.njk`: the template. It emits MJML, and it may render other components.
- `<name>.meta.js`: the metadata: name, description, `fields` (the data it takes), `settings` (how it can look), `variants`, `responsive` options, realistic `previewData`, `compat` notes, and an optional `validate` function. See [Component metadata](component-metadata.md).

The registry (`scripts/lib/registry.js`) finds every `*.meta.js`, so adding a component means adding two files and nothing else. Its id is `category/name`.

## How a component is rendered

`c('hero/standard', data, { variant, settings })` does this, in `scripts/lib/components.js`:

1. **Resolve style.** Settings are decided in this order, later steps win: the component's defaults, the theme's defaults for that component, the variant, then the settings passed at the call site (`scripts/lib/style.js`). Values may reference tokens: `@colors.accent`, `@theme.card.radius`, `1px solid @colors.border`.
2. **Validate the data** against `fields` (`scripts/lib/schema.js`). Every problem is reported at once, with the component and the field name. Then the component's own `validate(data, settings)` runs for rules that span fields.
3. **Render the template** with `data`, `s` (the resolved settings), `variant`, `cls` (responsive classes), and the globals below.

Templates can use these Nunjucks globals:

| Global | What it does |
| --- | --- |
| `t` | The brand tokens (with the theme's scale overrides applied) |
| `theme` | The active theme |
| `c(id, data, opts)` | Render a component |
| `cn(nodes)` | Render a list of nodes (see below) |
| `typo('h2', overrides)` / `typoCss(...)` | The MJML attributes / the inline CSS for a typography level |
| `cc('dm-surface', cls)` | A `css-class` attribute, or nothing when there are no classes |
| `dm(background, kind)` | The dark-mode class for a block, only when it sits on the brand surface or background |
| `tone(s)` | How children should be colored inside a block with a background |
| `v(name, args)` | A Klaviyo tag by semantic name |
| `recipe(name, data)`, `recipeSection(name, data)` | A recipe or section, in an email file |

## Levels, nodes and slots

Every component is `content`-level (it goes inside a column: text, button, image) or `section`-level (it is a top-level block: hero, columns). The registry enforces it, so you cannot put a section inside a column.

A **node** is a component described as data: `{ component: 'content/button', variant: 'outline', data: { ... }, settings: { ... } }`. A **slot** is a field of type `slot`, and it accepts nodes. That is how layouts hold other components without any template glue:

```
[[ c('layout/section', { content: [
  { component: 'content/heading', data: { text: 'Free returns' } },
  { component: 'content/button', data: { label: 'Read more', href: '...' } }
] }) ]]
```

Sections and recipes only ever produce nodes, never markup. That is what makes remixing possible: change a variant or a theme and re-render, the data is untouched.

## Rendering an email

```
your .mjml  (Nunjucks with [[ ]] delimiters)
    |  c() renders components, validates data, resolves themes and tokens
    v
MJML source
    |  mjml (strict validation)
    v
HTML  ->  output checks  ->  dist/<brand>/...
```

`layouts/base.mjml` provides the head, the dark-mode CSS, the responsive CSS (hide classes, mobile columns, mobile alignment, shadows) and the body wrapper. See [Rendering emails](rendering.md).

## Two template languages

Klaviyo owns `{{ }}` and `{% %}`. The build-time templating is Nunjucks with `[[ ]]`, `[% %]` and `[# #]` instead, so the two never collide. MJML silently drops Klaviyo tags placed between `mj-*` elements, so those are wrapped in `<mj-raw>`, and the build fails if any tag goes missing.

## What lives where

| Path | Role |
| --- | --- |
| `scripts/lib/registry.js` | Finds and validates components |
| `scripts/lib/schema.js` | Field validation (no dependencies) |
| `scripts/lib/style.js` | Style resolution and token references |
| `scripts/lib/components.js` | The renderer behind `c()` and `cn()` |
| `scripts/lib/themes.js` | Loads and validates themes, applies scale overrides |
| `scripts/lib/typography.js` | `typo()` and `typoCss()` |
| `scripts/lib/variables.js` | The variable registry |
| `scripts/lib/recipes.js`, `remix.js` | Sections, recipes and remixing |
| `scripts/lib/render.js` | Builds the Nunjucks environment, renders emails, components and recipes |
| `scripts/lib/checks.js` | Output checks (Klaviyo tags, compliance, alt text, size) |
| `components/_partials.njk`, `_shared.js` | Shared macros and metadata helpers, not components |
