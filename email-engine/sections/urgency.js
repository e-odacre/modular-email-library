const { node } = require('../scripts/lib/recipes');

// Time running out: an urgency banner, a countdown or a last-chance block. Only use it for real deadlines.
module.exports = {
  name: 'Urgency',
  description: 'Urgency headline, deadline, optional countdown and a button. Banner, countdown or last-chance style.',

  fields: {
    style: { type: 'enum', values: ['banner', 'countdown', 'last-chance'], default: 'banner' },
    headline: { type: 'text', required: true },
    text: 'text',
    deadline: 'text',
    timerImage: 'url',
    cta: 'cta',
  },

  previewData: {
    headline: 'Your 25% off is about to expire',
    text: 'The summer edit goes back to full price tomorrow.',
    deadline: 'Ends tonight at midnight',
    cta: { label: 'Use my discount', href: 'https://example.com/collections/summer' },
  },

  build(d) {
    if (d.style === 'countdown') {
      return [node('promotional/countdown', { headline: d.headline, endsAt: d.deadline || 'soon', timerImage: d.timerImage, cta: d.cta })];
    }
    if (d.style === 'last-chance') {
      return [node('promotional/last-chance', { headline: d.headline, text: d.text, deadline: d.deadline, cta: d.cta })];
    }
    return [node('promotional/urgency-banner', { deadline: d.deadline || 'Ends soon', headline: d.headline, text: d.text, cta: d.cta })];
  },
};
