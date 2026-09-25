// Brand compositions use existing components and token references, never raw email markup.
const { node: n } = require('../../../scripts/lib/recipes');
const site = 'https://sanecotec.com';
const urls = {
  home: `${site}/`, contact: `${site}/about/contact`, platform: `${site}/services/water-health-index-app`,
  sensors: `${site}/services/sensors`, consulting: `${site}/services/consulting`,
  articles: `${site}/resources/articles`, cases: `${site}/resources/case-studies`, training: `${site}/resources/education`,
  monitoring: `${site}/real-time-water-quality-monitoring`, economics: `${site}/economic-case-for-water-quality-monitoring`, ph: `${site}/ph-water-factor`,
};
const assets = {
  sensors: { src: `${site}/assets/sensors-hero-720.010f0b4c80.webp`, alt: 'SanEcoTec SPI sensor equipment in a blue technical illustration' },
  monitoring: { src: `${site}/assets/realtime-water-monitoring-editorial-640.812d77db05.webp`, alt: 'Water sensor beside a sample vessel and monitoring tablet' },
  economics: { src: `${site}/assets/economic-water-quality-640.db66a3dd8e.webp`, alt: 'Illustration accompanying the water monitoring economics article' },
  ph: { src: `${site}/assets/ph-water-factor-640.bc48ab1c53.webp`, alt: 'Laboratory pH testing of a water sample' },
};
const palettes = {
  navy: { bg: '@colors.background', ink: '@colors.text', accent: '@colors.accent', link: '@colors.link' },
  paper: { bg: '@colors.primaryText', ink: '@colors.background', accent: '@colors.primary', link: '@colors.primary' },
  blue: { bg: '@colors.primary', ink: '@colors.primaryText', accent: '@colors.accent', link: '@colors.primaryText' },
  peach: { bg: '@colors.accent', ink: '@colors.background', accent: '@colors.primary', link: '@colors.background' },
};
const heading = (text, palette = 'navy', level = 'h2', settings = {}) => n('content/heading', { text }, { settings: { level, color: palettes[palette].ink, darkMode: false, ...settings } });
const text = (value, palette = 'navy', settings = {}) => n('content/text', { text: value }, { settings: { color: palettes[palette].ink, darkMode: false, ...settings } });
const eyebrow = (value, palette = 'navy', align = 'left') => n('decorative/eyebrow', { text: value }, { settings: { color: palettes[palette].accent, align } });
const link = (label, href, palette = 'navy') => n('content/link', { label, href }, { variant: 'arrow', settings: { color: palettes[palette].link, darkMode: false } });
const button = (label, href, palette = 'navy', settings = {}) => n('content/button', { label, href }, { settings: {
  background: palette === 'peach' || palette === 'paper' ? '@colors.background' : '@colors.accent',
  color: palette === 'peach' || palette === 'paper' ? '@colors.primaryText' : '@colors.background',
  align: 'left', darkMode: 'none', padding: '@spacing.sm 0 0 0', ...settings,
} });
const section = (content, palette = 'navy', settings = {}) => n('layout/section', { content }, { settings: { background: palettes[palette].bg, padding: '@spacing.xl', ...settings } });
const columns = (items, palette = 'navy', split = '50/50', settings = {}) => n('layout/columns', { columns: items }, { settings: { split, background: palettes[palette].bg, padding: '@spacing.xl', columnPadding: '@spacing.sm', ...settings } });
const rule = (palette = 'navy') => n('decorative/line', {}, { variant: 'wide', settings: { color: palettes[palette].accent } });
const image = (asset, settings = {}) => n('content/image', { image: asset }, { settings: { padding: '0 0 @spacing.md 0', ...settings } });
const entry = (id, name, category, description, nodes, sources = [urls.home], extra = {}) => ({ id, name, category, description, nodes, sources, ...extra });
const card = (label, title, body, href, palette = 'navy') => [eyebrow(label, palette), heading(title, palette, 'h3'), text(body, palette, { level: 'bodySmall' }), link('Explore this topic', href, palette)];
module.exports = { n, site, urls, assets, palettes, heading, text, eyebrow, link, button, section, columns, rule, image, entry, card };
