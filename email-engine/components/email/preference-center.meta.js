module.exports = {
  name: 'Preference Center',
  description: 'A "Manage your preferences" link using Klaviyo\'s manage_preferences_link tag.',
  level: 'content',

  fields: {
    label: { type: 'text', default: 'Manage your preferences' },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    color: { type: 'color', default: '@colors.mutedText' },
    padding: { type: 'spacing', default: '0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Muted underlined link.' },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Plain text link, honored.',
    gmail: 'Fine.',
    darkMode: 'Link color swaps via dm-muted where honored.',
  },
};
