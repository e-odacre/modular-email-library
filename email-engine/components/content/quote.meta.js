module.exports = {
  name: 'Quote',
  description: 'A pull quote with an optional author and role, with an accent bar, centered or plain layout.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
    author: 'text',
    role: 'text',
  },

  settings: {
    layout: { type: 'enum', values: ['bar', 'centered', 'plain'], default: 'bar' },
    align: { type: 'alignment', default: 'left' },
    barColor: { type: 'color', default: '@theme.accent.color' },
    barWidth: { type: 'length', default: '@theme.accent.lineWidth' },
    padding: { type: 'spacing', default: '@spacing.sm 0 @spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Quote with an accent bar on the left.' },
    centered: { description: 'Centered with a large opening quote mark.', settings: { layout: 'centered', align: 'center' } },
    plain: { description: 'Italic text with quote marks, no decoration.', settings: { layout: 'plain' } },
  },

  previewData: {
    data: {
      text: 'I have washed this shirt forty times and it just keeps getting softer. Easily the best linen I own.',
      author: 'Priya N.',
      role: 'Verified buyer',
    },
  },

  validate: (data) => (data.role && !data.author ? ['role needs an author to go with it'] : []),

  compat: {
    outlook: 'Accent bar is a shaded table cell, honored. Italics honored.',
    gmail: 'Fine.',
    darkMode: 'Quote text and author swap via dm-text and dm-muted where honored.',
  },
};
