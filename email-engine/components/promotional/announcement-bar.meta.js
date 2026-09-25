const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Announcement Bar',
  description: 'A thin band at the very top of the email with one line of news and an optional link.',
  level: 'section',

  fields: {
    text: { type: 'text', required: true },
    link: 'link',
  },

  settings: {
    background: { type: 'color', default: '@colors.primary' },
    textColor: { type: 'text', attr: true, default: '@colors.primaryText' },
    linkColor: { type: 'color', default: '@colors.primaryText' },
    padding: { type: 'spacing', default: '@spacing.sm @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Light text on the primary color.' },
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', textColor: '@colors.white', linkColor: '@colors.white' } },
    light: { description: 'Text on the page background color.', settings: { background: '@colors.background', textColor: '@colors.text', linkColor: '@colors.link' } },
  },

  previewData: {
    data: {
      text: 'Free shipping on orders over $75.',
      link: { label: 'Shop now', href: 'https://example.com/collections/all' },
    },
  },

  compat: {
    outlook: 'Solid band with centered text, honored.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bars keep their colors.',
  },
};
