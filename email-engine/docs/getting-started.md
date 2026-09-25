# Getting started

## Set up

You need Node 20 or newer. The only dependencies are `mjml` and `nunjucks`.

```bash
npm install
npm run build        # builds flows/, campaigns/ (and examples/ for the placeholder brand) into dist/
npm test
```

Development happens on Windows and every command is a Node script, so nothing needs a POSIX shell.

## See what exists

```bash
npm run preview                  # http://localhost:3000
```

- `/` is the studio overview, with links to your libraries and brand collections.
- `/emails` has visual previews of your emails, flows, and examples.
- `/components` lets you search components, filter by category, and compare their variants.
- `/recipes` shows campaign recipes with their example content.
- Use the Style selector to explore a different theme. Search and category filters stay in the URL, so you can bookmark a filtered library.
- Open a design for desktop and phone previews. Email and recipe pages also offer Open HTML and Download HTML actions.

The page reloads when you save a file. The preview shows the light version only, dark mode needs a real client (see [Limitations](limitations.md)).

```bash
npm run remix -- list            # every recipe, section, theme and component variant
```

## Write your first email

Create `campaigns/summer.mjml`. An email extends the base layout and composes components:

```
[% extends "layouts/base.mjml" %]

[% block body %]
[[ c('email/preheader', { text: 'The summer collection has landed.' }) ]]
[[ c('email/header') ]]
[[ c('hero/standard', {
  headline: 'Summer Collection',
  description: 'Made for slower mornings and warmer days.',
  cta: { label: 'Shop the collection', href: v('brand.url') },
  image: { src: t.images.hero, alt: 'A linen shirt and canvas tote on a sunlit bench' }
}) ]]
[[ c('email/footer') ]]
[% endblock %]
```

- `c('category/name', data, { variant, settings })` renders a component. The bare name works when it is unique (`c('button', ...)`).
- `t` holds the brand tokens, `v('customer.first_name')` gives a Klaviyo tag by name.
- If the data is wrong (a missing headline, an image without alt text) the build fails with a message that names the component and the field.

`npm run build` writes `dist/<brand>/campaigns/summer.html`. Every build also runs the output checks: Klaviyo tags survived, the unsubscribe tag and postal address are present, no leftover template syntax, alt text on every image, size under Gmail's clip.

To start from a whole email instead, use a recipe: `[[ recipe('welcome', { hero: { ... } }) ]]`. See [Recipes](recipes-guide.md).

## Add a brand

1. Copy `tokens/placeholder.json` to `tokens/<brand>.json`.
2. Replace every value with the brand's real one, and empty the `_placeholders` list. Do not invent values you do not know: leave them in `_placeholders` and the build refuses to run for that brand.
3. `npm run build:brand -- <brand>`.

Every brand defines every key. There is no inheritance, so a missing value is an error, never a silent default. See [Design tokens](tokens.md).

## Try another design

```bash
npm run build:themes                                          # every email in every theme
npm run remix -- recipe sale --theme black-friday             # one recipe, one theme
npm run remix -- recipe sale --variant commerce/product-grid=luxury
```

The content never changes, only the design does. See [Variants and remix](variants-and-remix.md).
