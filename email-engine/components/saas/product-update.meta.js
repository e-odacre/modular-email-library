const { sectionSettings, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Product Update',
  description: 'Release notes: a heading with version and date, then updates each tagged New, Improved, Fixed or Deprecated.',
  level: 'section',

  fields: {
    heading: { type: 'text', default: "What's new" },
    version: 'text',
    date: 'text',
    updates: {
      type: 'list',
      min: 1,
      max: 8,
      required: true,
      of: {
        type: 'object',
        fields: {
          type: { type: 'enum', values: ['new', 'improved', 'fixed', 'deprecated'], required: true },
          title: { type: 'text', required: true },
          description: 'text',
        },
      },
    },
    cta: 'cta',
  },

  settings: sectionSettings(),

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Update list on the surface color.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: "What's new",
      version: 'Version 4.2',
      date: '12 June 2026',
      updates: [
        { type: 'new', title: 'Recurring tasks', description: 'Repeat any task daily, weekly or on your own schedule.' },
        { type: 'improved', title: 'Faster search', description: 'Results now appear as you type, up to 3 times faster.' },
        { type: 'fixed', title: 'Calendar sync', description: 'Events no longer duplicate when you edit them on mobile.' },
        { type: 'deprecated', title: 'Legacy export', description: 'CSV export v1 is retired on 1 September. Use v2.' },
      ],
      cta: { label: 'See the full release notes', href: 'https://example.com/changelog' },
    },
  },

  compat: {
    outlook: 'Honored, text and small badge tables.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
