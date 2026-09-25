const { n, urls, assets, entry, section, columns, heading, text, eyebrow, button, link, image, card } = require('./shared');
const articles = [
  { title: 'A closer look at continuous monitoring', excerpt: 'Explore SanEcoTec’s perspective on water data and analytics.', image: assets.monitoring, href: urls.monitoring, category: 'MONITORING' },
  { title: 'Making the case for monitoring', excerpt: 'A starting point for conversations about investment and operations.', image: assets.economics, href: urls.economics, category: 'PERSPECTIVE' },
  { title: 'Putting pH in the picture', excerpt: 'An introduction to a familiar water-quality measurement.', image: assets.ph, href: urls.ph, category: 'WATER BASICS' },
];
module.exports = [
  entry('editorial-lead', 'Featured reading', 'Resources', 'An editorial image, headline, and short reading invitation.', [n('editorial/featured-article', { article: articles[0] }, { variant: 'split' })], [urls.articles, urls.monitoring]),
  entry('editorial-pair', 'Two-story grid', 'Resources', 'A pair of illustrated articles with compact summaries.', [n('editorial/article-grid', { heading: 'Two ideas for your reading list.', articles: articles.slice(1), cta: { label: 'Browse all articles', href: urls.articles } })], [urls.articles]),
  entry('editorial-digest', 'Text-only reading digest', 'Resources', 'Three linked stories without reliance on remote imagery.', [
    section([eyebrow('THE READING LIST'), heading('Save a little time for perspective.')]),
    ...articles.map((article, i) => columns([[eyebrow(`0${i + 1}`)], [heading(article.title, 'navy', 'h3'), text(article.excerpt), link('Read this article', article.href)]], 'navy', '25/75', { padding: '@spacing.md @spacing.xl' })),
  ], [urls.articles]),
  entry('reading-sidebar', 'Article with a reading rail', 'Resources', 'A large editorial lead and a short related-link sidebar.', [columns([
    [eyebrow('START HERE'), heading('Make space for the next question.'), text('A reading list can help your team frame what to ask about its water systems.'), button('Browse field notes', urls.articles)],
    [eyebrow('KEEP READING'), link('Monitoring', urls.monitoring), link('Economics', urls.economics), link('pH', urls.ph)],
  ], 'navy', '70/30')], [urls.articles]),
  entry('training-feature', 'Training invitation', 'Resources', 'A paper feature focused on learning rather than a fictional event date.', [section([
    eyebrow('TEAM LEARNING', 'paper'), heading('Bring a shared understanding to the room.', 'paper'),
    text('Explore SanEcoTec’s water courses, pool-operator training, workshops, and tailored learning options.', 'paper'),
    button('Explore training options', urls.training, 'paper'),
  ], 'paper', { padding: '@spacing.2xl @spacing.xl' })], [urls.training]),
  entry('training-paths', 'Training pathway cards', 'Resources', 'Two ways to begin planning team learning.', [columns([
    card('EXPLORE', 'Find a program', 'Browse the published courses and workshops.', urls.training),
    card('DISCUSS', 'Plan for your team', 'Ask about learning needs specific to your operation.', urls.contact),
  ])], [urls.training]),
];
