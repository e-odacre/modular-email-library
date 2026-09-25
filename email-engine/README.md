# modular-email-blocks

A modular email design system, built with Nunjucks and MJML, for Klaviyo. One set of components, many brands and themes: a brand is a token file, a theme is a style preset, and a complete email is a recipe.

```
Design tokens -> Components -> Variants -> Sections -> Campaign recipes -> Complete email
   (brand)        (MJML)      (styling)   (groups)      (whole emails)      (HTML)
```

```
Nunjucks (compose + inject tokens)  ->  MJML (compile to HTML)  ->  checks  ->  dist/<brand>/<flows|campaigns>/<email>.html
```

You work with `Hero`, `ProductGrid`, `Testimonial`, `FeatureGrid`, `DiscountBanner` and `Footer`, not with `mj-section` and `mj-column`.

## Quick start

```bash
npm install
npm run build                       # build every email for every brand
npm run preview                     # live preview, recipe pages and the component gallery at http://localhost:3000
npm run remix -- recipe sale --theme black-friday     # the same content in another design
npm test
```

An email is a `.mjml` file that composes components:

```
[[ c('hero/standard', {
  eyebrow: 'New for summer',
  headline: 'Summer Collection',
  cta: { label: 'Shop the collection', href: 'https://example.com/collections/summer' },
  image: { src: 'https://cdn.example.com/summer.jpg', alt: 'A linen shirt and canvas tote on a bench' }
}) ]]
[[ c('commerce/product-grid', { products: [ ... ] }, { variant: 'three-column' }) ]]
[[ c('email/footer') ]]
```

Or it is a recipe: `[[ recipe('welcome', { hero: { ... } }) ]]`. See [examples/summer-collection.mjml](examples/summer-collection.mjml) for a complete email written only with library components, and [docs/](docs/README.md) for everything else.

## Commands

| Command | What it does |
| --- | --- |
| `npm install` | Install `mjml` and `nunjucks` (the only dependencies) |
| `npm run build` | Build every email for every brand in `tokens/` (examples too, for the placeholder brand) |
| `npm run build:brand -- <brand>` | Build one brand |
| `npm run build:themes` | Build every email in every theme, written to `dist/<brand>/themes/<theme>/` |
| `npm run preview -- <brand> <email>` | Live preview with auto-reload: emails, `/recipes`, `/components` and a theme switcher (port 3000, or set `PORT`) |
| `npm run gallery:brand -- sanecotec` | Build the SanEcoTec draft gallery: 48 block presets, 12 complete emails, three styles, desktop/phone previews |
| `npm run remix -- recipe <name> [--theme t] [--variant component=variant]` | Render a recipe in another theme or with other variants. `npm run remix -- list` shows what exists |
| `npm run new:component -- <category> <name>` | Scaffold a working component with metadata, preview data and tests coverage |
| `npm run new:theme -- <name>` | Scaffold a theme as a complete copy of `minimal` |
| `npm run docs` / `npm run docs:check` | Generate (or verify) the documentation and the compatibility table below |
| `npm test` | Run the tests: every component, variant, theme and recipe is rendered and compiled |

The build exits non-zero if any brand or email fails, so it can gate CI.

## Layout

```
tokens/<brand>.json      brand identity: colors, fonts, type scale, spacing, radius, shadow, logo, images, dark values
themes/<theme>.json      style presets, each complete: type/spacing/radius overrides, button, card, badge, divider, accent
components/<category>/   <name>.njk (template) + <name>.meta.js (metadata): fields, settings, variants, preview data
sections/*.js            reusable groups of components (best sellers, social proof, ...)
recipes/*.js             whole emails from sections and components (welcome, abandoned cart, sale, ...)
variables/klaviyo.json   semantic variable names mapped to Klaviyo tags, each marked verified or not
layouts/base.mjml        head, dark-mode and responsive CSS, body wrapper. Emails extend it.
flows/*.mjml             flow emails (welcome, ...)
campaigns/*.mjml         one-off campaigns
examples/*.mjml          worked examples, built for the placeholder brand only
scripts/                 build, preview, remix, docs, scaffolding, validation, output checks
docs/                    guides plus generated reference pages
tests/                   node:test suites, including the Klaviyo-syntax fixture
dist/                    build output, gitignored
```

