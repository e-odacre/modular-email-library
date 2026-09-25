# Coverage

Where every item of the original brief lives. Items the brief lists separately but that share a structure are **variants** of one component, so you never maintain near-duplicate files: `hero/split` has a `reverse` variant instead of a separate reverse-split hero. Component pages are in [components](components/README.md).

## Design tokens (brief §4)

| Asked for | Where |
| --- | --- |
| Colors: primary, secondary, accent, background, surface, text, muted, border, success, warning, error, white, black | `colors` in every brand file (`mutedText` is muted). Custom colors: any value, and any color setting accepts a hex, `rgb()` or name |
| Typography: display, h1-h4, body, body-large, body-small, caption, eyebrow, price, sale-price, button | `type` levels, each with font role, size, weight, line height, letter spacing, transform, color role. Read with `typo('h2')` |
| Spacing xs to 3xl | `spacing` |
| Radius none, small, medium, large, pill | `radius` |
| Shadows | `shadow` scale, applied through the `shadow` setting of `layout/section` and `layout/wrapper` and the theme card style. Ignored by Outlook desktop |
| Container width 600, 640, custom | `layout.width` |

## Layout (§5, §6)

| Asked for | Where |
| --- | --- |
| Email wrapper | `layouts/base.mjml`, `layout/wrapper` |
| Container, constrained section | `layout/container`, `layout/section` |
| Section, full-width section | `layout/section` (variant `full-width`) |
| Column, 1/2/3/4-column | `layout/columns` (variants `one-column`, `default`, `three-column`, `four-column`) |
| Row | `layout/row` (columns that never stack), `layout/grid` |
| 60/40, 40/60 and more | `layout/columns` variants `split-60-40`, `split-40-60`, `split-70-30`, `split-30-70`, `sidebar-left`, `sidebar-right` |
| Image-left/text-right, text-left/image-right | `layout/media-text` (`default`, `image-right`, `large-image`) |
| Asymmetric | `layout/asymmetric` |
| Spacer, divider | `layout/spacer`, `layout/gap`, `layout/divider`, `layout/rule` (content and section versions) |
| Responsive: `mobileLayout`, `mobileAlignment`, `mobileColumns`, `hideOnMobile`, `hideOnDesktop` | [Responsive behavior](responsive.md), only on components where they make sense |

## Content (§7)

Text `content/text`, heading `content/heading`, rich text `content/rich-text`, image `content/image`, button `content/button`, button group `content/button-group`, link `content/link`, icon `content/icon`, social links `content/social-links`, logo `content/logo`, quote `content/quote`, list `content/list`, numbered list `content/numbered-list`, spacer and divider under layout.

## Heroes (§8)

Standard `hero/standard`, split `hero/split`, reverse split `hero/split` (variant `reverse`), full-bleed `hero/full-bleed` (VML fallback for Outlook), text-only `hero/text-only`, product `hero/product`.

## Commerce (§9)

Product card `commerce/product-card` (variants `default`, `minimal`, `luxury`, `editorial`, `playful`; badge, name, description, original and sale price, discount, CTA), product grid `commerce/product-grid` (1 to 4 columns, `mobileColumns` 1 or 2), product showcase `commerce/product-showcase`, product carousel `commerce/product-carousel` (**static approximation**, see [Limitations](limitations.md)), plus `commerce/price` and `commerce/cart-items` (Klaviyo cart or order loop).

## Promotional (§10)

Discount banner, promo banner, sale badge, discount code, coupon, urgency banner, last-chance block, announcement bar, offer card, free-shipping banner (with progress bar), limited-time offer, mystery gift, plus `promotional/countdown` (timer image slot with a text fallback). All under `promotional/`.

## Social proof, features, editorial, SaaS, events, FAQ, comparison, stats, logos (§11 to §19)

