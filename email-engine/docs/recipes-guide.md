# Recipes and sections

Components are the primitives, recipes are compositions of them. A welcome email and a product launch use the same hero, product grid, testimonial and call to action, arranged differently. The generated list of what exists, with the components each one uses, is in [Recipes and sections](recipes.md).

## Sections

A **section** is a reusable group of components: `product-introduction`, `social-proof`, `feature-breakdown`, `urgency`, `storytelling`, `benefits`, `best-sellers`, `cart-contents`, `event-details`, `cta`, `discount`. It takes data and returns nodes.

## Recipes

A **recipe** is a whole email: `welcome`, `abandoned-cart`, `product-launch`, `sale`, `black-friday`, `newsletter`, `event`, `saas-feature-launch`, `post-purchase`, `review-request`, `win-back`, `back-in-stock`. They are starting points, not rigid templates: only the parts that define the email are required, everything else is optional and skipped when you do not pass it.

Every recipe also accepts the frame fields: `preheader`, `announcement`, `viewInBrowser`, `nav` and `footer`. The frame always includes the header and the compliance footer. With no `preheader` text it uses the preview text set in Klaviyo.

## Using them

In an email file:

```
[% extends "layouts/base.mjml" %]
[% block body %]
[[ recipe('welcome', {
  hero: { headline: 'Welcome to ' + t.brand.name, cta: { label: 'Start exploring', href: v('brand.url') },
          image: { src: t.images.hero, alt: 'Welcome' } },
  bestSellers: { products: [ ... ] }
}) ]]
[% endblock %]
```

`flows/welcome.mjml` is written like this. From the command line: `npm run remix -- recipe welcome --data my-welcome.json`. From code: `renderRecipe('welcome', data, tokens, { theme })`.

Data is validated with the same field types as components, so a missing required field fails with `recipe "welcome": hero.headline is required`.

## Writing a section or a recipe

A file in `sections/` or `recipes/` exports:

```js
const { node } = require('../scripts/lib/recipes');

module.exports = {
  name: 'Best Sellers',
  description: 'A heading and a grid of products with a view-all button.',
  suggestedTheme: 'ecommerce',                       // recipes only, optional

  fields: {                                          // same field types as components
    heading: { type: 'text', default: 'Our best sellers' },
    products: { type: 'products', min: 1, required: true },
    cta: 'cta',
  },

  previewData: { heading: '...', products: [ ... ] },    // realistic content, used by the gallery, docs and tests

  build(data, ctx) {                                 // returns nodes
    return [node('commerce/product-grid', data)];
  },
};
```

`ctx.section(name, data)` builds another section, `ctx.vars.get('customer.first_name')` gives a Klaviyo tag. Recipes reuse sections and the shared frame helper (`recipes/_helpers.js`), for example:

```js
build(d, { section }) {
  return frame(d, [
    section('product-introduction', d.hero),
    d.bestSellers ? section('best-sellers', d.bestSellers) : [],
    d.cta ? section('cta', d.cta) : [],
  ]);
}
```

Recipes and sections only produce nodes, never markup. That is what lets remix change the theme or a variant afterwards. The tests build every one from its `previewData`, check every node names a real component, then render every recipe under every theme through the full build checks.

## Klaviyo data in recipes

`abandoned-cart` and `post-purchase` repeat one row over Klaviyo's cart or order items (`commerce/cart-items`). The variable names come from `variables/klaviyo.json`. They depend on your ecommerce integration, so copy them from your event preview in Klaviyo before sending, see [Variables](variables.md).
