const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Limited-time Offer',
  description: 'A limited-time offer band: a label, the offer, when it ends and a button.',
  level: 'section',

  fields: {
    label: { type: 'text', default: 'Limited-time offer' },
    headline: { type: 'text', required: true },
    text: 'text',
    endsAt: 'text',
    cta: 'cta',
  },

  settings: {
    bandVariant: { type: 'enum', values: ['default', 'dark', 'urgent', 'light'], default: 'default' },
    align: { type: 'alignment', default: 'center' },
    padding: { type: 'spacing', default: '@spacing.xl @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'On the accent color.' },
    dark: { description: 'On the primary color.', settings: { bandVariant: 'dark' } },
    urgent: { description: 'On the error color.', settings: { bandVariant: 'urgent' } },
    light: { description: 'On the surface color.', settings: { bandVariant: 'light' } },
  },

  previewData: {
    data: {
      label: 'Limited-time offer',
      headline: 'Buy two, get the third free',
      text: 'Mix and match any tees in the collection.',
      endsAt: 'Sunday 30 June at midnight',
      cta: { label: 'Build my bundle', href: 'https://example.com/collections/tees' },
    },
  },

  compat: {
    outlook: 'Tables and text honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