## Two template languages, two sets of delimiters

Klaviyo uses `{{ }}` and `{% %}`. So this repo's Nunjucks uses `[[ ]]` and `[% %]` (and `[# #]` for comments).

- `[[ t.colors.primary ]]` is a build-time token. It is replaced when you build.
- `{{ first_name|default:'there' }}` is a Klaviyo tag. It passes through to the output untouched.

Tokens are available in every template as `t`. Ask for Klaviyo tags by name with `v('customer.first_name')` (see [docs/variables.md](docs/variables.md)) instead of typing them.

### Wrap Klaviyo conditionals in `<mj-raw>`

MJML **silently drops** Klaviyo tags it finds between `mj-*` elements, with no error even in strict mode. Do this:

```xml
<mj-raw>{% if person.first_name %}</mj-raw>
<mj-section>...</mj-section>
<mj-raw>{% endif %}</mj-raw>
```

Tags inside `mj-text`, in attributes like `href`, and inside `mj-button` are fine. The build compares Klaviyo tags before and after MJML and fails if any went missing, and `tests/klaviyo-syntax.test.js` pins the behavior. Components that need a loop or a conditional (`commerce/cart-items`) wrap it for you.

## Brands and tokens

Brand-specific design collections live separately in `brands/<brand>/`. Start with the [SanEcoTec collection](brands/sanecotec/README.md) and [collection guide](docs/brand-collections.md). Draft collections use the shared components without entering the normal production brand build.

`tokens/placeholder.json` is the reference. Every other brand must define **every** key. There is no inheritance, so a default can never quietly fill a gap. Unknown keys are errors too, which catches typos. See [docs/tokens.md](docs/tokens.md).

To add a brand: copy `placeholder.json` to `tokens/<brand>.json`, replace every value, and empty the `_placeholders` list. Until then, building that brand fails, and it also fails while any value still points at `placehold.co` or `example.com`.

- Colors: `primary, primaryText, secondary, accent, success, warning, error, white, black, background, surface, text, mutedText, border, link`.
- Typography: 13 levels (`display`, `h1` to `h4`, `body`, `bodyLarge`, `bodySmall`, `caption`, `eyebrow`, `price`, `salePrice`, `button`), each with font role, size, weight, line height, letter spacing, transform and color role.
- `spacing` (`xs` to `3xl`), `radius` (`none` to `pill`), `shadow` (`none` to `large`), `layout.width`.
- `dark` is optional. Omit it and no dark-mode CSS is emitted. If present it must be complete.
- Values go into MJML attributes, so use single quotes inside font stacks, never double quotes.
- Tokens are JSON, so no comments.

## Themes

A theme changes how components look, not what the brand is. `minimal` (default), `luxury`, `editorial`, `bold`, `playful`, `ecommerce`, `saas`, `wellness`, `fashion`, `christmas`, `black-friday`, `valentines` and `summer`. Themes are style-only: they may override the type, spacing, radius and shadow scales and choose which brand color roles to use, but colors, fonts and logos always come from the brand. See [docs/themes-guide.md](docs/themes-guide.md).

## Klaviyo notes

Tags here were checked against Klaviyo's help center (message personalization reference, unsubscribe and coupon articles, date tags, content repeat). [docs/variables.md](docs/variables.md) lists each one and whether it was verified.

- `{% unsubscribe_link %}`, `{% manage_preferences_link %}` and `{% web_view_link %}` give only a URL, use them inside `href`. The bare `{% unsubscribe %}` outputs a full link and breaks inside an `href`. The build fails on that.
- `{{ organization.full_address }}` comes from Klaviyo's organization settings. The build fails if it is missing.
- If Klaviyo finds no unsubscribe tag, it appends its own footer. The build fails first so you never rely on that.
- Cart and order variables depend on your ecommerce integration. Klaviyo says to copy them exactly from the event preview, so treat the defaults as a starting point.
- Delivery today is manual: build, then paste `dist/<brand>/.../<email>.html` into a Klaviyo custom HTML template. Full emails only.

## Compatibility

