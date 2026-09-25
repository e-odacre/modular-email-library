module.exports = {
  name: 'Eyebrow',
  description: 'A small uppercase label above a heading.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'left' },
    color: { type: 'text', attr: true, default: 'auto' },
    padding: { type: 'spacing', default: '0 0 @spacing.xs 0' },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Accent-colored eyebrow.' },
    muted: { description: 'Muted gray eyebrow.', settings: { color: '@colors.mutedText' } },
    centered: { description: 'Centered eyebrow.', settings: { align: 'center' } },
  },

  previewData: { data: { text: 'New for summer' } },

  compat: {
    outlook: 'Letter spacing and uppercase honored.',
    gmail: 'Fine.',
    darkMode: 'Keeps the accent color. Use a light color on colored backgrounds.',
  },
};
