const { P } = require('../_shared');

const item = (label, text) => [P.image(280, 200, label, `${label} product photo`), P.heading(label, 'h4'), P.text(text)];
const items = [
  item('Linen shirt', 'Relaxed fit, sand.'),
  item('Canvas tote', 'Everyday carry, navy.'),
  item('Wool socks', 'Merino blend, 3 pack.'),
  item('Cotton tee', 'Heavyweight, white.'),
  item('Denim shorts', 'Light wash, 7 inch.'),
  item('Sun hat', 'Wide brim, natural.'),
];

module.exports = {
  name: 'Grid',
  description: 'Items laid out in rows of 1 to 6 columns. The base for product, feature, article and stat grids.',
  level: 'section',

  fields: {
    items: { type: 'list', of: { type: 'slot', accepts: 'content' }, min: 1, max: 24, required: true },
  },

  settings: {
    columns: { type: 'enum', values: [2, 1, 3, 4, 5, 6], default: 2 },
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'top' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
    columnPadding: { type: 'spacing', default: '@spacing.sm' },
  },

  responsive: { mobileColumns: [1, 2], mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Two columns.' },
    'one-column': { description: 'A single column list.', settings: { columns: 1 } },
    'three-column': { description: 'Three columns.', settings: { columns: 3 } },
    'four-column': { description: 'Four columns.', settings: { columns: 4 } },
  },

  previewData: {
    data: { items: items.slice(0, 4) },
    byVariant: { 'three-column': { data: { items } }, 'four-column': { data: { items: items.slice(0, 5) } } },
  },

  compat: {
    outlook: 'Each row is a table with exact widths. mobileColumns is ignored.',
    gmail: 'Stacking works. Gmail on non-Google accounts drops media queries and shows the desktop layout.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