Every component has a header comment on its known limits, and a `compat` entry in its metadata. This table is generated from that metadata by `npm run docs`. Nothing here has been tested in real email clients yet, see [docs/limitations.md](docs/limitations.md). Test light and dark in real clients before a brand goes live, the preview server shows the light version only.

Dark mode overall: `color-scheme` meta plus `prefers-color-scheme` CSS. Apple Mail and iOS Mail honor it. Gmail apps only partly (they may recolor on their own). Outlook desktop ignores it.

<!-- components:start -->
| Component | Outlook desktop | Gmail apps | Dark mode |
| --- | --- | --- | --- |
| `commerce/cart-items` | Each row is a media-text table row. | Rows stack on phones through a media query. Non-Google Gmail accounts keep the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `commerce/price` | Line-through honored. | Fine. | Price text swaps via dm-text where honored. The sale price keeps its color. |
| `commerce/product-card` | Tables and text honored. Rounded corners and pill buttons render square. | Fine. Product image is a real img with alt text. | Text swaps via dm-text where honored. Images are not recolored. |
| `commerce/product-carousel` | A plain row of products, no interaction. | Works everywhere, nothing interactive. Two per row on phones uses a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `commerce/product-grid` | Each row is a table with exact widths. mobileColumns is ignored. | Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `commerce/product-showcase` | Side by side as a table row, the gallery is a table row of images. | Stacking works. Gmail on non-Google accounts shows the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `comparison/before-after` | Two columns as a table row. | Stacking works. Non-Google Gmail accounts show the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `comparison/comparison-table` | Tables, colors and borders honored. | Fine. On phones the columns shrink, so keep cell text short. | Cells on the surface or background swap via dm-* classes. Header cells keep their colors. |
| `comparison/feature-comparison` | Tables, colors and borders honored. | Fine. Columns shrink on phones. | Cells on the surface or background swap via dm-* classes. |
| `comparison/old-vs-new` | Two columns as a table row, marks are text glyphs. | Stacking works. Non-Google Gmail accounts show the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `comparison/plan-comparison` | Tables, colors and borders honored. | Fine. Columns shrink on phones. | Cells on the surface or background swap via dm-* classes. Header cells keep their colors. |
| `comparison/product-comparison` | Tables, images and borders honored. | Fine. Columns shrink on phones. | Cells on the surface or background swap via dm-* classes. Images are not recolored. |
| `content/button-group` | Tables with square corners. Padding uses mso-padding-alt. | Fine. Inline buttons wrap when the column is narrow. | Buttons keep their own colors. |
| `content/button` | Rounded corners render square in Outlook desktop. | Fine. | Swaps via dm-button classes where honored, otherwise keeps its own light colors. |
| `content/heading` | Heading tags honored with explicit inline styles. | Fine. | Text color swaps via dm-text where honored. Set darkMode off on colored backgrounds. |
| `content/icon` | Fixed width honored. Border radius ignored. | Fine. Keep meaning in adjacent text in case images are blocked. | Icons are not recolored. |
| `content/image` | Width honored, border radius ignored (square corners). | Fine. Images are blocked by default in some clients, so alt text matters. | Images are not recolored. Prefer solid backgrounds over transparent ones. |
| `content/link` | Underline and color honored. | Fine. | Link color swaps via dm-text where honored. |
| `content/list` | ul and li honored with explicit styles. Glyph markers are table cells. | Fine. | Text swaps via dm-text where honored. Marker glyphs keep the accent color. |
| `content/logo` | Always shows the light logo. | May auto-invert colors, use a logo that reads on both. | Swaps to the dark logo where honored. |
| `content/numbered-list` | ol/li honored. Circles render as squares. | Fine. | Text swaps via dm-text where honored. Number badges keep the accent color. |
| `content/quote` | Accent bar is a shaded table cell, honored. Italics honored. | Fine. | Quote text and author swap via dm-text and dm-muted where honored. |
| `content/rich-text` | Paragraph margins can differ slightly. Keep the formatting simple. | Fine. | Text and link colors swap via dm-text where honored. |
| `content/social-links` | Icons render as linked images, radius ignored. | Fine. The label is the alt text when images are blocked. | Icons keep their colors. Text variant follows the link color. |
| `content/text-block` | Paragraph margins can differ slightly. | Fine. | Text and background swap via dm-* classes where honored. |
| `content/text` | Line height and padding honored. | Fine. | Text color swaps via dm-text where honored. Set darkMode off on colored backgrounds. |
| `decorative/arrow` | Renders from the system symbol font, appearance varies slightly. | Fine. | Accent color stays. |
| `decorative/background-pattern` | Background image via MJML VML fallback. | Background images can be blocked, the solid color shows instead. | Keeps its own colors, it is a branded block. |
| `decorative/badge` | Background, padding and border honored. Rounded corners are not. | Fine. | Chips keep their own colors. |
| `decorative/corner-accent` | Section borders honored. | Fine. | Background swaps on the brand surface, the accent border stays. |
| `decorative/decorative-image` | Fixed width honored, radius ignored. | Fine. Nothing meaningful is lost if images are blocked. | Images are not recolored. |
| `decorative/eyebrow` | Letter spacing and uppercase honored. | Fine. | Keeps the accent color. Use a light color on colored backgrounds. |
| `decorative/line` | Solid bars honored. Dotted and double can render as solid. | Fine. | Accent color stays. Ornament uses the muted color. |
| `decorative/number-marker` | Number and colors honored, the circle becomes a square. | Fine. | Markers keep the accent color. |
| `decorative/section-label` | Table cells and colors honored. | Fine. | Lines and label swap via dm-* classes where honored. |
| `decorative/shapes` | Colored cells honored. Circles fall back to squares. | Fine. | Blocks keep their colors. |
| `decorative/star-rating` | Star glyphs render from the system symbol font. | Fine. | Filled stars keep the star color, empty stars use the border color. |
| `editorial/article-card` | Text and images honored. | Fine. The image is a real img with alt text. | Text swaps via dm-text where honored. Title link takes the dark link color. |
| `editorial/article-grid` | Each row is a table with exact widths. mobileColumns is ignored. | Stacking works. Non-Google Gmail accounts show the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `editorial/blog-post-preview` | Side by side as a table row. | Fine. Stacks on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `editorial/editorial-image` | Honored. | Fine. Alt text describes the image if blocked. | Caption swaps via dm-muted where honored, image not recolored. |
| `editorial/featured-article` | Text and images honored. Split is a table row. | Fine. The split variant stacks on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `editorial/image-article` | Text and images honored. Side variants are a table row. | Fine. Side variants stack on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `editorial/storytelling` | Honored, a padded section with text. | Fine. | Swaps via dm-* classes when on the brand surface or background color. |
| `editorial/text-heavy` | Honored. Paragraph margins can differ slightly. | Fine. Very long emails can be clipped above about 102 KB. | Swaps via dm-* classes when on the brand surface or background color. |
| `email/desktop-only` | Always shown (no media queries). | Hidden on phones. Gmail on non-Google accounts shows it on phones too. | Nothing extra, the sections inside carry their own colors. |
| `email/fallback-content` | Shows only the fallback slot. | Shows only the primary slot. | Nothing extra, the components inside carry their own colors. |
| `email/footer` | Fine. Keep footer text at 12px or above. | Fine. Gmail may add its own unsubscribe control separately. | Text and link colors swap via dm-* classes where honored. |
| `email/header` | Always shows the light logo. | May auto-invert colors, use a logo that reads on both. | Swaps to dark.logoUrl where honored. |
| `email/legal-disclaimer` | Honored. | Fine. | Text swaps via dm-muted where honored. |
| `email/mobile-only` | Never shown (Outlook desktop ignores media queries), by design. | Shown on phones. Stays hidden in Gmail on non-Google accounts. | Nothing extra, the sections inside carry their own colors. |
| `email/outlook-safe-background` | Background image via VML. | Background images can be dropped, the solid color shows. | Keeps its own colors. |
| `email/outlook-safe-button` | True rounded corners via VML roundrect, whole shape clickable. | A normal inline-block link with border-radius. | Keeps its own colors. |
| `email/preference-center` | Plain text link, honored. | Fine. | Link color swaps via dm-muted where honored. |
| `email/preheader` | Hidden with display:none and mso-hide. Outlook desktop does not show previews in the list. | Shows in the inbox list, padding keeps body text out of it. | Invisible, nothing to swap. |
| `email/tracking-safe-cta` | A content/button, square corners in Outlook desktop. | Fine. | As content/button. |
| `email/unsubscribe` | Plain text link, honored. | Fine. Gmail may add its own unsubscribe control separately. | Link color swaps via dm-muted where honored. |
| `email/view-in-browser` | Plain text and a link, honored. | Fine. | Text and link swap via dm-* classes where honored. |
| `events/event-block` | Honored, the details are a plain table. | Fine. | Swaps via dm-* classes on the brand surface. The dark variant keeps its colors. |
| `events/rsvp-block` | Tables and text honored. Rounded button corners are square. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `events/speaker-card` | Text and photo honored, the circular crop is square. | Fine. Alt text names the speaker if images are blocked. | Text swaps via dm-text and dm-muted where honored. |
| `faq/faq` | Honored, it is headings and text. | Fine. | Swaps via dm-* classes when on the brand surface or background color. |
| `features/benefits` | Side by side as a table row with an image. Check marks are text glyphs. | Stacking works. Non-Google Gmail accounts show the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `features/feature-card` | Text and images honored. Circular crops render square. | Fine. The title carries the meaning if images are blocked. | Text swaps via dm-text where honored. Icons are not recolored. |
| `features/feature-grid` | Each row is a table with exact widths. mobileColumns is ignored. | Stacking works. Gmail on non-Google accounts shows the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `features/how-it-works` | Number markers are table cells, circles render as squares. | Steps stack on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `features/icon-text` | Table cells and images honored. | Fine. Cells stay side by side on phones, keep text short. | Text swaps via dm-* classes where honored. Icons are not recolored. |
| `features/numbered-steps` | Number markers are table cells, honored. Circles render as squares. | Fine. Horizontal steps stack on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `hero/full-bleed` | Background image uses a VML fallback. | Background images can be cropped or blocked, keep the message in text. | Keeps its own colors on purpose. |
| `hero/product` | Tables and text honored. | Fine. The image is a real img. | Swaps via dm-* classes on the brand surface or background. |
| `hero/split` | Side by side as a table row. | Stacking works. Gmail on non-Google accounts shows the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `hero/standard` | Tables and text, all honored. Rounded image corners ignored. | Fine. The image is a real img, never a background. | Swaps on the brand surface or background. Keeps its colors on a colored background. |
| `hero/text-only` | Text and colors honored. | Fine, no image to drop. | Swaps on the brand surface. Dark and accent variants keep their colors. |
| `layout/asymmetric` | Renders as a table row. The offset is a spacer, so it works. | Stacking works. Gmail on non-Google accounts shows the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/columns` | Columns render as a table row. Mobile-only settings (mobileColumns, mobileAlignment) are ignored. | Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/container` | Honored, it is section padding. | Fine. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/divider` | Solid lines are honored. Dashed and dotted can render as solid. | Fine. | Border color swaps via dm-border when it uses the brand border color. |
| `layout/gap` | A section with a fixed-height spacer, honored. | Fine. | Swaps to the dark surface when on the brand surface or background color. |
| `layout/grid` | Each row is a table with exact widths. mobileColumns is ignored. | Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/media-text` | Side by side as a table row. Mobile order setting only affects phones. | Stacking works. Gmail on non-Google accounts shows the desktop layout on phones. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/row` | Renders as a table row, same as desktop. | Fine. Columns get narrow on phones, keep content short. | Swaps via dm-* classes when on the brand surface or background color. |
| `layout/rule` | Solid lines honored. Dashed and dotted can render as solid. | Fine. | Background and border color swap via dm-* classes when on the brand colors. |
| `layout/section` | Background and padding honored. Border radius and shadows are ignored. | Fine. | Swaps to the dark surface when on the brand surface or background color. |
| `layout/spacer` | Fixed-height table cell, honored. | Fine. | Empty space, nothing to swap. |
| `layout/wrapper` | Background and padding honored. Border radius and shadows are ignored. | Fine. | Swaps only when on the brand surface or background color. |
| `logos/logo-strip` | Images with fixed widths, honored. | Fine. Alt text (the company name) shows when images are blocked. | Label swaps via dm-muted, logos are not recolored. |
| `promotional/announcement-bar` | Solid band with centered text, honored. | Fine. | Light variant swaps with the surface. Colored bars keep their colors. |
| `promotional/countdown` | A normal image. Animated timers show only the first frame. | Images go through a proxy that can cache them, so a timer can show a stale time. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/coupon` | Cells, colors and text honored. Dashed border can render solid. | Fine. Cells stay side by side on narrow phones, keep the value short. | Keeps its own colors. |
| `promotional/discount-banner` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/discount-code` | Box and text honored. Dashed can render solid, rounded corners square. | Fine. The code is real text and can be copied. | Keeps its own colors. Use on-color on colored bands. |
| `promotional/free-shipping` | The bar is a two-cell table, honored. Rounded ends are square. | Fine. | On the brand surface the text swaps, on colored bands the colors stay. |
| `promotional/last-chance` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/limited-time` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/mystery-gift` | The glyph can render as a monochrome symbol, everything else is honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/offer-card` | Background, border and padding honored. Rounded corners are square. | Fine. | Card background and text swap via dm-* classes on the brand surface. |
| `promotional/promo-banner` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `promotional/sale-badge` | Size, color and text honored, the circle becomes a square. | Fine. | Keeps its own colors. |
| `promotional/urgency-banner` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `saas/case-study` | Each stats row is a table with exact widths. | Fine. Stats sit two per row on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/cta-section` | Tables and text honored. Rounded button corners are square. | Fine. Side-by-side buttons wrap when the column is narrow. | Light variant swaps with the surface. Colored bands keep their colors. |
| `saas/customer-story` | Honored. | Fine. The logo alt text names the customer if images are blocked. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/feature-announcement` | Honored. The split layout is a table row, frame corners are square. | Fine. The split layout stacks on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/integration` | Honored, three table cells. | Fine. Alt text carries the names if images are blocked. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/metrics` | Each row is a table with exact widths. | Two per row on phones through a media query. Non-Google Gmail accounts show the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/new-feature` | Card background, border and padding honored. Rounded corners are square. | Fine. | Card background and text swap via dm-* classes on the brand surface. |
| `saas/pricing-highlight` | Card background, border and padding honored. Rounded corners are square. | Fine. | Default card swaps via dm-* classes on the brand surface. The featured card keeps its colors. |
| `saas/product-update` | Honored, text and small badge tables. | Fine. | Swaps via dm-* classes when on the brand surface or background color. |
| `saas/use-case` | Side by side as a table row. | Fine. Stacks on phones through a media query. | Swaps via dm-* classes when on the brand surface or background color. |
| `social-proof/customer-stats` | Each row is a table with exact widths. | Two per row on phones uses a media query. Non-Google Gmail accounts show the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `social-proof/rating` | Star glyphs render from the system symbol font, text honored. | Fine. | Text swaps via dm-text where honored. |
| `social-proof/review` | Star glyphs from the system symbol font, text honored. | Fine. | Text swaps via dm-text and dm-muted where honored. |
| `social-proof/testimonial` | Text and layout honored. Circular avatar renders square. | Fine. | Text and background swap via dm-* classes on the brand surface or background. |
| `stats/metric-highlight` | Tables and text honored. | Fine. | Light variant swaps with the surface. Colored bands keep their colors. |
| `stats/stat-grid` | Each row is a table with exact widths. mobileColumns is ignored. | Two per row on phones uses a media query. Non-Google Gmail accounts show the desktop layout. | Swaps via dm-* classes when on the brand surface or background color. |
| `stats/stat` | Text and colors honored. | Fine. | Label swaps via dm-text where honored. The value keeps its color. |
<!-- components:end -->

## Adding a component

```bash
npm run new:component -- <category> <name> [--level content|section]
```

That creates a working template and its metadata. Edit them, `npm run docs`, `npm test`. Nothing else needs editing: the registry finds it, the gallery shows it, the tests cover it. See [docs/adding-a-component.md](docs/adding-a-component.md).
