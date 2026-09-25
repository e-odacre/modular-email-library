# Variants and remix

The goal: **same content, different design.** Change the look without touching a headline, a price or a link.

## Variants

A variant is a set of setting overrides. Every component has at least `default`. Product cards have five, so the same product data can be shown five ways:

```
[[ c('commerce/product-card', { product: {...} }, { variant: 'luxury' }) ]]
```

| Variant | What it does |
| --- | --- |
| `default` | Left-aligned, everything shown |
| `minimal` | Image, name and price only |
| `luxury` | Centered, uppercase spaced name, outlined button |
| `editorial` | Large name and description, no button |
| `playful` | Centered, rounded image, pill badge and button |

A variant never adds or removes fields, it only changes settings, so switching variants never breaks the data. See each component's page in [components](components/README.md) for its variants.

## Two more levers

- **Settings** at the call site: `{ settings: { columns: 3, align: 'center' } }`.
- **Themes**: restyle everything at once, see [Themes](themes-guide.md).

The order is: component defaults, theme defaults, variant, call site. Later wins.

## Remix

Remix applies those levers to a whole recipe (or any list of nodes) without changing its data.

### CLI

```bash
npm run remix -- list
npm run remix -- recipe sale --theme luxury
npm run remix -- recipe sale --theme black-friday \
  --variant commerce/product-card=luxury \
  --setting commerce/product-grid.columns=3
npm run remix -- recipe sale --all-themes                 # every theme, side by side in dist/
npm run remix -- recipe welcome --data my-welcome.json --brand acme --out welcome.html
npm run remix -- component commerce/product-card --variant playful --theme summer
```

Output goes to `dist/<brand>/remix/`. A typo in a component id, a variant or a setting fails with a list of the valid choices.

### API

```js
const { renderRecipe } = require('./scripts/lib/render');
const { remixNodes } = require('./scripts/lib/remix');

// render a recipe with another theme and variants
await renderRecipe('sale', data, tokens, {
  theme: 'luxury',
  remix: {
    variants: { 'commerce/product-card': 'luxury' },
    settings: { 'commerce/product-grid': { columns: 3 } },
  },
});

// or remix nodes yourself
const remixed = remixNodes(nodes, { variants: { 'content/button': 'outline' } }, registry);
```

`remixNodes` returns a copy, reaches nodes nested inside slots, and validates its targets first. The theme is applied by the renderer.

## Adding a variant

Add an entry to `variants` in the component's `.meta.js`:

```js
variants: {
  default: { description: 'Two columns.' },
  'six-up': { description: 'Six compact items in three columns.', settings: { columns: 3, cardVariant: 'minimal' } },
}
```

Every key under `settings` must be a declared setting. Give the variant a description (it is shown in the gallery and the docs), and if it needs other sample data add `previewData.byVariant['six-up']`. `npm test` renders it, `npm run docs` documents it. If the look needs a setting that does not exist yet, add the setting (with a default) first, and use it in the template.
