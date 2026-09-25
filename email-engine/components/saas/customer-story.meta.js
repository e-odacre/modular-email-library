const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Customer Story',
  description: 'A short customer story: their logo, a quote, one headline result and a link to the full story.',
  level: 'section',

  fields: {
    customer: { type: 'text', required: true },
    logo: 'image',
    quote: { type: 'text', required: true },
    person: 'text',
    role: 'text',
    metric: 'stat',
    cta: 'cta',
  },

  settings: {
    maxWidth: { type: 'length', default: '480px' },
    background: { type: 'color', default: '@colors.surface' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'A 480px column on the surface color.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      customer: 'Northwind Studio',
      logo: { src: 'https://placehold.co/240x80/png?text=Northwind', alt: 'Northwind Studio' },
      quote: 'We moved 40 client projects over in a weekend and cut our status meetings in half.',
      person: 'Dana Whitfield',
      role: 'Head of Operations',
      metric: { value: '50%', label: 'fewer status meetings' },
      cta: { label: 'Read the Northwind story', href: 'https://example.com/customers/northwind' },
    },
  },

  validate: (data) => (data.role && !data.person ? ['role needs a person to go with it'] : []),

  compat: {
    outlook: 'Honored.',
    gmail: 'Fine. The logo alt text names the customer if images are blocked.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
