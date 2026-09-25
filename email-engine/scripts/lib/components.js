// Renders components. Exposed to templates as the Nunjucks globals c(name, data, opts) and cn(nodes), and to JS as
// api.render / api.renderNode.
//
//   [[ c('hero/full-bleed', { heading: 'Summer', cta: { label: 'Shop', href: '{{ organization.url }}' } }) ]]
//   [[ c('button', { label: 'Shop', href: '...' }, { variant: 'outline', settings: { align: 'left' } }) ]]
//   [[ cn([{ component: 'content/heading', data: { text: 'Hi' } }, { component: 'content/text', data: { text: '...' } }]) ]]
//
// A component is described as a node when it is data rather than a call: { component, variant, data, settings }.
// Slots (fields of type "slot") take nodes, so layouts compose other components without any template glue.
const nunjucks = require('nunjucks');
const { ComponentError, validateFields } = require('./schema');
const { resolveSettings, responsiveClasses } = require('./style');

const MAX_DEPTH = 16;

function createComponentApi({ env, registry, tokens, theme = null }) {
  // How many components are being rendered inside one another right now. Templates call c() and cn() themselves,
  // so a counter (not a parameter) is what catches a component that renders itself.
  let active = 0;

  function render(idOrName, data = {}, opts = {}) {
    if (active >= MAX_DEPTH) throw new ComponentError(`components nested more than ${MAX_DEPTH} levels deep, is something recursive? (rendering "${idOrName}")`);
    active += 1;
    try {
      const entry = registry.get(idOrName);
      const { variant, s } = resolveSettings(entry, { variant: opts.variant, theme, settings: opts.settings, tokens });

      const ctx = { renderSlot: (value, accepts, path) => renderSlot(value, accepts, path, entry) };
      const { value, errors } = validateFields(entry.meta.fields, data, ctx);
      if (!errors.length && entry.meta.validate) errors.push(...(entry.meta.validate(value, s) || []));
      if (errors.length) throw new ComponentError(`component "${entry.id}":\n  ${errors.join('\n  ')}`);

      return env.render(entry.templatePath, {
        data: value,
        s,
        variant,
        id: entry.id,
        cls: responsiveClasses(s),
      });
    } finally {
      active -= 1;
    }
  }

  function renderNode(node) {
    return render(node.component, node.data || {}, { variant: node.variant, settings: node.settings });
  }

  function renderSlot(value, accepts, path, parent) {
    const parts = Array.isArray(value) ? value : [value];
    const out = [];
    parts.forEach((part, i) => {
      const where = Array.isArray(value) ? `${path}[${i}]` : path;
      if (typeof part === 'string') return out.push(part);
      if (part && typeof part === 'object' && typeof part.component === 'string') {
        let entry;
        try {
          entry = registry.get(part.component);
        } catch (err) {
          throw new ComponentError(`component "${parent.id}": ${where}: ${err.message}`);
        }
        if (accepts && entry.meta.level !== accepts) {
          throw new ComponentError(
            `component "${parent.id}": ${where} takes ${accepts}-level components, but "${entry.id}" is ${entry.meta.level}-level`,
          );
        }
        return out.push(renderNode(part));
      }
      throw new ComponentError(`component "${parent.id}": ${where} must be MJML text or a { component, data } node`);
    });
    return out.join('\n');
  }

  const c = (name, data, opts) => new nunjucks.runtime.SafeString(render(name, data, opts));
  const cn = (nodes) => new nunjucks.runtime.SafeString((nodes || []).map(renderNode).join('\n'));

  return { c, cn, render, renderNode };
}

module.exports = { createComponentApi };
