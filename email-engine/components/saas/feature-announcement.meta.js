const { SECTION_RESPONSIVE, P } = require('../_shared');

module.exports = {
  name: 'Feature Announcement',
  description: 'Announce a feature: badge, headline, description, key points, a button and a screenshot.',
  level: 'section',

  fields: {
    badge: { type: 'text', default: 'New' },
    headline: { type: 'text', required: true },
    description: 'text',
    points: { type: 'listItems', max: 5 },
    screenshot: 'image',
    cta: 'cta',
  },

  settings: {
    layout: { type: 'enum', values: ['stacked', 'split'], default: 'stacked' },
    align: { type: 'alignment', default: 'center' },
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX' },
  },

  responsive: SECTION_RESPONSIVE,

  variants: {
    default: { description: 'Centered text above a framed screenshot.' },
    split: { description: 'Left-aligned text beside the screenshot.', settings: { layout: 'split', align: 'left' } },
    tinted: { description: 'Stacked on the page background color.', settings: { background: '@colors.background' } },
  },

  previewData: {
    data: {
      badge: 'New',
      headline: 'Shared workspaces are here',
      description: 'Invite your whole team, keep every project in one place and stop forwarding files.',
      points: ['Unlimited members on every plan', 'Comments and mentions on any item', 'Roles and permissions per workspace'],
      screenshot: P.img(560, 340, 'Workspaces', 'Screenshot of the new workspace view with three projects and a team member list'),
      cta: { label: 'Try workspaces', href: 'https://example.com/app/workspaces' },
    },
  },

  compat: {
    outlook: 'Honored. The split layout is a table row, frame corners are square.',
    gmail: 'Fine. The split layout stacks on phones through a media query.',
    darkMode: 'Swaps via dm-* classes when on the brand surface or background color.',
  },
};
