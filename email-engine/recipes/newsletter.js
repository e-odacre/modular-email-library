const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional } = require('./_helpers');
const cta = require('../sections/cta');

const article = (title, excerpt, label, alt, href, extra = {}) => ({ title, excerpt, image: P.img(560, 360, label, alt), href, ...extra });

// Intro, featured article, article grid, quote, secondary content, CTA, footer.
module.exports = {
  name: 'Newsletter',
  description: 'A content newsletter: a personal intro, a featured article, a grid of articles, a pull quote, more posts and a call to action.',
  suggestedTheme: 'editorial',

  fields: {
    ...FRAME_FIELDS,
    intro: { type: 'object', fields: { heading: 'text', byline: 'text', html: { type: 'richtext', required: true }, signoff: 'text' } },
    featured: { type: 'object', required: true, fields: { article: { type: 'article', required: true } } },
    articles: { type: 'object', fields: { heading: 'text', articles: { type: 'articles', min: 1, max: 9, required: true }, cta: 'cta' } },
    quote: { type: 'object', fields: { text: { type: 'text', required: true }, author: 'text', role: 'text' } },
    more: { type: 'list', of: { type: 'object', fields: { article: { type: 'article', required: true } } }, max: 4 },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Linen care, a day in the workshop and five ways to wear a shirt.',
    intro: {
      heading: 'A letter from the workshop',
      byline: 'Maya Chen, June 2026',
      html: '<p>Dear friend, summer has arrived in Portland, and with it a new crop of linen from our mill in Normandy.</p><p>This month we have a care guide, a look inside the workshop and some styling ideas.</p>',
      signoff: 'Warmly, Maya and the team',
    },
    featured: { article: article('The last shirt you will need to buy this summer', 'We spent two years perfecting one linen shirt. Here is what we learned.', 'Feature', 'A linen shirt in sand hanging in a sunlit window', 'https://example.com/journal/the-last-shirt', { author: 'Maya Chen', date: '14 June', category: 'Feature', readTime: '8 min read' }) },
    articles: {
      heading: 'More from the journal',
      articles: [
        article('How to care for linen so it lasts a decade', 'Wash it cool, dry it slow, never iron it flat.', 'Care Guide', 'A linen shirt drying on a line', 'https://example.com/journal/caring-for-linen', { category: 'Care guide', readTime: '4 min read' }),
        article('Inside the workshop where every shirt begins', 'A day with the tailors who cut and sew our linen.', 'Workshop', 'A tailor cutting fabric at a long wooden table', 'https://example.com/journal/the-workshop', { category: 'Behind the scenes', readTime: '6 min read' }),
      ],
      cta: { label: 'Read more from the journal', href: 'https://example.com/journal' },
    },
    quote: { text: 'If it does not last, it does not leave the workshop.', author: 'Maya', role: 'Co-founder' },
    more: [
      { article: article('Why we stopped using polyester thread', 'A small change that makes every repair last longer.', 'Thread', 'Spools of natural cotton thread', 'https://example.com/journal/thread', { category: 'Materials' }) },
      { article: article('Five ways to wear a linen shirt', 'Buttoned, open, tucked, knotted or layered.', 'Styling', 'A woman wearing a linen shirt open over a white tee', 'https://example.com/journal/five-ways', { category: 'Style' }) },
    ],
    cta: { headline: 'Enjoyed this? Share it', text: 'Forward this email to a friend who loves good clothes.', primary: { label: 'Visit the journal', href: 'https://example.com/journal' }, tone: 'light' },
  },

  build(d, { section }) {
    return frame(d, [
      optional(d.intro, (x) => node('editorial/text-heavy', x)),
      node('editorial/featured-article', d.featured),
      optional(d.articles, (x) => node('editorial/article-grid', x)),
      optional(d.quote, (x) => node('layout/section', { content: [node('content/quote', x, { variant: 'centered' })] }, { variant: 'tinted', settings: { padding: '@spacing.xl @theme.section.paddingX' } })),
      ...(d.more || []).map((x) => node('editorial/blog-post-preview', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
