const { n, urls, assets, entry, section, columns, heading, text, eyebrow, button, link, image, rule, card } = require('./shared');
module.exports = [
  entry('platform-trio', 'Platform capability trio', 'Platform', 'Three numbered pillars in a compact feature grid.', [
    section([eyebrow('WATER HEALTH INDEX'), heading('From readings to perspective.')]),
    n('features/feature-grid', { features: [
      { title: 'Monitor', description: 'Bring system readings into a central view.' },
      { title: 'Review', description: 'Look for changes across historical trends.' },
      { title: 'Plan', description: 'Use insights to guide your next conversation.' },
    ] }, { settings: { paddingY: '@spacing.md' } }),
  ], [urls.platform]),
  entry('platform-steps', 'Monitoring journey', 'Platform', 'A vertical sequence with spacious numbered markers.', [n('features/numbered-steps', {
    heading: 'Connect the dots in your water data.', steps: [
      { title: 'Collect a clearer picture', description: 'Start with the readings relevant to your system.' },
      { title: 'Review patterns over time', description: 'Bring current and historical performance into the conversation.' },
      { title: 'Discuss the next action', description: 'Ask where monitoring and operational changes could help.' },
    ], cta: { label: 'Explore the WHI approach', href: urls.platform },
  })], [urls.platform]),
  entry('platform-comparison', 'Two perspectives', 'Platform', 'A side-by-side discussion aid without invented performance claims.', [
    section([eyebrow('A DIFFERENT VIEW'), heading('A reading is a starting point.')]),
    columns([
      [eyebrow('AT ONE MOMENT', 'paper'), heading('What is happening?', 'paper', 'h3'), text('A spot reading provides context for a specific time and location.', 'paper')],
      [eyebrow('ACROSS TIME', 'paper'), heading('What is changing?', 'paper', 'h3'), text('A history of readings can support questions about patterns and variability.', 'paper')],
    ], 'paper'),
  ], [urls.platform]),
  entry('sensor-showcase', 'Sensor image showcase', 'Platform', 'Large product illustration with a narrow caption and action.', [
    section([eyebrow('SENSORS & SYSTEMS'), heading('The tools behind the readings.'), image(assets.sensors), text('Explore SanEcoTec’s sensor range and discuss the fit for your facility.', 'navy', { level: 'bodySmall' }), button('View sensors and systems', urls.sensors)]),
  ], [urls.sensors]),
  entry('sensor-choices', 'Online and portable options', 'Platform', 'Two distinct product paths with descriptive text links.', [
    section([eyebrow('FIND YOUR STARTING POINT'), heading('How does your team collect data?')]),
    columns([
      card('01 / ONLINE', 'SPI Online', 'Explore monitoring equipment for an installed setup.', `${urls.sensors}#spi-on-line`),
      card('02 / ON THE GO', 'SPI OnTheGo', 'Explore the portable option for measurements in the field.', `${urls.sensors}#spi-on-the-go`),
    ]),
  ], [urls.sensors]),
  entry('consulting-services', 'Consulting service menu', 'Platform', 'A blue band with three areas to discuss and a single next step.', [section([
    eyebrow('CONSULTING', 'blue'), heading('Bring the system. Bring the questions.', 'blue'),
    text('Discuss operating practices, monitoring needs, and opportunities to review your water-management approach.', 'blue'),
    rule('blue'), text('System review  /  Operating procedures  /  Team training', 'blue', { level: 'bodySmall' }), button('Explore consulting', urls.consulting, 'blue'),
  ], 'blue')], [urls.consulting]),
];
