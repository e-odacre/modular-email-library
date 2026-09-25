const { SECTION_RESPONSIVE, P } = require('../_shared');

const mk = (name, price, label, alt, extra = {}) => ({
  image: P.img(400, 400, label, alt),
  name,
  description: 'Made to be worn every day.',
  price,
  url: 'https://example.com/products/' + label.toLowerCase().replace(/\s+/g, '-'),
  cta: { label: 'Shop now', href: 'https://example.com/products/' + label.toLowerCase().replace(/\s+/g, '-') },
  ...extra,
});

const products = [
  mk('Coastal Linen Shirt', '$120.00', 'Linen Shirt', 'The Coastal linen shirt in sand', { badge: 'Best seller', salePrice: '$96.00', discount: 'Save 20%' }),
  mk('Everyday Canvas Tote', '$68.00', 'Canvas Tote', 'A navy canvas tote bag'),
  mk('Merino Sock 3-pack', '$32.00', 'Wool Socks', 'Three pairs of merino socks in grey', { badge: 'New' }),
  mk('Heavyweight Tee', '$45.00', 'Cotton Tee', 'A white heavyweight cotton tee'),
  mk('Light Denim Short', '$78.00', 'Denim Shorts', 'Light wash denim shorts'),
  mk('Wide Brim Sun Hat', '$54.00', 'Sun Hat', 'A natural straw sun hat'),
];

const data = (n) => ({
  heading: 'Our best sellers',
  intro: 'The pieces our customers reach for again and again.',
  products: products.slice(0, n),
  cta: { label: 'View all best sellers', href: 'https://example.com/collections/best-sellers' },
});

module.exports = {
  name: 'Product Grid',
  description: 'Products in a responsive grid of 1 to 4 columns with an optional heading and a view-all button. Card style is configurable.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    products: { type: 'products', min: 1, max: 12, required: true },
    cta: 'cta',
  },

  settings: {
    columns: { type: 'enum', values: [2, 1, 3, 4], default: 2 },
    cardVariant: { type: 'enum', values: ['default', 'minimal', 'luxury', 'editorial', 'playful'], default: 'default' },
    align: { type: 'alignment', default: 'left' },
    headingAlign: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
    columnPadding: { type: 'spacing', default: '@spacing.sm' },
    gap: { type: 'length', default: '@spacing.md' },
  },

  responsive: { mobileColumns: [1, 2], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Two columns of default cards.' },
    'one-column': { description: 'One product per row.', settings: { columns: 1 } },
    'three-column': { description: 'Three columns.', settings: { columns: 3, align: 'center' } },
    'four-column': { description: 'Four columns of minimal cards.', settings: { columns: 4, cardVariant: 'minimal', align: 'center' } },
    minimal: { description: 'Three columns of minimal cards.', settings: { columns: 3, cardVariant: 'minimal' } },
    editorial: { description: 'Two columns of editorial cards.', settings: { cardVariant: 'editorial' } },
    luxury: { description: 'Three columns of luxury cards.', settings: { columns: 3, cardVariant: 'luxury' } },
    playful: { description: 'Two columns of playful cards.', settings: { cardVariant: 'playful' } },
  },

  previewData: {
    data: data(4),
    byVariant: {
      'one-column': { data: data(2) },
      'three-column': { data: data(6) },
      'four-column': { data: data(4) },
      minimal: { data: data(6) },
      luxury: { data: data(6) },
    },
  },

  compat: {
    outlook: 'Each row is a table with exact widths. mobileColumns is ignored.',
    gmail: 'Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
