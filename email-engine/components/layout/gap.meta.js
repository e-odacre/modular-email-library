const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Gap',
  description: 'Vertical space between sections, on a background color so it blends with the sections around it.',
  level: 'section',

  fields: {},

  settings: {
    height: { type: 'length', default: '@spacing.lg' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Medium gap on the surface color.' },
    small: { description: 'Small gap.', settings: { height: '@spacing.sm' } },
    large: { description: 'Large gap.', settings: { height: '@spacing.2xl' } },
    page: { description: 'A gap on the page background color, separating two cards.', settings: { background: '@colors.background' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'A section with a fixed-height spacer, honored.',
    gmail: 'Fine.',
    darkMode: 'Swaps to the dark surface when on the brand surface or background color.',
  },
};
