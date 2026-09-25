const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Wrapper',
  description: 'Groups several sections inside one background, border or frame.',
  level: 'section',

  fields: {
    content: { type: 'slot', accepts: 'section', required: true },
  },

  settings: {
    background: { type: 'color', default: '@colors.background' },
    padding: { type: 'spacing', default: '@spacing.md' },
    width: { type: 'enum', values: ['constrained', 'full'], default: 'constrained' },
    border: { type: 'text', attr: true, default: 'none' },
    radius: { type: 'length', default: '0' },
    shadow: { type: 'enum', values: ['none', 'small', 'medium', 'large'], default: 'none' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Framed on the page background color.' },
    card: {
      description: 'Bordered, rounded frame from the theme card style.',
      settings: {
        background: '@theme.card.background',
        border: '@theme.card.borderWidth solid @theme.card.border',
        radius: '@theme.card.radius',
        shadow: '@theme.card.shadow',
        padding: '@theme.card.padding',
      },
    },
  },

  previewData: {
    data: {
      content: [
        { component: 'layout/section', data: { content: [P.heading('Your order is on its way', 'h3'), P.text('Estimated delivery: Thursday, 4 June.')] } },
        { component: 'layout/section', data: { content: [P.button('Track your package', 'https://example.com/orders/1042')] } },
      ],
    },
  },

  compat: {
    outlook: 'Background and padding honored. Border radius and shadows are ignored.',
    gmail: 'Fine.',
    darkMode: 'Swaps only when on the brand surface or background color.',
  },
};
