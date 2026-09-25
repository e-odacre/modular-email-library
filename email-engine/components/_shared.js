// Helpers shared by component metadata files. Not a component (it sits outside the category folders).

const SECTION_PADDING = '@theme.section.paddingY @theme.section.paddingX @theme.section.paddingY @theme.section.paddingX';

// Settings almost every section-level component has.
function sectionSettings(overrides = {}) {
  return {
    background: { type: 'color', default: '@colors.surface' },
    padding: { type: 'spacing', default: SECTION_PADDING },
    ...overrides,
  };
}

const TEXT_ALIGN = { type: 'alignment', default: 'left' };

// Responsive metadata most section-level components expose.
const SECTION_RESPONSIVE = { hideOnMobile: true, hideOnDesktop: true };

const compat = {
  // Plain tables and text: works everywhere.
  plain: {
    outlook: 'Renders as tables, padding and colors are honored.',
    gmail: 'Fine.',
    darkMode: 'Text and background swap via dm-* classes where honored, blocks with their own colors keep them.',
  },
};

// Preview helpers: component nodes and realistic images for previewData. Placeholder images come from placehold.co,
// which only ever appears in previews, never in a brand's own tokens.
const node = (component, data = {}, settings, variant) => ({ component, data, ...(settings ? { settings } : {}), ...(variant ? { variant } : {}) });
const img = (w, h, label, alt) => ({ src: `https://placehold.co/${w}x${h}/png?text=${encodeURIComponent(label)}`, alt });
const P = {
  heading: (text, level = 'h3') => node('content/heading', { text }, { level }),
  text: (text) => node('content/text', { text }),
  image: (w, h, label, alt) => node('content/image', { image: img(w, h, label, alt) }),
  button: (label, href = 'https://example.com/collections/summer') => node('content/button', { label, href }),
  img,
  node,
};

// Colored bands (banners, urgency blocks, offers). Text and button colors are settings because the background is.
const bandSettings = (over = {}) => ({
  align: { type: 'alignment', default: 'center' },
  background: { type: 'color', default: '@colors.accent' },
  textColor: { type: 'text', attr: true, default: '@colors.white' },
  buttonBackground: { type: 'color', default: '@colors.white' },
  buttonColor: { type: 'color', default: '@colors.accent' },
  padding: { type: 'spacing', default: '@spacing.xl @theme.section.paddingX' },
  ...over,
});

const bandVariants = (accentDescription) => ({
  default: { description: accentDescription },
  dark: {
    description: 'White text on the primary brand color.',
    settings: { background: '@colors.primary', buttonColor: '@colors.primary' },
  },
  urgent: {
    description: 'White text on the error (red) color, for real urgency.',
    settings: { background: '@colors.error', buttonColor: '@colors.error' },
  },
  light: {
    description: 'Dark text on the surface color, with a solid button.',
    settings: { background: '@colors.surface', textColor: '@colors.text', buttonBackground: '@colors.primary', buttonColor: '@colors.primaryText' },
  },
});

module.exports = { bandSettings, bandVariants, SECTION_PADDING, sectionSettings, TEXT_ALIGN, SECTION_RESPONSIVE, compat, P };
