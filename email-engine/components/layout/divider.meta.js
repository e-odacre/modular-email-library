module.exports = {
  name: 'Divider',
  description: 'A horizontal rule between content components, styled by the theme.',
  level: 'content',

  fields: {},

  settings: {
    thickness: { type: 'length', default: '@theme.divider.width' },
    style: { type: 'enum', values: ['solid', 'dashed', 'dotted'], default: '@theme.divider.style' },
    color: { type: 'color', default: '@theme.divider.color' },
    width: { type: 'length', default: '100%' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Full-width hairline in the theme divider style.' },
    short: { description: 'A short centered rule.', settings: { width: '48px', thickness: '2px' } },
    dashed: { description: 'A dashed line.', settings: { style: 'dashed' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Solid lines are honored. Dashed and dotted can render as solid.',
    gmail: 'Fine.',
    darkMode: 'Border color swaps via dm-border when it uses the brand border color.',
  },
};
