const { P } = require('../_shared');

module.exports = {
  name: 'Desktop-only Content',
  description: 'Sections that are hidden on phones. Shown in clients that ignore media queries.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'section', required: true },
  },

  settings: {},

  variants: {
    default: { description: 'Shown on desktop, hidden below 480px.' },
  },

  previewData: {
    data: {
      content: [{ component: 'layout/section', data: { content: [P.node('content/text', { text: 'Visit any of our 12 stores, open seven days a week.' }, { align: 'center' })] } }],
    },
  },

  compat: {
    outlook: 'Always shown (no media queries).',
    gmail: 'Hidden on phones. Gmail on non-Google accounts shows it on phones too.',
    darkMode: 'Nothing extra, the sections inside carry their own colors.',
  },
};
