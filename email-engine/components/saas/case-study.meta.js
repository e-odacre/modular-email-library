const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Case Study',
  description: 'A case study teaser: the customer, a headline, a summary, up to three results as big numbers, an optional quote and a button.',
  level: 'section',

  fields: {
    customer: { type: 'text', required: true },
    headline: { type: 'text', required: true },
    summary: 'text',
    results: { type: 'stats', min: 1, max: 3, required: true },
    quote: 'text',
    person: 'text',
    role: 'text',
    cta: 'cta',
  },

  settings: {
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX 0 @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Outcome-first case study on the surface color.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      customer: 'Northwind Studio',
      headline: 'How Northwind cut onboarding from 3 weeks to 4 days',
      summary: 'A 60-person agency replaced four tools with one workspace and gave every new client a live project on day one.',
      results: [
        { value: '4 days', label: 'Client onboarding' },
        { value: '50%', label: 'Fewer status meetings' },
        { value: '12 hrs', label: 'Saved per project' },
      ],
      quote: 'It is the first tool the whole team actually uses.',
      person: 'Dana Whitfield',
      role: 'Head of Operations',
      cta: { label: 'Read the case study', href: 'https://example.com/customers/northwind' },
    },
  },

  validate: (data) => (data.role && !data.person ? ['role needs a person to go with it'] : []),

  compat: {
    outlook: 'Each stats row is a table with exact widths.',
    gmail: 'Fine. Stats sit two per row on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
