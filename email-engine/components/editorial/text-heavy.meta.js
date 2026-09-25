const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Text-heavy Section',
  description: 'A long-form text section in a reading-width column: heading, byline and rich body copy.',
  level: 'section',

  fields: {
    heading: 'text',
    byline: 'text',
    html: { type: 'richtext', required: true },
    signoff: 'text',
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    level: { type: 'enum', values: ['bodyLarge', 'body', 'bodySmall'], default: 'bodyLarge' },
    maxWidth: { type: 'length', default: '480px' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Larger body text in a 480px column.' },
    dense: { description: 'Standard body size in a wider 540px column.', settings: { level: 'body', maxWidth: '540px' } },
  },

  previewData: {
    data: {
      heading: 'A letter from the workshop',
      byline: 'Maya Chen, June 2026',
      html: '<p>Dear friend, summer has finally arrived in Portland, and with it a new crop of linen from our mill in Normandy.</p><p>This season we made three changes you will notice: a slightly longer shirt, a softer collar, and buttons cut from recycled shell.</p><p>Thank you for wearing our clothes for years, and for sending them back when they need a repair.</p>',
      signoff: 'Warmly, Maya and the team',
    },
  },

  compat: {
    outlook: 'Honored. Paragraph margins can differ slightly.',
    gmail: 'Fine. Very long emails can be clipped above about 102 KB.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
