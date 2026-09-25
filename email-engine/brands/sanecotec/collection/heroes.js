const { n, urls, assets, entry, section, columns, heading, text, eyebrow, button, link, image, rule } = require('./shared');
module.exports = [
  entry('hero-statement', 'Navy statement', 'Heroes', 'Large live typography and one peach action.', [section([
    eyebrow('WATER / WITH PERSPECTIVE'), heading('See your water systems more clearly.', 'navy', 'display', { tag: 'h1' }),
    text('Make room for a better conversation about monitoring, operations, and the decisions ahead.'), button('Discover Water Health Index', urls.platform),
  ], 'navy', { padding: '@spacing.2xl @spacing.xl' })], [urls.platform]),
  entry('hero-centered', 'Peach announcement', 'Heroes', 'High-contrast centered statement on the brand CTA color.', [section([
    eyebrow('A FRESH PERSPECTIVE', 'peach', 'center'), heading('Better questions.\nClearer next steps.', 'peach', 'display', { tag: 'h1', align: 'center' }),
    text('Bring your water challenges to the SanEcoTec team.', 'peach', { align: 'center' }), button('Start a conversation', urls.contact, 'peach', { align: 'center' }),
  ], 'peach', { padding: '@spacing.2xl @spacing.xl' })], [urls.contact]),
  entry('hero-split', 'Sensor split hero', 'Heroes', 'Technical imagery beside a concise introduction.', [n('hero/split', {
    eyebrow: 'SENSORS & SYSTEMS', headline: 'Bring your water data into focus.', description: 'Explore the sensor options behind a more informed water-management routine.', image: assets.sensors,
    cta: { label: 'Explore sensors', href: urls.sensors },
  }, { variant: 'reverse' })], [urls.sensors]),
  entry('hero-image-first', 'Editorial image opener', 'Heroes', 'A full-width image followed by an understated editorial lead.', [n('hero/standard', {
    eyebrow: 'WATER / FIELD NOTES', headline: 'What can your water data tell you?', description: 'A reading list for teams considering their next step in monitoring.', image: assets.monitoring,
    cta: { label: 'Explore the reading list', href: urls.articles },
  }, { variant: 'image-first', settings: { align: 'left', buttonBackground: '@colors.accent', buttonColor: '@colors.background' } })], [urls.articles]),
  entry('hero-letter', 'Letter-style introduction', 'Heroes', 'An approachable paper opening for a short nurture email.', [section([
    eyebrow('A NOTE FROM SANECoTEC', 'paper'), heading('Let’s start with your facility.', 'paper', 'h1', { tag: 'h1' }),
    text('Every team arrives with a different set of questions. Tell us what you are working through, and explore the resources that fit your situation.', 'paper'),
    link('Tell us about your water system', urls.contact, 'paper'),
  ], 'paper', { padding: '@spacing.2xl @spacing.xl' })], [urls.contact]),
  entry('hero-sidebar', 'Newsletter with a side rail', 'Heroes', 'A wide headline column and narrow linked contents column.', [columns([
    [eyebrow('THE WATER BRIEF'), heading('A little perspective for a busy team.', 'navy', 'h1', { tag: 'h1' }), text('Monitoring, practical learning, and useful questions for the week ahead.')],
    [eyebrow('EXPLORE'), link('The platform', urls.platform), link('Field notes', urls.articles), link('Training', urls.training)],
  ], 'navy', '70/30')], [urls.articles]),
];
