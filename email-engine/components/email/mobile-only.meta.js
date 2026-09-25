const { P } = require('../_shared');

module.exports = {
  name: 'Mobile-only Content',
  description: 'Sections that only show on phones. Hidden in clients that ignore media queries.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'section', required: true },
  },

  settings: {},

  variants: {
    default: { description: 'Hidden on desktop, shown below 480px.' },
  },

  previewData: {
    data: {
      content: [{ component: 'layout/section', data: { content: [P.node('content/button', { label: 'Tap to shop on the app', href: 'https://example.com/app' })] } }],
    },
  },

  compat: {
    outlook: 'Never shown (Outlook desktop ignores media queries), by design.',
    gmail: 'Shown on phones. Stays hidden in Gmail on non-Google accounts.',
    darkMode: 'Nothing extra, the sections inside carry their own colors.',
  },
};
