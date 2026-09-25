const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Discount Banner',
  description: 'A full-width band with the discount in large type, a headline, an optional code and a button.',
  level: 'section',

  fields: {
    discount: { type: 'text', required: true },
    headline: 'text',
    text: 'text',
    code: 'text',
    expires: 'text',
    cta: 'cta',
  },

  settings: bandSettings(),

  responsive: SECTION_RESPONSIVE,

  variants: bandVariants('White text on the accent color.'),

  previewData: {
    data: {
      discount: '25% off',
      headline: 'Everything in the summer edit',
      text: 'Linen, cotton and canvas, all reduced until Sunday.',
      code: 'SUMMER25',
      expires: 'Ends Sunday at midnight',
      cta: { label: 'Shop the sale', href: 'https://example.com/collections/sale' },
    },
  },

  validate: (data) => (data.expires && !data.code ? ['expires is shown with the code, pass a code too (or put the date in text)'] : []),

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