| Asked for | Where |
| --- | --- |
| Testimonial, review, rating, customer stats | `social-proof/testimonial`, `review`, `rating`, `customer-stats` |
| Feature grid, feature card, icon + text | `features/feature-grid`, `feature-card`, `icon-text` |
| 2-, 3-, 4-feature layouts | `features/feature-grid` variants `two-feature`, `default` (three), `four-feature` |
| Benefits, numbered steps, process | `features/benefits`, `numbered-steps`, `how-it-works` |
| Article card, article grid, featured article, blog post preview | `editorial/article-card`, `article-grid`, `featured-article`, `blog-post-preview` |
| Image + article, editorial image, storytelling, text-heavy, quote | `editorial/image-article`, `editorial-image`, `storytelling`, `text-heavy`, and `content/quote` |
| Feature announcement, product update, new feature, integration, pricing highlight | `saas/feature-announcement`, `product-update`, `new-feature`, `integration`, `pricing-highlight` |
| Use case, customer story, case study, metrics, CTA section | `saas/use-case`, `customer-story`, `case-study`, `metrics`, `cta-section` |
| SaaS feature comparison | `comparison/feature-comparison` |
| Event block, RSVP block, speaker card | `events/event-block`, `rsvp-block`, `speaker-card` |
| FAQ | `faq/faq` (all answers visible, no JavaScript) |
| Comparison table, feature, plan, product comparison | `comparison/comparison-table` (the engine, on `mj-table`), `feature-comparison`, `plan-comparison`, `product-comparison` |
| Before/after, old vs new | `comparison/before-after`, `old-vs-new` |
| Single stat, 2/3/4-stat grids, metric highlight | `stats/stat`, `stats/stat-grid` (variants `two-stat`, `default`, `four-stat`), `stats/metric-highlight` |
| Logo strip, trusted-by, partner, client, press logos | `logos/logo-strip` (variants `trusted-by`, `partners`, `clients`, `press`) |

## Decorative (§20)

| Asked for | Where |
| --- | --- |
| Eyebrow, section label, number marker | `decorative/eyebrow`, `section-label`, `number-marker` |
| Badge, pill, tag | `decorative/badge` (variants `default`, `pill`, `outline`, `tag`, `success`, `urgent`) |
| Decorative line, accent line | `decorative/line` (variants `default` = accent bar, `wide`, `double`, `dotted`, `ornament`) |
| Arrow, star rating, shapes | `decorative/arrow`, `star-rating`, `shapes` |
| Background pattern, corner accents, decorative image | `decorative/background-pattern`, `corner-accent`, `decorative-image` |

## Footer and email infrastructure (§21, §22)

`email/footer` (logo, description, address, social links, navigation, legal links, preferences, unsubscribe, copyright, disclaimer), `email/header`, `email/preheader`, `email/view-in-browser`, `email/unsubscribe`, `email/preference-center`, `email/legal-disclaimer`, `email/tracking-safe-cta`, `email/outlook-safe-button` (VML), `email/outlook-safe-background`, `email/mobile-only`, `email/desktop-only`, `email/fallback-content`.

## Variables (§23)

`variables/klaviyo.json`, read with `v('customer.first_name')` or `vars.get(...)`, see [Variables](variables.md). Some names in the brief are not Klaviyo tags, so they are data you pass instead: `discount.percent`, `offer.text`, `cta.text` and `cta.url` are fields of the components that show them, and `product.*` comes from the `products` data or, in flows, from the cart loop in `commerce/cart-items`. `brand.name` and `brand.url` map to `organization.name` and `organization.url`, or to the brand tokens.

## Architecture concepts (§2, §24 to §30)

| Asked for | Where |
| --- | --- |
| Component metadata (name, category, description, fields, settings, variants, responsive, preview data, render) | `*.meta.js`, see [Component metadata](component-metadata.md) |
| Variants without duplicated implementations | Variants are setting overrides, [Variants and remix](variants-and-remix.md) |
| Themes: minimal, luxury, editorial, bold, playful, e-commerce, SaaS, wellness, fashion, Christmas, Black Friday, Valentine's, Summer | `themes/*.json`, [Themes](themes-guide.md) (style-only, no invented palettes) |
| Section recipes | `sections/*.js`: product introduction, social proof, feature breakdown, urgency, storytelling, plus benefits, best sellers, cart contents, event details, CTA, discount |
| Campaign recipes: welcome, abandoned cart, product launch, sale, Black Friday, newsletter, event, SaaS feature launch | `recipes/*.js`, plus post-purchase, review request, win-back, back-in-stock |
| Remix | `npm run remix`, `scripts/lib/remix.js` |
| Configurable properties, sensible defaults | `settings` with defaults on every component |

## Quality (§31 to §38)

| Asked for | Where |
| --- | --- |
| Accessibility | Alt text is required by the schema on every image (or `decorative: true`), vague link text is rejected, real heading tags with a separate visual size, decorative images handled, the build warns on a missing alt |
| Email compatibility | Per-component `compat` and header comments, [Limitations](limitations.md) |
| Realistic preview data | Required by the registry, tested |
| Documentation | This folder, generated per-component pages, the README table |
| Example email | `examples/summer-collection.mjml` (components only), `flows/welcome.mjml` (recipe) |
| Testing | [Testing](testing.md) |
| Validation with useful errors | `scripts/lib/schema.js`, every component and recipe |
| Easy to extend | `npm run new:component`, `npm run new:theme`, [Adding a component](adding-a-component.md) |
| Ready for a builder | Component metadata, nodes and slots, the remix API and the gallery are the pieces a visual builder would use. None is built |
