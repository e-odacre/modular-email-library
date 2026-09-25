const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Free Shipping Banner',
  description: 'A free-shipping message, optionally with a progress bar toward the threshold.',
  level: 'section',

  fields: {
    text: { type: 'text', required: true },
    remaining: 'text',
    progress: { type: 'number', min: 0, max: 100 },
  },

  settings: {
    background: { type: 'color', default: '@colors.background' },
    textColor: { type: 'text', attr: true, default: '@colors.white' },
    barColor: { type: 'color', default: '@colors.success' },
    trackColor: { type: 'color', default: '@colors.border' },
    barHeight: { type: 'length', default: '8px' },
    radius: { type: 'length', default: '@radius.pill' },
    gap: { type: 'length', default: '@spacing.sm' },
    padding: { type: 'spacing', default: '@spacing.md @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'On the page background color, with a green progress bar.' },
    accent: { description: 'White text on the accent color, white bar.', settings: { background: '@colors.accent', barColor: '@colors.white', trackColor: '@colors.secondary' } },
    dark: { description: 'White text on the primary color.', settings: { background: '@colors.primary', barColor: '@colors.success', trackColor: '@colors.secondary' } },
  },

  previewData: {
    data: { text: 'You are $12.50 away from free shipping', progress: 83, remaining: 'Spend $75 or more and we will ship it free.' },
    byVariant: { accent: { data: { text: 'Free shipping on orders over $75' } } },
  },

  compat: {
    outlook: 'The bar is a two-cell table, honored. Rounded ends are square.',
    gmail: 'Fine.',
    darkMode: 'On the brand surface the text swaps, on colored bands the colors stay.',
  },
};
