// Shared pieces for recipes: the frame every email has (preheader, header, footer) and the fields that control it.
const { node, when } = require('../scripts/lib/recipes');
const { createVars } = require('../scripts/lib/variables');

const vars = createVars();

// Fields every recipe accepts. All optional: a recipe is a starting point, not a rigid template.
const FRAME_FIELDS = {
  preheader: 'text',
  announcement: { type: 'object', fields: { text: { type: 'text', required: true }, link: 'link' } },
  viewInBrowser: 'boolean',
  nav: { type: 'links', max: 6 },
  footer: {
    type: 'object',
    fields: { description: 'text', social: { type: 'socialLinks', max: 8 }, nav: { type: 'links', max: 6 }, legal: { type: 'links', max: 4 }, copyright: 'text', disclaimer: 'text' },
  },
};

// Wraps the body of an email: preheader, optional announcement bar and view-in-browser line, header, body, footer.
// With no preheader text the preheader uses the preview text set in Klaviyo.
function frame(d, body) {
  return [
    node('email/preheader', d.preheader ? { text: d.preheader } : {}),
    ...when(d.announcement, node('promotional/announcement-bar', d.announcement || {})),
    ...when(d.viewInBrowser, node('email/view-in-browser', {}, { variant: 'page' })),
    node('email/header', d.nav ? { nav: d.nav } : {}),
    ...body.flat().filter(Boolean),
    node('email/footer', d.footer || {}, { variant: d.footer ? 'rich' : 'default' }),
  ];
}

// The frame content shown in every recipe preview.
const FRAME_PREVIEW = {
  nav: [
    { label: 'New', href: 'https://example.com/collections/new' },
    { label: 'Women', href: 'https://example.com/collections/women' },
    { label: 'Men', href: 'https://example.com/collections/men' },
    { label: 'Sale', href: 'https://example.com/collections/sale' },
  ],
  footer: {
    description: 'Sustainable everyday clothing, made to last.',
    social: [
      { network: 'instagram', href: 'https://instagram.com/example', label: 'Instagram' },
      { network: 'facebook', href: 'https://facebook.com/example', label: 'Facebook' },
    ],
    nav: [
      { label: 'Shop', href: 'https://example.com/collections/all' },
      { label: 'Help', href: 'https://example.com/pages/help' },
    ],
    legal: [
      { label: 'Privacy policy', href: 'https://example.com/policies/privacy' },
      { label: 'Terms of service', href: 'https://example.com/policies/terms' },
    ],
    copyright: `© ${vars.get('date.year')} ${vars.get('brand.name')}. All rights reserved.`,
  },
};

// Optional section: builds it only when the data is there.
const optional = (data, build) => (data ? build(data) : []);

module.exports = { FRAME_FIELDS, FRAME_PREVIEW, frame, optional, vars };
