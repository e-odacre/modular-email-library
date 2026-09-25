const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'FAQ',
  description: 'Questions and answers, all visible, with a heading and an optional more-questions link. No JavaScript.',
  level: 'section',

  fields: {
    heading: { type: 'text', default: 'Frequently asked questions' },
    intro: 'text',
    items: { type: 'faqItems', min: 1, max: 10, required: true },
    cta: 'cta',
  },

  settings: {
    frame: { type: 'enum', values: ['plain', 'rules', 'card'], default: 'plain' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Questions and answers stacked with space between them.' },
    rules: { description: 'A hairline between each question.', settings: { frame: 'rules' } },
    cards: { description: 'Each question in its own bordered card.', settings: { frame: 'card' } },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      heading: 'Questions before you buy',
      items: [
        { question: 'How long does delivery take?', answer: 'Orders ship within two working days and arrive in <strong>2 to 4 days</strong> in the US.' },
        { question: 'Can I return something I have worn?', answer: 'Yes. You have 60 days to return anything, worn or not, for a full refund.' },
        { question: 'How do I care for linen?', answer: 'Wash it cool with like colors, dry it slowly and never iron it flat. Our <a href="https://example.com/journal/caring-for-linen">care guide</a> has the details.' },
      ],
      cta: { label: 'See all questions', href: 'https://example.com/pages/faq' },
    },
  },

  compat: {
    outlook: 'Honored, it is headings and text.',
    gmail: 'Fine.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
