// typo('h2') -> the MJML attributes for a typography level, read from the brand tokens (after the theme's overrides).
//
//   <mj-text [[ typo('h2') ]] padding="0">
//   <mj-text [[ typo('h1', { color: s.color }) ]]>
//
// Overrides take font (a font role), size, weight, lineHeight, letterSpacing, transform, and color
// (a color role, a hex value or an @reference).
const { getPath } = require('./tokens');

const LEVEL_PROPS = ['font', 'size', 'weight', 'lineHeight', 'letterSpacing', 'transform', 'color'];

function typoSpec(tokens, level, overrides = {}) {
  const base = tokens.type && tokens.type[level];
  if (!base) {
    throw new Error(`typo("${level}"): no such typography level. Available: ${Object.keys(tokens.type || {}).join(', ')}`);
  }
  for (const k of Object.keys(overrides)) {
    if (!LEVEL_PROPS.includes(k)) throw new Error(`typo("${level}"): unknown override "${k}" (use ${LEVEL_PROPS.join(', ')})`);
  }
  const defined = Object.fromEntries(Object.entries(overrides).filter(([, v]) => v !== undefined && v !== null && v !== 'auto'));
  const spec = { ...base, ...defined };

  const family = tokens.fonts[spec.font];
  if (family === undefined) throw new Error(`typo("${level}"): "${spec.font}" is not a font role`);

  let color = spec.color;
  if (color in tokens.colors) color = tokens.colors[color];
  else if (typeof color === 'string' && color.startsWith('@')) color = getPath(tokens, color.slice(1));
  if (typeof color !== 'string') throw new Error(`typo("${level}"): cannot resolve color "${spec.color}"`);

  return { ...spec, family, color };
}

// typo('h2') -> attributes for an mj-* element.
function typoAttrs(tokens, level, overrides) {
  const s = typoSpec(tokens, level, overrides);
  return [
    `font-family="${s.family}"`,
    `font-size="${s.size}"`,
    `font-weight="${s.weight}"`,
    `line-height="${s.lineHeight}"`,
    `letter-spacing="${s.letterSpacing}"`,
    `text-transform="${s.transform}"`,
    `color="${s.color}"`,
  ].join(' ');
}

// typoCss('h2') -> an inline style string for a raw HTML tag inside mj-text (headings, paragraphs). Explicit values,
// never "inherit", because Outlook desktop does not resolve inherit reliably. Includes margin:0.
function typoCss(tokens, level, overrides) {
  const s = typoSpec(tokens, level, overrides);
  return `margin:0;font-family:${s.family};font-size:${s.size};font-weight:${s.weight};line-height:${s.lineHeight};letter-spacing:${s.letterSpacing};text-transform:${s.transform};color:${s.color};`;
}

module.exports = { typoAttrs, typoCss, LEVEL_PROPS };
