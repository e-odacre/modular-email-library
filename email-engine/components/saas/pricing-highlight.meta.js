const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Pricing Highlight',
  description: 'One plan in a card: name, price, what is included and a button. A featured variant fills the card with the primary color.',
  level: 'section',

  fields: {
    badge: 'text',
    plan: { type: 'text', required: true },
    price: { type: 'text', required: true },
    period: { type: 'text', default: 'per month, billed annually' },
    description: 'text',
    features: { type: 'listItems', max: 8 },
    cta: { type: 'cta', required: true },
  },

  settings: {
    frame: { type: 'enum', values: ['card', 'default'], default: 'card' },
    background: { type: 'color', default: '@colors.surface' },
    textColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    markerColor: { type: 'color', default: '@colors.accent' },
    buttonBackground: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primaryText' },
    padding: { type: 'spacing', default: '@spacing.xl' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'A bordered card on the surface color.' },
    featured: {
      description: 'A filled card in the primary color, for the plan you recommend.',
      settings: { frame: 'default', background: '@colors.primary', markerColor: '@colors.primaryText', buttonBackground: '@colors.primaryText', buttonColor: '@colors.primary' },
    },
  },

  previewData: {
    data: {
      badge: 'Most popular',
      plan: 'Team',
      price: '$29',
      period: 'per user per month, billed annually',
      description: 'Everything you need to run projects together.',
      features: ['Unlimited projects and members', 'Shared workspaces', 'Priority support'],
      cta: { label: 'Start your free trial', href: 'https://example.com/signup?plan=team' },
    },
  },

  compat: {
    outlook: 'Card background, border and padding honored. Rounded corners are square.',
    gmail: 'Fine.',
    darkMode: 'Default card swaps via dm-* classes on the brand surface. The featured card keeps its colors.',
  },
};
