const { P } = require('../_shared');

const mk = (name, price, label, alt) => ({
  image: P.img(300, 300, label, alt),
  name,
  price,
  url: 'https://example.com/products/' + label.toLowerCase().replace(/\s+/g, '-'),
});

module.exports = {
  name: 'Product Carousel',
  description: 'A static, email-safe stand-in for a carousel: a compact row of products with a view-all button. Not interactive, because email clients do not run JavaScript.',
  level: 'section',

  fields: {
    heading: 'text',
    products: { type: 'products', min: 2, max: 6, required: true },
    cta: 'cta',
  },

  settings: {
    columns: { type: 'enum', values: [3, 2, 4], default: 3 },
    gridVariant: { type: 'enum', values: ['minimal', 'default', 'luxury', 'editorial', 'playful'], default: 'minimal' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: { mobileColumns: [2, 1], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Three compact products across, two per row on phones.' },
    wide: { description: 'Four across.', settings: { columns: 4 } },
    cards: { description: 'Three across with full product cards.', settings: { gridVariant: 'default' } },
  },

  previewData: {
    data: {
      heading: 'You might also like',
      products: [
        mk('Linen Shirt', '$120.00', 'Linen Shirt', 'A sand linen shirt'),
        mk('Canvas Tote', '$68.00', 'Canvas Tote', 'A navy canvas tote'),
        mk('Wool Socks', '$32.00', 'Wool Socks', 'Grey merino socks'),
        mk('Cotton Tee', '$45.00', 'Cotton Tee', 'A white cotton tee'),
        mk('Denim Short', '$78.00', 'Denim Shorts', 'Light denim shorts'),
        mk('Sun Hat', '$54.00', 'Sun Hat', 'A straw sun hat'),
      ],
      cta: { label: 'See the whole collection', href: 'https://example.com/collections/all' },
    },
  },

  compat: {
    outlook: 'A plain row of products, no interaction.',
    gmail: 'Works everywhere, nothing interactive. Two per row on phones uses a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
