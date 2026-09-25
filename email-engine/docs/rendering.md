# Rendering emails

## The workflow

```
Choose a theme  ->  choose a recipe  ->  customize components  ->  provide content  ->  render MJML  ->  generate HTML
```

In practice:

```bash
npm run remix -- recipe welcome --theme minimal --data content.json      # recipe + theme + content -> HTML
```

or write the email by hand and build it.

## Three ways to write an email

**1. Compose components** in a `.mjml` file. Full control, see `examples/summer-collection.mjml`:

```
[[ c('hero/standard', { headline: '...', cta: {...}, image: {...} }) ]]
[[ c('commerce/product-grid', { products: [...] }, { variant: 'luxury' }) ]]
```

**2. Use a recipe** inside a `.mjml` file. The recipe supplies structure, you supply content. `flows/welcome.mjml` does this:

```
[[ recipe('welcome', { hero: { ... }, bestSellers: { ... } }) ]]
```

**3. Use a recipe from the command line or code**, with no `.mjml` file at all: `npm run remix -- recipe sale ...` or `renderRecipe('sale', data, tokens, { theme })`.

Emails live in `flows/` (automated flows) and `campaigns/` (one-off sends), and both are built for every brand. `examples/` holds worked examples with placeholder images, built for the placeholder brand only.

## Build

```bash
npm run build                          # every brand, every email
npm run build:brand -- acme            # one brand
npm run build:brand -- acme --theme luxury      # another theme (or --theme all)
```

Output: `dist/<brand>/<flows|campaigns>/<email>.html`, and for another theme `dist/<brand>/themes/<theme>/...`. The build exits non-zero if anything fails.

## What the build checks

Token validation first (a brand with placeholder values fails), then for each email:

- MJML compiles in strict mode with no errors.
- **No Klaviyo tag went missing.** MJML silently drops tags placed between `mj-*` elements. The build compares the tags before and after and fails on any that vanished.
- The unsubscribe tag is present, and the bare `{% unsubscribe %}` is not inside an `href`.
- The postal address tag `{{ organization.full_address }}` is present.
- No leftover `[[ ]]` or `[% %]`.
- No `placehold.co` or `example.com` URL in a real brand's output.
- Warnings: over about 102 KB (Gmail clips longer messages), an `<img>` without `alt`.

Component data is validated as it renders, so a missing headline or an image without alt text stops the build with the component and field named.

## Delivering to Klaviyo

Delivery today is manual: build, then paste `dist/<brand>/.../<email>.html` into a Klaviyo custom HTML template. Full emails only. Klaviyo tags are ordinary text in the output. Event variables (cart, order) depend on your integration, copy them from your event preview first, see [Variables](variables.md). Send tests to real inboxes before a flow goes live, see [Limitations](limitations.md).

## From code

```js
const { renderEmail, renderComponent, renderRecipe } = require('./scripts/lib/render');

await renderEmail('flows/welcome.mjml', tokens, { theme: 'luxury' });
await renderComponent('commerce/product-card', tokens, { variant: 'luxury', theme: 'fashion' });
await renderRecipe('sale', data, tokens, { theme: 'black-friday', remix: { variants: { ... } } });
```

Each returns `{ html, mjml, mjmlErrors, ... }`. Run `runChecks(html, brand, mjml)` from `scripts/lib/checks.js` for the output checks.

## ESP-specific output

Klaviyo syntax is isolated in two places: `variables/klaviyo.json` (the tags) and the compliance components in `components/email/` (unsubscribe, preferences, view-in-browser, preheader). A different ESP is another variables file plus those components, the rest of the library does not know Klaviyo exists.
