const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Plan Comparison',
  description: "Pricing plans side by side: each plan's name and price on top, feature rows, and a button under each plan.",
  level: 'section',

  fields: {
    heading: 'text',
    intro: 'text',
    plans: {
      type: 'list',
      min: 2,
      max: 4,
      required: true,
      of: {
        type: 'object',
        fields: {
          name: { type: 'text', required: true },
          price: { type: 'text', required: true },
          period: 'text',
          highlight: 'boolean',
          cta: 'cta',
        },
      },
    },
    rows: {
      type: 'list',
      min: 1,
      max: 20,
      required: true,
      of: { type: 'object', fields: { label: { type: 'text', required: true }, values: { type: 'list', of: 'text', min: 1, max: 4, required: true } } },
    },
  },

  settings: {
    tableVariant: { type: 'enum', values: ['default', 'zebra', 'tinted'], default: 'default' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Plans with hairline rows.' },
    zebra: { description: 'Alternating row shading.', settings: { tableVariant: 'zebra' } },
  },

  previewData: {
    data: {
      heading: 'Choose your plan',
      plans: [
        { name: 'Starter', price: '$9', period: '/mo', cta: { label: 'Start free', href: 'https://example.com/signup?plan=starter' } },
        { name: 'Team', price: '$29', period: '/mo', highlight: true, cta: { label: 'Try Team', href: 'https://example.com/signup?plan=team' } },
        { name: 'Business', price: '$79', period: '/mo', cta: { label: 'Talk to us', href: 'https://example.com/contact' } },
      ],
      rows: [
        { label: 'Projects', values: ['5', 'Unlimited', 'Unlimited'] },
        { label: 'Team members', values: ['1', '10', 'Unlimited'] },
        { label: 'Shared workspaces', values: ['no', 'yes', 'yes'] },
        { label: 'Priority support', values: ['no', 'partial', 'yes'] },
      ],
    },
  },

  validate(data) {
    const errors = [];
    const withCta = data.plans.filter((p) => p.cta).length;
    if (withCta && withCta !== data.plans.length) errors.push('give every plan a cta button, or none of them');
    if (data.plans.filter((p) => p.highlight).length > 1) errors.push('only one plan can be highlighted');
    data.rows.forEach((r, i) => {
      if (r.values.length !== data.plans.length) errors.push(`rows[${i}] "${r.label}" has ${r.values.length} value(s) but there are ${data.plans.length} plans`);
    });
    return errors;
  },

  compat: {
    outlook: 'Tables, colors and borders honored.',
    gmail: 'Fine. Columns shrink on phones.',
    darkMode: 'Cells on the surface or background swap via dm-* classes. Header cells keep their colors.',
  },
};
