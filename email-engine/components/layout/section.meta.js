const { sectionSettings, SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Section',
  description: 'A full-width section that holds any content components in a single column. The general-purpose building block.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: sectionSettings({
    width: { type: 'enum', values: ['constrained', 'full'], default: 'constrained' },
    columnPadding: { type: 'spacing', default: '0' },
    border: { type: 'text', attr: true, default: 'none' },
    radius: { type: 'length', default: '0' },
    shadow: { type: 'enum', values: ['none', 'small', 'medium', 'large'], default: 'none' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Constrained to the email width, on the surface color.' },
    'full-width': { description: 'Background color runs edge to edge on wide screens.', settings: { width: 'full', background: '@colors.background' } },
    tinted: { description: 'Sits on the page background color for a subtle band.', settings: { background: '@colors.background' } },
    card: {
      description: 'Bordered, rounded card look taken from the theme.',
      settings: {
        background: '@theme.card.background',
        border: '@theme.card.borderWidth solid @theme.card.border',
        radius: '@theme.card.radius',
        shadow: '@theme.card.shadow',
        padding: '@theme.card.padding',
      },
    },
  },

  previewData: {
    data: {
      content: [
        P.heading('Free returns, always', 'h2'),
        P.text('Not the right fit? Send it back within 60 days and we will refund you in full, no questions asked.'),
        P.button('Read our returns policy', 'https://example.com/pages/returns'),
      ],
    },
  },

  compat: {
    outlook: 'Background and padding honored. Border radius and shadows are ignored.',
    gmail: 'Fine.',
    darkMode: 'Swaps to the dark surface when on the brand surface or background color.',
  },
};
