const { SECTION_RESPONSIVE, P } = require('../_shared');

const articles = [
  { title: 'How to care for linen so it lasts a decade', excerpt: 'Wash it cool, dry it slow, never iron it flat.', image: P.img(560, 360, 'Care Guide', 'A linen shirt drying on a line'), href: 'https://example.com/journal/caring-for-linen', author: 'Maya Chen', date: '12 June', category: 'Care guide', readTime: '4 min read' },
  { title: 'Inside the workshop where every shirt begins', excerpt: 'A day with the tailors who cut and sew our linen.', image: P.img(560, 360, 'Workshop', 'A tailor cutting fabric at a long wooden table'), href: 'https://example.com/journal/the-workshop', author: 'Sam Okafor', date: '5 June', category: 'Behind the scenes', readTime: '6 min read' },
  { title: 'Five ways to wear a linen shirt this summer', excerpt: 'Buttoned, open, tucked, knotted or layered.', image: P.img(560, 360, 'Styling', 'A woman wearing a linen shirt open over a white tee'), href: 'https://example.com/journal/five-ways', author: 'Maya Chen', date: '29 May', category: 'Style', readTime: '3 min read' },
];

module.exports = {
  name: 'Article Grid',
  description: 'Articles in a grid of 1 to 3 columns with an optional heading and a more-articles button.',
  level: 'section',

  fields: {
    heading: 'text',
    articles: { type: 'articles', min: 1, max: 9, required: true },
    cta: 'cta',
  },

  settings: {
    columns: { type: 'enum', values: [2, 1, 3], default: 2 },
    cardVariant: { type: 'enum', values: ['default', 'minimal', 'headline', 'centered'], default: 'default' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: { mobileColumns: [1, 2], hideOnMobile: true, hideOnDesktop: true },

  variants: {
    default: { description: 'Two articles across.' },
    'one-column': { description: 'One article per row.', settings: { columns: 1 } },
    'three-column': { description: 'Three compact articles across.', settings: { columns: 3, cardVariant: 'minimal' } },
    headlines: { description: 'Two across with headlines only.', settings: { cardVariant: 'headline' } },
  },

  previewData: {
    data: { heading: 'From the journal', articles: articles.slice(0, 2), cta: { label: 'Read more from the journal', href: 'https://example.com/journal' } },
    byVariant: { 'three-column': { data: { heading: 'From the journal', articles } }, 'one-column': { data: { heading: 'From the journal', articles: articles.slice(0, 2) } } },
  },

  compat: {
    outlook: 'Each row is a table with exact widths. mobileColumns is ignored.',
    gmail: 'Stacking works. Non-Google Gmail accounts show the desktop layout on phones.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
