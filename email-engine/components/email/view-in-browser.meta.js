const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'View in Browser',
  description: 'A small "View it in your browser" line using Klaviyo\'s web view link.',
  level: 'section',

  fields: {
    text: { type: 'text', default: 'Having trouble viewing this email?' },
    label: { type: 'text', default: 'View it in your browser' },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    linkColor: { type: 'color', default: '@colors.mutedText' },
    padding: { type: 'spacing', default: '@spacing.sm @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Centered, muted, on the surface color.' },
    page: { description: 'On the page background color, above the email card.', settings: { background: '@colors.background' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Plain text and a link, honored.',
    gmail: 'Fine.',
    darkMode: 'Text and link swap via dm-* classes where honored.',
  },
};
