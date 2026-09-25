module.exports = {
  name: 'Rating',
  description: 'A rating summary: stars, the score out of the maximum, and how many reviews it is based on.',
  level: 'content',

  fields: {
    rating: { type: 'number', min: 0, max: 5, required: true },
    outOf: { type: 'number', default: 5, min: 1, max: 5 },
    count: 'text',
    source: 'text',
  },

  settings: {
    align: { type: 'alignment', default: 'center' },
    starSize: { type: 'length', default: '28px' },
    scoreLevel: { type: 'enum', values: ['h1', 'display', 'h2', 'h3'], default: 'h1' },
  },

  responsive: { hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Centered stars, score and review count.' },
    left: { description: 'Left-aligned.', settings: { align: 'left' } },
    compact: { description: 'Smaller stars and score.', settings: { starSize: '20px', scoreLevel: 'h3' } },
  },

  previewData: { data: { rating: 4.9, outOf: 5, count: '2,000+', source: 'Trustpilot' } },

  compat: {
    outlook: 'Star glyphs render from the system symbol font, text honored.',
    gmail: 'Fine.',
    darkMode: 'Text swaps via dm-text where honored.',
  },
};
