const { node } = require('../scripts/lib/recipes');
const { P } = require('../components/_shared');
const { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars } = require('./_helpers');
const benefits = require('../sections/benefits');
const cta = require('../sections/cta');

// Announcement, hero, feature explanation, benefits, screenshots, use case, CTA, footer.
module.exports = {
  name: 'SaaS Feature Launch',
  description: 'Launches a product feature: a hero, an explanation with a screenshot, the benefits, another view of it, a use case and a call to action.',
  suggestedTheme: 'saas',

  fields: {
    ...FRAME_FIELDS,
    hero: { type: 'object', required: true, fields: { eyebrow: 'text', headline: { type: 'text', required: true }, description: 'text', cta: 'cta' } },
    feature: {
      type: 'object',
      fields: { badge: 'text', headline: { type: 'text', required: true }, description: 'text', points: { type: 'listItems', max: 5 }, screenshot: 'image', cta: 'cta' },
    },
    benefits: { type: 'object', fields: benefits.fields },
    screenshot: { type: 'object', fields: { image: { type: 'image', required: true }, caption: 'text', credit: 'text' } },
    useCase: {
      type: 'object',
      fields: { eyebrow: 'text', heading: { type: 'text', required: true }, text: 'text', points: { type: 'listItems', max: 5 }, image: { type: 'image', required: true }, cta: 'cta' },
    },
    cta: { type: 'object', fields: cta.fields },
  },

  previewData: {
    ...FRAME_PREVIEW,
    preheader: 'Shared workspaces are here. Bring your whole team in.',
    announcement: { text: 'New: shared workspaces for every plan.', link: { label: 'See what is new', href: 'https://example.com/changelog' } },
    hero: {
      eyebrow: 'New',
      headline: 'Shared workspaces are here',
      description: 'Work on the same projects, in the same place, at the same time.',
      cta: { label: 'Try workspaces', href: 'https://example.com/app/workspaces' },
    },
    feature: {
      badge: 'How it works',
      headline: 'One place for every project',
      description: 'Invite your team, keep every project in one place and stop forwarding files.',
      points: ['Unlimited members on every plan', 'Comments and mentions on any item', 'Roles and permissions per workspace'],
      screenshot: P.img(560, 340, 'Workspaces', 'Screenshot of the new workspace view with three projects and a team member list'),
    },
    benefits: {
      heading: 'Why teams switch',
      items: ['Cut status meetings in half', 'See who is working on what', 'Everything searchable, always'],
      image: P.img(480, 400, 'Team', 'A team reviewing a project board on a shared screen'),
    },
    screenshot: { image: P.img(600, 360, 'Activity', 'The workspace activity feed showing recent comments and file changes'), caption: 'The activity feed shows everything that changed since you last looked.' },
    useCase: {
      eyebrow: 'For agencies',
      heading: 'Run every client from one place',
      text: 'Give each client their own workspace and keep billing, approvals and files tidy.',
      points: ['Client-facing approval links', 'Per-client time tracking'],
      image: P.img(480, 400, 'Agency', 'A project dashboard showing three client workspaces'),
      cta: { label: 'See the agency plan', href: 'https://example.com/agencies' },
    },
    cta: {
      headline: 'Ready to try it with your team?',
      text: 'Start free for 14 days. No credit card needed.',
      primary: { label: 'Create a workspace', href: vars.get('brand.url') },
      secondary: { label: 'Book a demo', href: 'https://example.com/demo' },
    },
  },

  build(d, { section }) {
    return frame(d, [
      node('hero/text-only', d.hero),
      optional(d.feature, (x) => node('saas/feature-announcement', x)),
      optional(d.benefits, (x) => section('benefits', x)),
      optional(d.screenshot, (x) => node('editorial/editorial-image', x, { variant: 'framed' })),
      optional(d.useCase, (x) => node('saas/use-case', x)),
      optional(d.cta, (x) => section('cta', x)),
    ]);
  },
};
