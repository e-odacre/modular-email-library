# Design tokens

A brand is a token file, `tokens/<brand>.json`. `tokens/placeholder.json` is the reference: it is the only brand today, and every value in it is neutral on purpose.

## The rules

- **Every brand defines every key.** There is no inheritance, so a missing value can never be filled in quietly. A missing key is an error, and so is an unknown key (it catches typos).
- **Never invent brand values.** Values you do not know stay listed in `"_placeholders"`. Building a non-reference brand fails until that list is empty, and while any value still points at `placehold.co` or `example.com`.
- **Values go into MJML attributes**, so they must not contain double quotes. Use single quotes in font stacks.
- Tokens are JSON, so no comments.

## What a token file holds

| Group | Keys |
| --- | --- |
| `brand` | `name` |
| `colors` | `primary`, `primaryText`, `secondary`, `accent`, `success`, `warning`, `error`, `white`, `black`, `background`, `surface`, `text`, `mutedText`, `border`, `link` |
| `fonts` | `heading`, `body` (font stacks) |
| `type` | The typography levels below |
| `spacing` | `xs`, `sm`, `md`, `lg`, `xl`, `2xl`, `3xl` |
| `radius` | `none`, `small`, `medium`, `large`, `pill` |
| `shadow` | `none`, `small`, `medium`, `large` |
| `layout` | `width` (`600px`, `640px` or any px width) |
| `logo` | `url`, `alt`, `href`, `width` |
| `images` | `hero` |
| `dark` | Optional, see below |

Custom colors: any value is allowed for any role, and any component color setting accepts a hex value, `rgb()`, `transparent` or a color name, so a one-off color never needs a new token.

### Typography

Thirteen levels: `display`, `h1`, `h2`, `h3`, `h4`, `body`, `bodyLarge`, `bodySmall`, `caption`, `eyebrow`, `price`, `salePrice`, `button`. Each has:

| Key | Meaning |
| --- | --- |
| `font` | A font role: a key of `fonts` (`heading` or `body`) |
| `size`, `weight`, `lineHeight`, `letterSpacing` | Plain CSS values |
| `transform` | `none`, `uppercase`, `capitalize` |
| `color` | A color role: a key of `colors` |

Components never hard-code type. They ask for a level with `typo('h2')`, so a theme can restyle every heading by overriding the level.

### Spacing, radius, shadow

Named scales, referenced as `@spacing.md`, `@radius.pill`, `@shadow.small` in component settings and themes. Shadows are `box-shadow`, which Outlook desktop and some other clients ignore, so a shadow is a nicety, never structure.

### Dark mode

`dark` is optional. Omit it and no dark-mode CSS is emitted. If present it must be complete: `dark.colors` with every color role, and `dark.logoUrl`. Dark mode is `prefers-color-scheme` CSS plus the `color-scheme` meta, applied through `dm-*` classes that components add only to blocks sitting on the brand surface or background. Blocks with their own colors (a red urgency banner) keep them.

## How a brand is validated

`scripts/lib/tokens.js` checks the file against `placeholder.json`: missing keys, unknown keys, non-string values, double quotes, `type` levels pointing at a real font and color role, `_placeholders` naming real tokens, and (for real brands) leftover placeholder values and URLs. The build treats all of it as errors, the preview treats placeholder problems as a warning banner so you can look at an unfinished brand.

## Adding a token

Adding a token means adding it to `tokens/placeholder.json` and to every other brand file, because there is no inheritance. Do it deliberately: a new token is a new requirement for every brand.
