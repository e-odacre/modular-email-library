const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Container',
  description: 'A narrower, centered content column inside the email width, for text that reads better at a shorter line length.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: {
    maxWidth: { type: 'length', default: '480px' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: '480px reading column.' },
    narrow: { description: '400px column for short, focused messages.', settings: { maxWidth: '400px' } },
    wide: { description: '540px column.', settings: { maxWidth: '540px' } },
  },

  previewData: {
    data: {
      content: [
        P.heading('A note from our founder', 'h2'),
        P.text('We started with one workshop and a simple idea: make the things you use every day last longer. Thank you for being part of the first thousand orders.'),
      ],
    },
  },

  validate: (data, s) => (/px$/.test(s.maxWidth) ? [] : [`setting "maxWidth" must be in px, got ${s.maxWidth}`]),

  compat: {
    outlook: 'Honored, it is section padding.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
