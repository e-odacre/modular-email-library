const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

const product = (name, price, label, alt, extra = {}) => ({
  image: P.img(400, 400, label, alt),
  name,
  price,
  url: `https://example.com/products/${label.toLowerCase().replace(/\s+/g, '-')}`,
  cta: { label: 'Shop now', href: `https://example.com/products/${label.toLowerCase().replace(/\s+/g, '-')}` },
  ...extra,
});

// A grid of products with a heading and a view-all button.
module.exports = {
  name: 'Best Sellers',
  description: 'A heading and a grid of products with a view-all button.',

  fields: {
    heading: { type: 'text', default: 'Our best sellers' },
    intro: 'text',
    products: { type: 'products', min: 1, max: 12, required: true },
    cta: 'cta',
    columns: { type: 'enum', values: [2, 1, 3, 4], default: 2 },
    cardVariant: { type: 'enum', values: ['default', 'minimal', 'luxury', 'editorial', 'playful'], default: 'default' },
  },

  previewData: {
    heading: 'Our best sellers',
    products: [
      product('Coastal Linen Shirt', '$120.00', 'Linen Shirt', 'The Coastal linen shirt in sand', { badge: 'Best seller' }),
      product('Everyday Canvas Tote', '$68.00', 'Canvas Tote', 'A navy canvas tote bag'),
      product('Merino Sock 3-pack', '$32.00', 'Wool Socks', 'Three pairs of merino socks in grey'),
      product('Heavyweight Tee', '$45.00', 'Cotton Tee', 'A white heavyweight cotton tee'),
    ],
    cta: { label: 'View all best sellers', href: 'https://example.com/collections/best-sellers' },
  },

  build({ columns, cardVariant, ...d }) {
    return [node('commerce/product-grid', d, { settings: { columns, cardVariant } })];
  },
};
