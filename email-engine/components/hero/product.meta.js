const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Product Hero',
  description: 'A single product feature: image, eyebrow, name, description, price and button.',
  level: 'section',

  fields: {
    image: { type: 'image', required: true },
    eyebrow: 'text',
    name: { type: 'text', required: true },
    description: 'text',
    price: 'text',
    salePrice: 'text',
    discount: 'text',
    cta: 'cta',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Centered product feature with the image on top.' },
    left: { description: 'Left-aligned text under the image.', settings: { align: 'left' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      image: P.img(600, 480, 'Linen Shirt', 'The Coastal linen shirt in sand, front view'),
      eyebrow: 'Just landed',
      name: 'The Coastal Linen Shirt',
      description: 'Relaxed, breathable and softer with every wash. Cut from European flax in three colors.',
      price: '$120.00',
      salePrice: '$96.00',
      discount: 'Save 20%',
      cta: { label: 'Shop the shirt', href: 'https://example.com/products/coastal-linen-shirt' },
    },
  },

  validate: (data) => (data.salePrice && !data.price ? ['salePrice needs the original price too'] : []),

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine. The image is a real img.',
    darkMode: 'Swaps via dm-* classes on the brand surface or background.',
  },
};
