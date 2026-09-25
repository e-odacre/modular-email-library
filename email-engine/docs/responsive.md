# Responsive behavior

Email responsiveness is narrower than the web. Layouts are tables, and most of what is "responsive" is one media query at 480px, which some clients ignore. So each component exposes only the settings that make sense for it, and this page says exactly what each one does and where it stops working.

The breakpoint is MJML's default, 480px. Columns stack on their own below it.

## The settings

| Setting | Values | What it does |
| --- | --- | --- |
| `mobileLayout` | `stack`, `reverse`, `preserve` | `stack` (default) stacks columns in source order. `reverse` puts the last column first on phones, using MJML's `direction="rtl"` with the columns in reverse order, so the desktop order does not change. `preserve` keeps columns side by side on phones (`mj-group`). Components: `layout/columns`, `layout/media-text`, `hero/split` |
| `mobileAlignment` | `inherit`, `left`, `center`, `right` | Overrides text alignment below 480px. `inherit` keeps the desktop alignment. Text follows reliably, images and tables are best effort |
| `mobileColumns` | `1`, `2` | With `2`, each column takes half the width on phones, so a grid of four shows two per row instead of stacking. Components: `layout/grid`, `layout/columns`, product, feature, article, stat and logo grids |
| `hideOnMobile` | `true` / `false` | Hides the block below 480px |
| `hideOnDesktop` | `true` / `false` | Shows the block only below 480px |

Example:

```
[[ c('layout/columns', { columns: [imageNodes, textNodes] }, { variant: 'split-60-40', settings: { mobileLayout: 'reverse' } }) ]]
```

Image and text on desktop, text first then image on phones.

## Layouts that adapt without a setting

- `layout/media-text`: image beside text on desktop, stacked on phones with the image first (set `mobileLayout: 'reverse'` for text first).
- `layout/row`: columns that never stack, for icons, stats and logos.
- Tables (`comparison/*`) fill the width and get narrower, they do not stack. Keep them to 2 to 4 columns and short cell text.
- `events/event-block`, `features/icon-text`, `coupon`: two-cell rows that stay side by side.

## Where it stops working

All of the above except the plain column stacking use media queries or CSS classes, so:

- **Outlook desktop** ignores media queries. It always shows the desktop layout, always shows `hideOnMobile` content, and never shows `hideOnDesktop` content. That is right for a desktop client.
- **Gmail on non-Google accounts** (GANGA) drops `<style>` blocks. Mobile shows the desktop layout there, `hideOnDesktop` content stays hidden.
- Everything here is built and checked against the generated HTML, not tested on phones. See [Limitations](limitations.md).

Design for that: the desktop layout should be acceptable on a phone, the mobile settings are an improvement, not a requirement.
