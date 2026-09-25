const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional } = require('./_helpers');
const details = require('../sections/event-details');
const features = require('../sections/benefits');

// Announcement, event hero, event details, speaker, benefits, RSVP, FAQ, footer.
module.exports = {
  name: 'Event',
  description: 'Invites people to an event: a hero, the details, the speakers, what they will get, an RSVP prompt and a FAQ.',
  suggestedTheme: 'saas',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: { eyebrow: 'text', headline: { type: 'text', required: true }, description: 'text', cta: 'cta', image: 'image' } },
    event: details.fields.event,
    speakers: details.fields.speakers,
    benefits: { type: 'object', fields: features.fields },
    rsvp: details.fields.rsvp,
    faq: {
      type: 'object',
      fields: { heading: 'text', intro: 'text', items: { type: 'faqItems', min: 1, max: 10, required: true }, cta: 'cta' },
    },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'You are invited: natural dyeing for beginners, Saturday 20 June.',
    announcement: { text: 'Only 24 places. Reserve yours today.', link: { label: 'RSVP', href: 'https://example.com/events/natural-dyeing' } },
    hero: {
      eyebrow: 'Live workshop',
      headline: 'Natural dyeing for beginners',
      description: 'A relaxed Saturday morning in our Portland studio, learning to dye linen with plants.',
      cta: { label: 'Reserve my place', href: 'https://example.com/events/natural-dyeing' },
      image: P.img(600, 300, 'Workshop', 'A long table of linen swatches soaking in pots of natural dye'),
    },
    event: details.previewData.event,
    speakers: details.previewData.speakers,
    benefits: {
      heading: 'What you will take home',
      items: ['A set of six hand-dyed swatches', 'A printed guide to plant dyes', 'Lunch and a discount on your next order'],
      cta: { label: 'Reserve my place', href: 'https://example.com/events/natural-dyeing' },
    },
    rsvp: details.previewData.rsvp,
    faq: {
      heading: 'Before you come',
      items: [
        { question: 'Do I need any experience?', answer: 'None at all. We start from the basics.' },
        { question: 'What should I wear?', answer: 'Clothes you do not mind getting a little colorful.' },
        { question: 'Can I bring a friend?', answer: 'Yes, just reserve a place for each of you.' },
      ],
    },
  },

  build(d) {
    const speakers = d.speakers || [];
    return frame(d, [
      node('hero/standard', d.hero, { variant: 'dark' }),
      node('events/event-block', d.event),
      speakers.length ? node('layout/grid', { items: speakers.map((speaker) => [node('events/speaker-card', { speaker })]) }, { settings: { columns: Math.min(speakers.length, 3), mobileColumns: 1 } }) : [],
      optional(d.benefits, (x) => node('features/benefits', x)),
      optional(d.rsvp, (x) => node('events/rsvp-block', { eventTitle: d.event.title, date: d.event.date, time: d.event.time, location: d.event.location, ...x })),
      optional(d.faq, (x) => node('faq/faq', x)),
    ]);
  },
};
