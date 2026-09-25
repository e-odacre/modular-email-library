const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Product Comparison',
  description: 'Two to four products side by side: photo, name and price on top, spec rows, and a button under each.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    products: {
      type: 'list',
      min: 2,
      max: 4,
      required: true,
      of: {
        type: 'object',
        fields: {
          name: { type: 'text', required: true },
          price: 'text',
          image: 'image',
          highlight: 'boolean',
          cta: 'cta',
        },
      },
    },
    rows: {
      type: 'list',
      min: 1,
      max: 20,
      required: true,
      of: { type: 'object', fields: { label: { type: 'text', required: true }, values: { type: 'list', of: 'text', min: 1, max: 4, required: true } } },
    },
  },

  settings: {
    tableVariant: { type: 'enum', values: ['default', 'zebra', 'tinted'], default: 'default' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Products with hairline spec rows.' },
    zebra: { description: 'Alternating row shading.', settings: { tableVariant: 'zebra' } },
  },

  previewData: {
    data: {
      heading: 'Which linen shirt is right for you?',
      products: [
        { name: 'Coastal', price: '$120', image: P.img(128, 128, 'Coastal', 'The Coastal shirt in sand'), cta: { label: 'Shop', href: 'https://example.com/products/coastal' } },
        { name: 'Harbour', price: '$135', image: P.img(128, 128, 'Harbour', 'The Harbour shirt in navy'), highlight: true, cta: { label: 'Shop', href: 'https://example.com/products/harbour' } },
        { name: 'Dune', price: '$110', image: P.img(128, 128, 'Dune', 'The Dune shirt in white'), cta: { label: 'Shop', href: 'https://example.com/products/dune' } },
      ],
      rows: [
        { label: 'Fit', values: ['Relaxed', 'Regular', 'Boxy'] },
        { label: 'Weight', values: ['150 gsm', '180 gsm', '150 gsm'] },
        { label: 'Pre-washed', values: ['yes', 'yes', 'no'] },
        { label: 'Best for', values: ['Hot days', 'Every day', 'Layering'] },
      ],
    },
  },

  validate(data) {
    const errors = [];
    const withCta = data.products.filter((p) => p.cta).length;
    if (withCta && withCta !== data.products.length) errors.push('give every product a cta button, or none of them');
    if (data.products.filter((p) => p.highlight).length > 1) errors.push('only one product can be highlighted');
    data.rows.forEach((r, i) => {
      if (r.values.length !== data.products.length) errors.push(`rows[${i}] "${r.label}" has ${r.values.length} value(s) but there are ${data.products.length} products`);
    });
    return errors;
  },

  compat: {
    outlook: 'Tables, images and borders honored.',
    gmail: 'Fine. Columns shrink on phones.',
    darkMode: 'Cells on the surface or background swap via dm-* classes. Images are not recolored.',
  },
};
