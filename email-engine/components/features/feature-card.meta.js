const { P } = require('../_shared');

module.exports = {
  name: 'Feature Card',
  description: 'One feature: an icon or step number, a title, a short description and an optional link.',
  level: 'content',

  fields: {
    feature: { type: 'feature', required: true },
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    iconSize: { type: 'length', default: '48px' },
    iconRadius: { type: 'length', default: '0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered icon, title and description.' },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
    'round-icon': { description: 'Circular icon crop (square in Outlook desktop).', settings: { iconRadius: '50%' } },
  },

  previewData: {
    data: {
      feature: {
        icon: { src: P.img(96, 96, 'Ship', 'x').src, alt: 'Free shipping', decorative: true },
        title: 'Free shipping over $75',
        description: 'Delivered in 2 to 4 working days, tracked from door to door.',
        cta: { label: 'See delivery options', href: 'https://example.com/pages/shipping' },
      },
    },
  },

  compat: {
    outlook: 'Text and images honored. Circular crops render square.',
    gmail: 'Fine. The title carries the meaning if images are blocked.',
    darkMode: 'Text swaps via dm-text where honored. Icons are not recolored.',
  },
};
