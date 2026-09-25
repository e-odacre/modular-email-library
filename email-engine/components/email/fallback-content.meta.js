const { P } = require('../_shared');

module.exports = {
  name: 'Fallback Content',
  description: 'One block for most clients and a simpler block for Outlook desktop, using conditional comments.',
  level: 'content',

  fields: {
    primary: { type: 'slot', accepts: 'content', required: true },
    fallback: { type: 'slot', accepts: 'content', required: true },
  },

  settings: {},

  variants: {
    default: { description: 'Primary for most clients, fallback for Outlook desktop.' },
  },

  previewData: {
    data: {
      primary: [P.node('decorative/badge', { text: 'New arrivals' }, undefined, 'pill'), P.text('Fresh linens, just in.')],
      fallback: [P.text('New arrivals: fresh linens, just in.')],
    },
  },

  validate(data) {
    const errors = [];
    for (const key of ['primary', 'fallback']) {
      if (/<!--\[if/i.test(data[key])) errors.push(`${key} contains a conditional comment, they cannot be nested inside this component`);
    }
    return errors;
  },

  compat: {
    outlook: 'Shows only the fallback slot.',
    gmail: 'Shows only the primary slot.',
    darkMode: 'Nothing extra, the components inside carry their own colors.',
  },
};
