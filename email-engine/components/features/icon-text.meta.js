module.exports = {
  name: 'Icon + Text',
  description: 'An icon on the left with a title and short description on the right, on one row.',
  level: 'content',

  fields: {
    icon: { type: 'image', required: true },
    title: { type: 'text', required: true },
    description: 'text',
  },

  settings: {
    iconSize: { type: 'length', default: '40px' },
    iconRadius: { type: 'length', default: '0' },
    gap: { type: 'length', default: '@spacing.md' },
    valign: { type: 'enum', values: ['top', 'middle', 'bottom'], default: 'top' },
    padding: { type: 'spacing', default: '0 0 @spacing.md 0' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: '40px icon beside the text.' },
    large: { description: 'A 56px icon.', settings: { iconSize: '56px' } },
    round: { description: 'Circular icon crop (square in Outlook desktop).', settings: { iconRadius: '50%' } },
    centered: { description: 'Icon vertically centered against the text.', settings: { valign: 'middle' } },
  },

  previewData: {
    data: {
      icon: { src: 'https://placehold.co/80x80/png?text=%E2%9C%93', alt: '', decorative: true },
      title: 'Free returns for 60 days',
      description: 'Changed your mind? Send it back, we cover the postage.',
    },
  },

  compat: {
    outlook: 'Table cells and images honored.',
    gmail: 'Fine. Cells stay side by side on phones, keep text short.',
    darkMode: 'Text swaps via dm-* classes where honored. Icons are not recolored.',
  },
};
