# Component metadata

Every component has a `<name>.meta.js` next to its `<name>.njk`. The registry validates it when it loads, so a mistake fails immediately with the component's id.

```js
module.exports = {
  name: 'Product Grid',                 // display name
  description: 'Products in a responsive grid ...',
  level: 'section',                     // 'content' (inside a column) or 'section' (top level)

  fields: {                             // the data a caller passes
    heading: 'text',
    products: { type: 'products', min: 1, max: 12, required: true },
    cta: 'cta',
  },

  settings: {                           // how it can look, every one needs a default
    columns: { type: 'enum', values: [2, 1, 3, 4], default: 2 },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: { mobileColumns: [1, 2], hideOnMobile: true },

  variants: {                           // 'default' is required
    default: { description: 'Two columns.' },
    'three-column': { description: 'Three columns.', settings: { columns: 3 } },
  },

  previewData: {                        // realistic content, not lorem ipsum
    data: { heading: 'Our best sellers', products: [ ... ] },
    byVariant: { 'three-column': { data: { ... } } },   // optional, when a variant needs other data
  },

  validate(data, settings) { return []; },              // optional, rules that span fields

  compat: { outlook: '...', gmail: '...', darkMode: '...' },
  notes: ['optional extra lines for the docs'],
};
```

## Fields

The data a caller passes. Fields are optional unless `required: true`. Unknown keys are errors, so a typo fails loudly. A field is a type name (`'text'`) or an object (`{ type: 'text', required: true, default: 'x' }`).

| Type | Notes |
| --- | --- |
| `text` | A string, may contain Klaviyo tags. `attr: true` if it lands in an HTML attribute (no double quotes allowed). `allowEmpty: true` permits `''` |
| `richtext` | A string of inline HTML |
| `url` | `https://`, `http://`, `mailto:`, `tel:`, `#anchor`, `/path` or a Klaviyo tag. No double quotes, no `javascript:` |
| `image` | `{ src, alt, decorative?, href?, width? }`. **`alt` is required** unless `decorative: true`, which sets an empty alt on purpose |
| `cta` | `{ label, href }`. Vague labels ("click here", "here", "link") are rejected |
| `number`, `boolean` | `number` takes `min` and `max` |
| `enum` | `{ type: 'enum', values: [...] }` |
| `list` | `{ type: 'list', of: spec, min, max }` |
| `object` | `{ type: 'object', fields: { ... } }` |
| `slot` | MJML text, a node, or a list of those. `accepts: 'content' \| 'section'` restricts what may go inside |
| `color`, `length`, `spacing`, `alignment` | Value types, mostly for settings |

**Named types** are shared shapes, so the same data validates the same way everywhere: `product`/`products`, `link`/`links`, `logo`/`logos`, `stat`/`stats`, `feature`/`features`, `article`/`articles`, `faqItem`/`faqItems`, `listItems`, `button`/`buttons`, `socialLink`/`socialLinks`. Their shapes are in `scripts/lib/schema.js`.

Errors name the component and the path: `component "commerce/product-grid": products[1].image is required`.

## Settings

How a component can look. Every setting needs a `default`, which may be a token reference: `'@colors.accent'`, `'@theme.card.radius'`, `'1px solid @colors.border'`, `'@spacing.md @theme.section.paddingX'`. References resolve before validation, so `type: 'color'` sees a real color. A theme, a variant or the call site can override any setting.

Keep settings meaningful. Expose `columns`, `align`, `background`, `showPrice`; do not expose hundreds of knobs. Sensible defaults are the point.

## Variants

A variant is a set of setting overrides with a description. `default` is required. Because a variant only changes settings, the data and the structure stay the same: that is what makes remixing safe. Structural changes (column counts, image position) are settings too.

## Responsive

`responsive` opts a component into the standard responsive settings, which the registry adds to `settings`:

```js
responsive: {
  mobileLayout: ['stack', 'reverse', 'preserve'],          // first value is the default
  mobileAlignment: ['inherit', 'left', 'center', 'right'],
  mobileColumns: [1, 2],
  hideOnMobile: true,
  hideOnDesktop: true,
}
```

See [Responsive behavior](responsive.md). Only expose what makes sense: a spacer has `hideOnMobile`, a grid has `mobileColumns`.

## previewData

Required, and it must look real ("Summer Collection", "Made for slower mornings and warmer days"), because the gallery and the tests render it and people judge designs by it. `byVariant` supplies different data for one variant. Preview images come from `placehold.co`, which only ever appears in previews.

## validate

`validate(data, settings)` returns a list of messages, and runs after the fields validate. Use it for rules that span fields or settings: `layout/columns` checks the split matches the number of columns, `commerce/price` refuses a discount with no sale price.

## compat

Required: what Outlook desktop, Gmail apps and dark mode do with this component. It feeds the generated compatibility table in the README. Write what is known, and say "not checked" when it is not. Every template also starts with a `[# ... #]` header comment covering the same three, and a test enforces it.
