const { sectionSettings, SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Asymmetric',
  description: 'An editorial two-column layout: a large main column and a smaller, offset side column.',
  level: 'section',

  fields: {
    main: { type: 'slot', accepts: 'content', required: true },
    aside: { type: 'slot', accepts: 'content', required: true },
  },

  settings: sectionSettings({
    split: { type: 'text', attr: true, default: '65/35' },
    asidePosition: { type: 'enum', values: ['right', 'left'], default: 'right' },
    offset: { type: 'length', default: '@spacing.2xl' },
    columnPadding: { type: 'spacing', default: '0 @spacing.sm' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Large main column on the left, smaller offset column on the right.' },
    'aside-left': { description: 'Smaller offset column on the left, large main column on the right.', settings: { asidePosition: 'left' } },
  },

  previewData: {
    data: {
      main: [P.image(380, 460, 'Lookbook', 'A model wearing a linen shirt on a terrace at golden hour')],
      aside: [
        P.node('content/heading', { text: 'The Terrace Edit' }, { level: 'h3' }),
        P.text('Loose linens and soft neutrals, styled for long lunches in the sun.'),
        P.button('Shop the edit', 'https://example.com/collections/terrace'),
      ],
    },
  },

  validate: (data, s) => (/^\d+(\.\d+)?\/\d+(\.\d+)?$/.test(s.split) ? [] : [`setting "split" must be two numbers like 65/35, got "${s.split}"`]),

  compat: {
    outlook: 'Renders as a table row. The offset is a spacer, so it works.',
    gmail: 'Stacking works. Gmail on non-Google accounts shows the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
