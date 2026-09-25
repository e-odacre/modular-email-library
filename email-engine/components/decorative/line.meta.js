module.exports = {
  name: 'Decorative Line',
  description: 'A decorative rule for emphasis: accent bar, double line, dotted line or dot ornament.',
  level: 'content',

  fields: {},

  settings: {
    style: { type: 'enum', values: ['solid', 'double', 'dotted', 'dashed', 'ornament'], default: 'solid' },
    color: { type: 'color', default: '@theme.accent.color' },
    thickness: { type: 'length', default: '@theme.accent.lineWidth' },
    length: { type: 'length', default: '@theme.accent.lineLength' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Short accent bar (the accent line).' },
    wide: { description: 'A full-width accent line.', settings: { length: '100%', thickness: '1px' } },
    double: { description: 'Double rule.', settings: { style: 'double', thickness: '4px', length: '64px' } },
    dotted: { description: 'Dotted rule.', settings: { style: 'dotted', length: '96px' } },
    ornament: { description: 'Three dots as a section ornament.', settings: { style: 'ornament', color: '@colors.mutedText' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Solid bars honored. Dotted and double can render as solid.',
    gmail: 'Fine.',
    darkMode: 'Accent color stays. Ornament uses the muted color.',
  },
};
