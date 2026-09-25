const { bandSettings, bandVariants, SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'RSVP Block',
  description: 'An RSVP prompt: a label, the event name, one line of details, a button and a reply-by date.',
  level: 'section',

  fields: {
    eventTitle: { type: 'text', required: true },
    date: 'text',
    time: 'text',
    location: 'text',
    cta: { type: 'cta', required: true },
    deadline: 'text',
  },

  settings: bandSettings({
    background: { type: 'color', default: '@colors.primary' },
    buttonColor: { type: 'color', default: '@colors.primary' },
    label: { type: 'text', default: 'You are invited' },
  }),

  responsive: SECTION_RESPONSIVE,

  variants: {
    ...bandVariants('White text on the primary color.'),
    accent: { description: 'White text on the accent color.', settings: { background: '@colors.accent', buttonColor: '@colors.accent' } },
  },

  previewData: {
    data: {
      eventTitle: 'Summer Launch Party',
      date: 'Thursday 25 June',
      time: '6:30 pm',
      location: 'The Greenhouse, Portland',
      cta: { label: 'RSVP now', href: 'https://example.com/events/launch/rsvp' },
      deadline: '22 June',
    },
  },

  compat: {
    outlook: 'Tables and text honored. Rounded button corners are square.',
    gmail: 'Fine.',
    darkMode: 'Light variant swaps with the surface. Colored bands keep their colors.',
  },
};
