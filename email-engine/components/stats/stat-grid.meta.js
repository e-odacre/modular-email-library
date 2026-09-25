const { SECTION_RESPONSIVE } = require('../_shared');

const all = [
  { value: '98%', label: 'Customer satisfaction' },
  { value: '50K+', label: 'Customers' },
  { value: '4.9', label: 'Average rating' },
  { value: '60 days', label: 'Free returns' },
];

module.exports = {
  name: 'Stat Grid',
  description: 'Two to four statistics side by side (1 to 4 columns), with an optional heading.',
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    stats: { type: 'stats', min: 1, max: 8, required: true },
  },

  settings: {
    columns: { type: 'enum', values: [3, 1, 2, 4], default: 3 },
    statVariant: { type: 'enum', values: ['default', 'plain', 'compact', 'left'], default: 'default' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: { mobileColumns: [2, 1], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Three stats across.' },
    'two-stat': { description: 'Two stats across.', settings: { columns: 2 } },
    'four-stat': { description: 'Four stats across, compact values.', settings: { columns: 4, statVariant: 'compact' } },
    tinted: { description: 'Three stats on the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: { heading: 'Trusted by thousands', stats: all.slice(0, 3) },
    byVariant: {
      'two-stat': { data: { heading: 'Trusted by thousands', stats: all.slice(0, 2) } },
      'four-stat': { data: { heading: 'Trusted by thousands', stats: all } },
    },
  },

  compat: {
    outlook: 'Each row is a table with exact widths. mobileColumns is ignored.',
    gmail: 'Two per row on phones uses a media query. Non-Google Gmail accounts show the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
