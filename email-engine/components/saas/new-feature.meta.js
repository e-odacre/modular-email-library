const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'New Feature',
  description: 'A single feature spotlight in a card: optional image, badge, title, description and a link.',
  level: 'section',

  fields: {
    badge: { type: 'text', default: 'New' },
    title: { type: 'text', required: true },
    description: 'text',
    image: 'image',
    cta: 'cta',
  },

  settings: {
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@spacing.lg' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'A bordered card on the surface color.' },
    tinted: { description: 'A card on the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      badge: 'New',
      title: 'Dark mode for the whole app',
      description: 'Switch it on in Settings, or let it follow your device.',
      image: P.img(520, 260, 'Dark mode', 'The app dashboard shown in dark mode'),
      cta: { label: 'See how to switch', href: 'https://example.com/help/dark-mode' },
    },
  },

  compat: {
    outlook: 'Card background, border and padding honored. Rounded corners are square.',
    gmail: 'Fine.',
    darkMode: 'Card background and text swap via dm-* classes on the brand surface.',
  },
};
