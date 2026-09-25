module.exports = {
  name: 'Arrow',
  description: 'A large arrow glyph pointing right, left, down or up.',
  level: 'content',

  fields: {},

  settings: {
    direction: { type: 'enum', values: ['down', 'right', 'left', 'up'], default: 'down' },
    size: { type: 'length', default: '28px' },
    color: { type: 'color', default: '@colors.accent' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Downward arrow in the accent color.' },
    right: { description: 'Right arrow.', settings: { direction: 'right' } },
    large: { description: 'A bigger arrow.', settings: { size: '44px' } },
  },

  previewData: { data: {} },

  compat: {
    outlook: 'Renders from the system symbol font, appearance varies slightly.',
    gmail: 'Fine.',
    darkMode: 'Accent color stays.',
  },
};
