const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Product Showcase',
  description: 'One product shown large, with highlights, price, a button and an optional gallery row.',
  level: 'section',

  fields: {
    product: { type: 'product', required: true },
    highlights: { type: 'listItems', max: 5 },
    gallery: { type: 'list', of: 'image', min: 2, max: 3 },
  },

  settings: {
    imagePosition: { type: 'enum', values: ['left', 'right'], default: 'left' },
    split: { type: 'text', attr: true, default: '50/50' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Product image on the left, details on the right.' },
    reverse: { description: 'Details on the left, product image on the right.', settings: { imagePosition: 'right' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      product: {
        image: P.img(560, 640, 'Linen Shirt', 'The Coastal linen shirt in sand, worn untucked'),
        badge: 'New',
        name: 'The Coastal Linen Shirt',
        description: 'Our lightest shirt yet, made for hot days and warm evenings.',
        price: '$120.00',
        salePrice: '$96.00',
        discount: 'Save 20%',
        cta: { label: 'Shop the shirt', href: 'https://example.com/products/coastal-linen-shirt' },
      },
      highlights: ['100% European flax linen', 'Pre-washed for softness', 'Available in XS to XXL'],
      gallery: [
        P.img(180, 220, 'Detail', 'Close-up of the shirt collar and button placket'),
        P.img(180, 220, 'Back', 'The shirt from behind on a hanger'),
        P.img(180, 220, 'Fabric', 'A swatch of the sand-colored linen fabric'),
      ],
    },
  },

  compat: {
    outlook: 'Side by side as a table row, the gallery is a table row of images.',
    gmail: 'Stacking works. Gmail on non-Google accounts shows the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
