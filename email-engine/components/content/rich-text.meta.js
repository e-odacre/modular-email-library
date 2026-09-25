module.exports = {
  name: 'Rich Text',
  description: 'Body copy with inline HTML: bold, italics, links, line breaks and short lists.',
  level: 'content',

  fields: {
    html: { type: 'richtext', required: true },
  },

  settings: {
    level: { type: 'enum', values: ['body', 'bodyLarge', 'bodySmall', 'caption'], default: 'body' },
    align: { type: 'alignment', default: 'left' },
    color: { type: 'text', attr: true, default: 'auto' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
    darkMode: { type: 'boolean', default: true },
  },

  responsive: { mobileAlignment: ['inherit', 'left', 'center', 'right'], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Standard body copy with formatting.' },
    large: { description: 'Larger lead copy.', settings: { level: 'bodyLarge' } },
    small: { description: 'Smaller supporting copy.', settings: { level: 'bodySmall' } },
  },

  previewData: {
    data: {
      html: '<p>Each piece is <strong>cut and sewn in Portugal</strong> from GOTS-certified cotton. Read about how we work in our <a href="https://example.com/pages/materials">materials guide</a>.</p><p>Free shipping on orders over $75.</p>',
    },
  },

  compat: {
    outlook: 'Paragraph margins can differ slightly. Keep the formatting simple.',
    gmail: 'Fine.',
    darkMode: 'Text and link colors swap via dm-text where honored.',
  },
};
