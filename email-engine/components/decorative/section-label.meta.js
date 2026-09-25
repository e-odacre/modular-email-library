module.exports = {
  name: 'Section Label',
  description: 'A centered label flanked by a thin line on each side, to introduce a section.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    color: { type: 'color', default: '@colors.border' },
    textColor: { type: 'color', default: '@colors.mutedText' },
    thickness: { type: 'length', default: '1px' },
    gap: { type: 'length', default: '@spacing.md' },
    padding: { type: 'spacing', default: '@spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Muted label with hairlines.' },
    accent: { description: 'Accent-colored label and lines.', settings: { color: '@colors.accent', textColor: '@colors.accent' } },
  },

  previewData: { data: { text: 'New arrivals' } },

  compat: {
    outlook: 'Table cells and colors honored.',
    gmail: 'Fine.',
    darkMode: 'Lines and label swap via dm-* classes where honored.',
  },
};
