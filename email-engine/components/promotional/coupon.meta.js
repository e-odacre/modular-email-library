module.exports = {
  name: 'Coupon',
  description: 'A ticket-style coupon: the value on a colored panel, with the description, code, expiry and a text link beside it.',
  level: 'content',

  fields: {
    value: { type: 'text', required: true },
    description: 'text',
    code: { type: 'text', required: true },
    expires: 'text',
    cta: 'cta',
  },

  settings: {
    valueBackground: { type: 'color', default: '@colors.accent' },
    valueColor: { type: 'color', default: '@colors.white' },
    valueSize: { type: 'length', default: '28px' },
    textColor: { type: 'color', default: '@colors.text' },
    background: { type: 'color', default: '@colors.surface' },
    borderColor: { type: 'color', default: '@colors.accent' },
    radius: { type: 'length', default: '@radius.medium' },
    padding: { type: 'spacing', default: '@spacing.sm 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Accent value panel with a dashed border.' },
    dark: { description: 'Primary-colored value panel.', settings: { valueBackground: '@colors.primary', valueColor: '@colors.primaryText', borderColor: '@colors.primary' } },
  },

  previewData: {
    data: {
      value: '25% OFF',
      description: 'Your first order of $50 or more.',
      code: 'WELCOME25',
      expires: 'Expires 30 June',
      cta: { label: 'Redeem online', href: 'https://example.com/discount/WELCOME25' },
    },
  },

  compat: {
    outlook: 'Cells, colors and text honored. Dashed border can render solid.',
    gmail: 'Fine. Cells stay side by side on narrow phones, keep the value short.',
    darkMode: 'Keeps its own colors.',
  },
};
