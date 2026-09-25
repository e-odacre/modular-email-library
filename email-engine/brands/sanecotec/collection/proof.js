const { n, site, urls, entry, section, columns, heading, text, eyebrow, button, link, rule } = require('./shared');
const caseUrls = {
  pool: `${site}/case-studies/community-pool-water-quality-optimization`,
  grower: `${site}/case-studies/consistent-water-quality-high-quality-plants`,
  building: `${site}/case-studies/hospital-campus-water-risk-management`,
};
module.exports = [
  entry('case-pool', 'Pool case-study invitation', 'Proof & process', 'A case-study teaser with no invented metrics or testimonials.', [section([
    eyebrow('FROM THE CASE LIBRARY', 'paper'), heading('Inside a community pool project.', 'paper'), text('Explore SanEcoTec’s published pool water-quality case study.', 'paper'),
    rule('paper'), button('Read the pool case study', caseUrls.pool, 'paper'),
  ], 'paper')], [urls.cases, caseUrls.pool]),
  entry('case-grower', 'Grower case-study sidebar', 'Proof & process', 'A narrow subject rail and a wider case-study invitation.', [columns([
    [eyebrow('CASE / GROWING'), heading('Water.\nPlants.\nPerspective.', 'navy', 'h3')],
    [heading('A growing operation in focus.'), text('Read the published story on water consistency and plant quality.'), link('Explore the grower case study', caseUrls.grower)],
  ], 'navy', '30/70')], [urls.cases, caseUrls.grower]),
  entry('case-building', 'Building case-study band', 'Proof & process', 'A blue case-study band for facility-focused emails.', [section([
    eyebrow('BUILDING WATER', 'blue'), heading('A campus-sized perspective.', 'blue'), text('Explore SanEcoTec’s published hospital campus case study.', 'blue'),
    button('Read the campus case study', caseUrls.building, 'blue'),
  ], 'blue')], [urls.cases, caseUrls.building]),
  entry('assessment-checklist', 'Conversation checklist', 'Proof & process', 'A useful preparation list without technical treatment advice.', [section([
    eyebrow('BEFORE WE TALK'), heading('Bring a few details about your setup.'),
    n('content/list', { items: ['The kind of facility or water system you operate', 'How your team currently gathers readings', 'The operational questions you want to explore', 'The people who should join the conversation'] }, { variant: 'checklist' }),
    link('Contact the SanEcoTec team', urls.contact),
  ])], [urls.contact]),
  entry('consultation-process', 'Three conversation prompts', 'Proof & process', 'Horizontal steps describing preparation, not a promised service workflow.', [n('features/numbered-steps', {
    heading: 'Make your first conversation useful.', steps: [
      { title: 'Describe', description: 'Outline the system and who uses it.' },
      { title: 'Prioritize', description: 'Name the questions that matter most.' },
      { title: 'Explore', description: 'Discuss where to look next.' },
    ],
  }, { variant: 'horizontal' })], [urls.contact]),
  entry('faq', 'Getting-started questions', 'Proof & process', 'Open answers with fine separators; no interactive accordion.', [n('faq/faq', {
    heading: 'A few places to start.', items: [
      { question: 'Where can I learn about the platform?', answer: 'The Water Health Index page introduces the platform and its approach to system monitoring.' },
      { question: 'Where can I explore training?', answer: 'The education page lists SanEcoTec’s published courses and learning options.' },
      { question: 'Can I ask about my own facility?', answer: 'Use the contact page to share your setup and the questions you would like to discuss.' },
    ], cta: { label: 'Ask your question', href: urls.contact },
  }, { variant: 'rules' })], [urls.platform, urls.training, urls.contact]),
];
