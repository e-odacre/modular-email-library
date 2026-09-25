const { node, when } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');

// The event, its speakers and an RSVP prompt.
module.exports = {
  name: 'Event Details',
  description: 'The event details block, a row of speaker cards and an RSVP prompt.',

  fields: {
    event: {
      type: 'object',
      required: true,
      fields: { eyebrow: 'text', title: { type: 'text', required: true }, date: { type: 'text', required: true }, time: 'text', location: 'text', description: 'text', speaker: 'text', cta: 'cta' },
    },
    speakers: {
      type: 'list',
      max: 3,
      of: { type: 'object', fields: { photo: 'image', name: { type: 'text', required: true }, title: 'text', bio: 'text', href: 'url' } },
    },
    rsvp: { type: 'object', fields: { cta: { type: 'cta', required: true }, deadline: 'text', label: 'text' } },
  },

  previewData: {
    event: {
      eyebrow: 'Live workshop',
      title: 'Natural dyeing for beginners',
      date: 'Saturday 20 June 2026',
      time: '11:00 am to 1:00 pm PT',
      location: 'Our Portland studio, 214 Alder Street',
      description: 'Learn to dye linen with plants you can grow at home. All materials are included.',
    },
    speakers: [
      { photo: P.img(200, 200, 'Elena', 'Portrait of Elena Ruiz'), name: 'Elena Ruiz', title: 'Textile artist', bio: 'Twelve years teaching plant dyeing.' },
      { photo: P.img(200, 200, 'Sam', 'Portrait of Sam Okafor'), name: 'Sam Okafor', title: 'Head tailor', bio: 'Cuts every shirt we make.' },
    ],
    rsvp: { cta: { label: 'Reserve my place', href: 'https://example.com/events/natural-dyeing' }, deadline: '18 June' },
  },

  build(d) {
    const speakers = d.speakers || [];
    return [
      node('events/event-block', d.event),
      ...when(
        speakers.length,
        node('layout/grid', { items: speakers.map((speaker) => [node('events/speaker-card', { speaker })]) }, { settings: { columns: Math.min(speakers.length, 3), mobileColumns: 1 } }),
      ),
      ...when(d.rsvp, node('events/rsvp-block', { eventTitle: d.event.title, date: d.event.date, time: d.event.time, location: d.event.location, ...(d.rsvp || {}) })),
    ];
  },
};
