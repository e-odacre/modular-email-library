module.exports = {
  name: 'Full-bleed Hero',
  description: 'Large background image with a centered heading, subheading and button on top.',
  level: 'section',

  fields: {
    heading: { type: 'text', required: true },
    subheading: 'text',
    cta: 'cta',
    image: 'url',
  },

  settings: {
    height: { type: 'length', default: '320px' },
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.primary' },
    color: { type: 'color', default: '@colors.primaryText' },
    buttonBackground: { type: 'color', default: '@colors.primaryText' },
    buttonColor: { type: 'color', default: '@colors.primary' },
    headingLevel: { type: 'enum', values: ['display', 'h1', 'h2'], default: 'h1' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered text over the image.' },
    compact: { description: 'Shorter hero for secondary announcements.', settings: { height: '220px' } },
  },

  previewData: {
    data: {
      heading: 'Summer Collection',
      subheading: 'Made for slower mornings and warmer days.',
      cta: { label: 'Shop the collection', href: 'https://example.com/collections/summer' },
      image: 'https://placehold.co/1200x640/png?text=HERO',
    },
  },

  compat: {
    outlook: 'Background image uses a VML fallback.',
    gmail: 'Background images can be cropped or blocked, keep the message in text.',
    darkMode: 'Keeps its own colors on purpose.',
  },
};
