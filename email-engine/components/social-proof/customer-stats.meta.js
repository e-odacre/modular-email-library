const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Customer Stats',
  description: 'Customer numbers in a row with a heading. A social-proof preset of the stat grid.',
  level: 'section',

  fields: {
    heading: { type: 'text', default: 'Loved by customers' },
    stats: { type: 'stats', min: 2, max: 4, required: true },
  },

  settings: {
    gridVariant: { type: 'enum', values: ['default', 'two-stat', 'four-stat', 'tinted'], default: 'default' },
    background: { type: 'color', default: '@colors.background' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Three customer numbers on the page background color.' },
    'two-stat': { description: 'Two customer numbers.', settings: { gridVariant: 'two-stat' } },
    'four-stat': { description: 'Four customer numbers.', settings: { gridVariant: 'four-stat' } },
    light: { description: 'On the surface color.', settings: { background: '@colors.surface' } },
  },

  previewData: {
    data: {
      heading: 'Loved by customers',
      stats: [
        { value: '10,000+', label: 'Customers' },
        { value: '4.9', label: 'Average rating' },
        { value: '92%', label: 'Order again' },
      ],
    },
    byVariant: {
      'two-stat': { data: { stats: [{ value: '10,000+', label: 'Customers' }, { value: '4.9', label: 'Average rating' }] } },
      'four-stat': { data: { stats: [{ value: '10,000+', label: 'Customers' }, { value: '4.9', label: 'Average rating' }, { value: '92%', label: 'Order again' }, { value: '60 days', label: 'Free returns' }] } },
    },
  },

  validate(data, s) {
    const want = { default: 3, 'two-stat': 2, 'four-stat': 4 }[s.gridVariant];
    return want && data.stats.length > want ? [`${s.gridVariant} shows ${want} stats, but ${data.stats.length} were given`] : [];
  },

  compat: {
    outlook: 'Each row is a table with exact widths.',
    gmail: 'Two per row on phones uses a media query. Non-Google Gmail accounts show the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
