# Themes

A theme changes how components look, never what the brand is. The same email in `luxury` and in `playful` has the same words, products, prices and links, and the same colors and fonts (they come from the brand file). What changes is type treatment, spacing, corner radius, shadows, buttons, cards and which brand color roles are emphasized.

The available themes, with their default variants, are in the generated [theme reference](themes.md): `minimal` (the default), `luxury`, `editorial`, `bold`, `playful`, `ecommerce`, `saas`, `wellness`, `fashion`, `christmas`, `black-friday`, `valentines`, `summer`.

## What a theme file contains

```json
{
  "name": "Luxury",
  "description": "Quiet and expensive: ...",
  "overrides": {
    "type":    { "h1": { "weight": "300", "letterSpacing": "3px", "transform": "uppercase" } },
    "spacing": { "xl": "48px" },
    "radius":  { "medium": "0" }
  },
  "button":  { "radius": "@radius.none", "innerPadding": "16px 40px", "borderWidth": "0" },
  "card":    { "background": "@colors.surface", "border": "@colors.border", "borderWidth": "1px", "radius": "@radius.none", "padding": "@spacing.xl", "shadow": "none" },
  "section": { "paddingY": "@spacing.2xl", "paddingX": "@spacing.xl", "paddingTight": "@spacing.md" },
  "badge":   { "background": "@colors.black", "color": "@colors.white", "radius": "@radius.none" },
  "divider": { "width": "1px", "color": "@colors.border", "style": "solid" },
  "image":   { "radius": "@radius.none" },
  "accent":  { "color": "@colors.secondary", "lineWidth": "1px", "lineLength": "64px" },
  "components": {
    "commerce/product-card": { "variant": "luxury" },
    "commerce/product-grid": { "variant": "luxury" }
  }
}
```

| Part | Meaning |
| --- | --- |
| `overrides` | Sparse changes to the brand's `type`, `spacing`, `radius` and `shadow` scales, merged over the brand tokens |
| `button`, `card`, `section`, `badge`, `divider`, `image`, `accent` | Complete style groups. Components read them with `@theme.button.radius` and so on |
| `components` | Per-component defaults: a `variant` and/or `settings` |

## The rules

- **Themes are style-only.** `overrides` may touch `type`, `spacing`, `radius` and `shadow`. Overriding `colors`, `fonts`, `logo`, `brand`, `images` or `dark` is an error, and so is a hex color anywhere in a theme. Seasonal themes (Christmas, Valentine's) differ by radius, decoration, weight and which color role they emphasize (`@colors.error`, `@colors.warning`), never by inventing a palette.
- **No inheritance.** Every theme spells out every key of the style groups, validated against `themes/minimal.json`. A missing or unknown key is an error.
- **References must resolve.** `@colors.accent`, `@radius.pill`, `1px solid @colors.border` are checked against the brand tokens, so a typo fails the test suite, not a send.
- `components` entries must name a real component, a real variant and real settings.

## How a theme is applied

1. The brand tokens get the theme's `overrides` merged in, and that becomes `t` in every template.
2. Component settings are resolved with the theme's `components` defaults between the component's own defaults and the variant, so the call site still wins.
3. Components that read `@theme.*` values get the theme's groups.

## Using a theme

```bash
npm run build:brand -- acme --theme luxury      # or --theme all
npm run remix -- recipe sale --theme black-friday
npm run preview                                  # then add ?theme=luxury
```

```js
renderEmail('flows/welcome.mjml', tokens, { theme: 'luxury' })
```

Recipes suggest a theme (`suggestedTheme`), the remix CLI uses it when you do not pass one.

## Adding a theme

```bash
npm run new:theme -- autumn
```

That copies `minimal.json` to `themes/autumn.json` as a complete file. Edit the description and whatever makes it different, then `npm test`: every theme is validated and every component is rendered in it. `npm run docs` adds it to the [theme reference](themes.md).
