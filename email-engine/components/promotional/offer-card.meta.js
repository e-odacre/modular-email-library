const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Offer Card',
  description: 'A bordered card presenting one offer: badge, title, description, discount, code and a button.',
  level: 'section',

  fields: {
    badge: 'text',
    title: { type: 'text', required: true },
    discount: 'text',
    description: 'text',
    code: 'text',
    expires: 'text',
    cta: 'cta',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    textColor: { type: 'text', attr: true, default: '@colors.text' },
    discountColor: { type: 'text', attr: true, default: '@colors.accent' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    padding: { type: 'spacing', default: '@spacing.lg' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Card on the surface color with the theme border.' },
    tinted: { description: 'Card on the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      badge: 'Members only',
      title: 'A thank-you for being a regular',
      discount: '$20 off',
      description: 'On your next order of $100 or more. No need to wait for a sale.',
      code: 'THANKS20',
      expires: 'Valid until 31 July',
      cta: { label: 'Redeem my offer', href: 'https://example.com/discount/THANKS20' },
    },
  },

  validate: (data) => (data.expires && !data.code ? ['expires is shown with the code, pass a code too (or put the date in description)'] : []),

  compat: {
    outlook: 'Background, border and padding honored. Rounded corners are square.',
    gmail: 'Fine.',
    darkMode: 'Card background and text swap via dm-* classes on the brand surface.',
  },
};
