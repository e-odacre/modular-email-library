const blocks = [
  ...require('./collection/frame'), ...require('./collection/heroes'),
  ...require('./collection/platform'), ...require('./collection/industries'),
  ...require('./collection/resources'), ...require('./collection/proof'), ...require('./collection/actions'),
];
module.exports = {
  name: 'SanEcoTec', description: 'Water / with perspective',
  galleryTitle: 'A library for\nclearer water stories.',
  tokenFile: 'tokens.draft.json', themes: ['minimal', 'editorial', 'bold'],
  header: 'header-left', footer: 'footer-minimal', blocks,
  emails: require('./collection/emails'),
  notes: [
    'Draft copy and brand values. Review before sending.',
    'Website WebP images need email-compatible PNG/JPEG hosting before production.',
    'Phone previews show browser layout, not verified email-client behavior.',
  ],
};
