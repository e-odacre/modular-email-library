const nunjucks = require('nunjucks');
const mjml2html = require('mjml');
const { ROOT } = require('./paths');
const { loadRegistry } = require('./registry');
const { createComponentApi } = require('./components');
const { resolveTheme, applyTheme } = require('./themes');
const { typoAttrs, typoCss } = require('./typography');
const { createBuilder } = require('./recipes');
const { createVars } = require('./variables');
const { remixNodes } = require('./remix');

// [[ ]] and [% %] are ours. {{ }} and {% %} belong to Klaviyo and pass through untouched.
const NUNJUCKS_TAGS = {
  blockStart: '[%',
  blockEnd: '%]',
  variableStart: '[[',
  variableEnd: ']]',
  commentStart: '[#',
  commentEnd: '#]',
};

/**
 * opts: { theme, registry, fresh, vars }
 *   theme     a theme name or a loaded theme object. Defaults to the minimal theme
 *   vars      a variables registry (see variables.js), defaults to the Klaviyo one
 *   registry  reuse a loaded registry, otherwise it is loaded (fresh: true re-reads .meta.js files)
 */
function createEnv(brandTokens, opts = {}) {
  const { fresh = false } = opts;
  const registry = opts.registry || loadRegistry({ fresh });
  const theme = resolveTheme(opts.theme); // a name, a theme object, or the default theme
  const tokens = applyTheme(brandTokens, theme); // brand tokens with the theme's scale overrides
  const env = new nunjucks.Environment(new nunjucks.FileSystemLoader(ROOT), {
    autoescape: false,
    throwOnUndefined: true, // a typo'd token should fail the build, not render as empty
    tags: NUNJUCKS_TAGS,
  });
  env.addGlobal('t', tokens);
  env.addGlobal('theme', theme);
  const api = createComponentApi({ env, registry, tokens, theme });
  env.addGlobal('c', api.c);
  env.addGlobal('cn', api.cn);
  env.addGlobal('typo', (level, overrides) => new nunjucks.runtime.SafeString(typoAttrs(tokens, level, overrides)));
  env.addGlobal('typoCss', (level, overrides) => new nunjucks.runtime.SafeString(typoCss(tokens, level, overrides)));
  // cc('dm-surface', cls) -> ' css-class="dm-surface"', or '' when there are no classes. Keeps MJML from
  // emitting empty class="" attributes and stray "-outlook" classes.
  env.addGlobal('cc', (...names) => {
    const joined = names.filter(Boolean).join(' ').trim();
    return new nunjucks.runtime.SafeString(joined ? ` css-class="${joined}"` : '');
  });
  // dm(background, kind) -> the dark-mode class for a block, only when it sits on the brand's surface or background
  // color. Blocks with their own colors (an accent banner) keep them in dark mode, so they get no class.
  const dm = (bg, kind = 'bg') => {
    const b = String(bg).toUpperCase();
    const onSurface = b === String(tokens.colors.surface).toUpperCase();
    const onBackground = b === String(tokens.colors.background).toUpperCase();
    if (kind === 'bg') return onSurface ? 'dm-surface' : onBackground ? 'dm-bg' : '';
    if (!onSurface && !onBackground) return '';
    return { text: 'dm-text', muted: 'dm-muted', border: 'dm-border' }[kind] || '';
  };
  env.addGlobal('dm', dm);
  // tone(s) -> how child components should be colored inside a block with background s.background. On the brand
  // surface or background they use their normal colors and dark-mode swaps. On a colored background they use the
  // block's own text color and never swap.
  env.addGlobal('tone', (s) => {
    const onSurface = dm(s.background, 'bg') !== '';
    return {
      onSurface,
      color: onSurface ? 'auto' : s.textColor,
      darkMode: onSurface,
      buttonDark: onSurface ? 'solid' : 'none',
    };
  });
  // Variables, sections and recipes, for emails written as .mjml files:
  //   [[ v('customer.first_name') ]]   [[ recipe('welcome', { ... }) ]]   [[ recipeSection('best-sellers', { ... }) ]]
  const vars = opts.vars || createVars();
  const builder = createBuilder({ vars, fresh });
  env.addGlobal('v', (name, args) => vars.get(name, args));
  env.addGlobal('recipe', (name, data) => api.cn(builder.recipe(name, data)));
  env.addGlobal('recipeSection', (name, data) => api.cn(builder.section(name, data)));
  env.componentApi = api;
  env.registry = registry;
  env.builder = builder;
  env.vars = vars;
  return env;
}

function renderMjml(templatePath, tokens, opts) {
  return createEnv(tokens, opts).render(templatePath, {});
}

// templatePath is relative to the repo root, e.g. "flows/welcome.mjml".
async function renderEmail(templatePath, tokens, opts) {
  const mjml = renderMjml(templatePath, tokens, opts);
  const { html, errors } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
  return { html, mjml, mjmlErrors: errors || [] };
}

/**
 * Renders one component on its own, inside the base layout, so it can be compiled and inspected.
 * opts: { data, variant, settings, theme, registry, fresh }. data defaults to the component's previewData.
 * Content-level components are wrapped in a section and column. Returns { html, mjml, fragment, mjmlErrors, entry }.
 */
async function renderComponent(id, tokens, opts = {}) {
  const env = createEnv(tokens, opts);
  const entry = env.registry.get(id);
  const preview = entry.meta.previewData;
  const variantPreview = (preview.byVariant && preview.byVariant[opts.variant]) || {};
  const data = opts.data || variantPreview.data || preview.data;
  const settings = { ...(variantPreview.settings || preview.settings || {}), ...(opts.settings || {}) };

  const fragment = env.componentApi.render(id, data, { variant: opts.variant, settings });
  const body = entry.meta.level === 'content' ? `<mj-section><mj-column>${fragment}</mj-column></mj-section>` : fragment;
  const mjml = env.renderString('[% extends "layouts/base.mjml" %][% block body %][[ body ]][% endblock %]', { body });
  const { html, errors } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
  return { html, mjml, fragment, mjmlErrors: errors || [], entry };
}

/**
 * Renders a campaign recipe as a complete email. data defaults to the recipe's previewData.
 * opts: { theme, remix, registry, vars }. remix is { variants: { id: variant }, settings: { id: { key: value } } }.
 * Returns { html, mjml, nodes, mjmlErrors }.
 */
async function renderRecipe(name, data, brandTokens, opts = {}) {
  const env = createEnv(brandTokens, opts);
  const recipe = env.builder.recipes.get(name);
  if (!recipe) throw new Error(`No recipe "${name}". Available: ${[...env.builder.recipes.keys()].join(', ')}`);
  let nodes = env.builder.recipe(name, data === undefined ? recipe.previewData : data);
  if (opts.remix) nodes = remixNodes(nodes, opts.remix, env.registry);
  const mjml = env.renderString('[% extends "layouts/base.mjml" %][% block body %][[ cn(nodes) ]][% endblock %]', { nodes });
  const { html, errors } = await mjml2html(mjml, { validationLevel: 'strict', minify: false });
  return { html, mjml, nodes, mjmlErrors: errors || [] };
}

module.exports = { renderEmail, renderMjml, renderComponent, renderRecipe, createEnv };
