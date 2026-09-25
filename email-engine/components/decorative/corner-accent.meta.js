const { sectionSettings, SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Corner Accent',
  description: 'A section framed by an accent-colored corner on its top and left (or right) edges.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'content', required: true },
  },

  settings: sectionSettings({
    corner: { type: 'enum', values: ['left', 'right'], default: 'left' },
    color: { type: 'color', default: '@theme.accent.color' },
    thickness: { type: 'length', default: '@theme.accent.lineWidth' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Accent on the top and left edges.' },
    right: { description: 'Accent on the top and right edges.', settings: { corner: 'right' } },
    heavy: { description: 'A thicker accent (6px).', settings: { thickness: '6px' } },
  },

  previewData: {
    data: {
      content: [
        P.node('content/heading', { text: 'Repair for life' }, { level: 'h3' }),
        P.text('Wear a hole in it? Send it back and we will mend it for free, for as long as you own it.'),
      ],
    },
  },

  compat: {
    outlook: 'Section borders honored.',
    gmail: 'Fine.',
    darkMode: 'Background swaps on the brand surface, the accent border stays.',
  },
};
