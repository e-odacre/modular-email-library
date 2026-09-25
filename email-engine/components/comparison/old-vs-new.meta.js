const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Old vs New',
  description: 'Two columns of points: the old way with dashes and the new way with check marks.',
  level: 'section',

  fields: {
    heading: 'text',
    oldTitle: { type: 'text', default: 'Before' },
    newTitle: { type: 'text', default: 'Now' },
    old: { type: 'listItems', min: 1, max: 6, required: true },
    new: { type: 'listItems', min: 1, max: 6, required: true },
  },

  settings: {
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Old way on the left, new way on the right.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: 'What is different in the new app',
      oldTitle: 'The old app',
      newTitle: 'The new app',
      old: ['Sync every 15 minutes', 'One project at a time', 'Email-only notifications'],
      new: ['Instant sync across devices', 'Switch projects in one tap', 'Push, email and Slack notifications'],
    },
  },

  compat: {
    outlook: 'Two columns as a table row, marks are text glyphs.',
    gmail: 'Stacking works. Non-Google Gmail accounts show the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
