const { sectionSettings, SECTION_RESPONSIVE, P } = require('../_shared');

const stat = (value, label) => [
  P.node('content/heading', { text: value }, { level: 'h2', align: 'center' }),
  P.node('content/text', { text: label }, { level: 'caption', align: 'center' }),
];

module.exports = {
  name: 'Row',
  description: 'Two to four columns that stay side by side on mobile instead of stacking.',
  level: 'section',

  fields: {
    items: { type: 'list', of: { type: 'slot', accepts: 'content' }, min: 2, max: 4, required: true },
  },

  settings: sectionSettings({
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'top' },
    columnPadding: { type: 'spacing', default: '0 @spacing.xs' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Equal-width columns that never stack.' },
  },

  previewData: { data: { items: [stat('4.9', 'Average rating'), stat('50K+', 'Happy customers'), stat('60 days', 'Free returns')] } },

  compat: {
    outlook: 'Renders as a table row, same as desktop.',
    gmail: 'Fine. Columns get narrow on phones, keep content short.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
