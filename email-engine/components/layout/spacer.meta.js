module.exports = {
  name: 'Spacer',
  description: 'Vertical space between content components inside a column.',
  level: 'content',

  fields: {},

  settings: {
    height: { type: 'length', default: '@spacing.lg' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Medium space (24px).' },
    small: { description: 'Small space (8px).', settings: { height: '@spacing.sm' } },
    large: { description: 'Large space (48px).', settings: { height: '@spacing.2xl' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Fixed-height table cell, honored.',
    gmail: 'Fine.',
    darkMode: 'Empty space, nothing to swap.',
  },
};
