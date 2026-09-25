const { SECTION_RESPONSIVE } = require('../_shared');

module.exports = {
  name: 'Integration Announcement',
  description: "Announce an integration: your logo, a plus sign and the partner's logo, then a headline, description and button.",
  level: 'section',

  fields: {
    partner: { type: 'logo', required: true },
    headline: { type: 'text', required: true },
    description: 'text',
    cta: 'cta',
  },

  settings: {
    logoWidth: { type: 'length', default: '120px' },
    background: { type: 'color', default: '@colors.surface' },
    paddingY: { type: 'length', default: '@theme.section.paddingY' },
    paddingX: { type: 'length', default: '@theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Both logos with a plus sign, text beneath.' },
    tinted: { description: 'On the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      partner: { src: 'https://placehold.co/240x80/png?text=Slack', alt: 'Slack', href: 'https://example.com/integrations/slack' },
      headline: 'We now work with Slack',
      description: 'Get task updates, comments and reminders in the channels your team already uses.',
      cta: { label: 'Connect Slack', href: 'https://example.com/integrations/slack' },
    },
  },

  compat: {
    outlook: 'Honored, three table cells.',
    gmail: 'Fine. Alt text carries the names if images are blocked.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
