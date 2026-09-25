module.exports = {
  name: 'Sale Badge',
  description: 'A big round or square SALE or percentage badge to sit beside or above an offer.',
  level: 'content',

  fields: {
    text: { type: 'text', required: true },
    sub: 'text',
  },

  settings: {
    size: { type: 'length', default: '96px' },
    textSize: { type: 'length', default: '24px' },
    radius: { type: 'length', default: '50%' },
    background: { type: 'color', default: '@colors.error' },
    color: { type: 'color', default: '@colors.white' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Red circle (square in Outlook desktop).' },
    accent: { description: 'Accent-colored circle.', settings: { background: '@colors.accent' } },
    square: { description: 'Square badge.', settings: { radius: '@radius.small' } },
    large: { description: 'A larger 128px badge.', settings: { size: '128px', textSize: '32px' } },
  },

  previewData: { data: { text: '-30%', sub: 'this week' } },

  compat: {
    outlook: 'Size, color and text honored, the circle becomes a square.',
    gmail: 'Fine.',
    darkMode: 'Keeps its own colors.',
  },
};
