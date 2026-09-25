const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Countdown',
  description: 'A countdown block: a timer image from an external service, with the end time as text. A static approximation, not a live timer.',
  level: 'section',

  fields: {
    headline: 'text',
    endsAt: { type: 'text', attr: true, required: true },
    timerImage: 'url',
    cta: 'cta',
  },

  settings: bandSettings({
    background: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primary' },
    label: { type: 'text', default: 'Offer ends' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    ...bandVariants('White text on the primary color.'),
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
  },

  previewData: {
    data: {
      headline: 'The sale ends soon',
      endsAt: 'Sunday 30 June at midnight PT',
      cta: { label: 'Shop before it ends', href: 'https://example.com/collections/sale' },
    },
    byVariant: {
      accent: {
        data: {
          headline: 'The sale ends soon',
          endsAt: 'Sunday 30 June at midnight PT',
          timerImage: 'https://placehold.co/480x100/png?text=02+%3A+14+%3A+37',
          cta: { label: 'Shop before it ends', href: 'https://example.com/collections/sale' },
        },
      },
    },
  },

  compat: {
    outlook: 'A normal image. Animated timers show only the first frame.',
    gmail: 'Images go through a proxy that can cache them, so a timer can show a stale time.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
