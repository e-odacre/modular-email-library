const { n, urls, entry, section, columns, heading, text, eyebrow, button, link, rule } = require('./shared');
module.exports = [
  entry('cta-peach', 'Peach closing statement', 'Calls to action', 'A high-contrast closing band with one clear action.', [section([
    eyebrow('YOUR NEXT QUESTION', 'peach', 'center'), heading('Let’s talk about your water.', 'peach', 'h1', { align: 'center' }),
    text('Bring your priorities. Start a useful conversation.', 'peach', { align: 'center' }), button('Contact SanEcoTec', urls.contact, 'peach', { align: 'center' }),
  ], 'peach', { padding: '@spacing.2xl @spacing.xl' })], [urls.contact]),
  entry('cta-outline', 'Quiet outlined action', 'Calls to action', 'A compact secondary action for a nurture email.', [section([
    heading('Ready for a closer look?', 'navy', 'h3'), text('Explore the platform at your own pace.'),
    button('Explore Water Health Index', urls.platform, 'navy', { background: 'transparent', color: '@colors.link', borderColor: '@colors.link', borderWidth: '1px' }),
  ])], [urls.platform]),
  entry('cta-split', 'Two-column closing action', 'Calls to action', 'A statement on the left and an action panel on the right.', [columns([
    [eyebrow('NEXT UP', 'blue'), heading('Your facility.\nYour questions.', 'blue')],
    [text('Tell the team what you would like to explore.', 'blue'), button('Start a conversation', urls.contact, 'blue')],
  ], 'blue', '60/40')], [urls.contact]),
  entry('cta-contact-card', 'Contact card', 'Calls to action', 'A bordered contact panel with a VML-capable email button.', [section([
    eyebrow('SANECoTEC'), heading('A good place to start.'), text('Share a little context about your water system.'),
    n('email/outlook-safe-button', { label: 'Contact the team', href: urls.contact }, { settings: { background: '@colors.accent', color: '@colors.background' } }),
  ], 'navy', { border: '1px solid @colors.secondary' })], [urls.contact]),
  entry('cta-resources', 'Read or talk', 'Calls to action', 'Two actions with clear primary and secondary emphasis.', [section([
    heading('Keep exploring.'), text('Read a little more, or bring your question directly to the team.'),
    n('content/button-group', { buttons: [{ label: 'Browse resources', href: urls.articles, style: 'primary' }, { label: 'Contact the team', href: urls.contact, style: 'secondary' }] }, { settings: { background: '@colors.accent', color: '@colors.background' } }),
  ])], [urls.articles, urls.contact]),
  entry('cta-training', 'Training interest strip', 'Calls to action', 'A short paper panel to close an education-focused message.', [section([
    eyebrow('LEARN TOGETHER', 'paper'), heading('What would your team like to learn?', 'paper', 'h3'),
    link('Explore training with SanEcoTec', urls.training, 'paper'),
  ], 'paper')], [urls.training]),
];
