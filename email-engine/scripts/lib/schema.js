// Hand-rolled field validation for component data and settings. No dependencies on purpose.
//
// A spec is a type name ('text') or an object ({ type: 'text', required: true, default: 'x' }).
// Fields are optional unless `required: true`. Objects reject unknown keys so typos fail loudly.
//
// Types
//   text       string, may contain Klaviyo tags. `attr: true` if it lands in an HTML attribute (no double quotes)
//   richtext   string of inline HTML
//   url        http(s), mailto, tel, #anchor, /path or a Klaviyo tag. No double quotes, no javascript:
//   image      { src, alt, decorative?, href?, width? }. alt is required unless decorative: true
//   cta        { label, href }
//   number, boolean
//   enum       { type: 'enum', values: [...] }
//   list       { type: 'list', of: spec, min?, max? }
//   object     { type: 'object', fields: { ... } }
//   slot       MJML string, a component node ({ component, variant, data, settings }), or a list of those.
//              Resolved to a single MJML string. `accepts: 'content' | 'section'` checks what may go inside.
//   color, length, spacing, alignment   value types for settings
//   products, links, logos, ...         named types (NAMED_TYPES below)
//
// Double quotes are rejected wherever a value can end up in an MJML attribute. Use single quotes inside
// Klaviyo tags there, for example {{ first_name|default:'there' }}.

const KLAVIYO_TAG = /\{\{[^}]*\}\}|\{%[^%]*%\}/;
// Link text that says nothing to a screen reader reading a list of links.
const VAGUE_LINK = /^\s*(click here|here|link|this link|click)\s*[.!]?\s*$/i;
const URL_OK = /^(https?:\/\/|mailto:|tel:|\{\{|\{%|#|\/)/i;
const HEX = /^#([0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const LENGTH = /^-?\d+(\.\d+)?(px|%|em)?$/;

class ComponentError extends Error {}

const BASE_TYPES = new Set([
  'text', 'richtext', 'url', 'image', 'cta', 'number', 'boolean', 'enum', 'list', 'object', 'slot',
  'color', 'length', 'spacing', 'alignment',
]);

const PRODUCT = {
  type: 'object',
  fields: {
    image: { type: 'image', required: true },
    name: { type: 'text', required: true },
    description: 'text',
    price: 'text',
    salePrice: 'text',
    discount: 'text',
    badge: 'text',
    url: 'url',
    cta: 'cta',
  },
};

// Shared shapes so every component that takes "products" or "links" validates them the same way.
const NAMED_TYPES = {
  product: PRODUCT,
  products: { type: 'list', of: PRODUCT },
  link: { type: 'object', fields: { label: { type: 'text', required: true }, href: { type: 'url', required: true } } },
  links: { type: 'list', of: 'link' },
  logo: { type: 'object', fields: { src: { type: 'url', required: true }, alt: { type: 'text', attr: true, required: true }, href: 'url', width: 'length' } },
  logos: { type: 'list', of: 'logo' },
  stat: { type: 'object', fields: { value: { type: 'text', required: true }, label: { type: 'text', required: true }, note: 'text' } },
  stats: { type: 'list', of: 'stat' },
  feature: {
    type: 'object',
    fields: { title: { type: 'text', required: true }, description: 'text', icon: 'image', number: 'text', cta: 'cta' },
  },
  features: { type: 'list', of: 'feature' },
  article: {
    type: 'object',
    fields: {
      title: { type: 'text', required: true },
      excerpt: 'text',
      image: 'image',
      href: { type: 'url', required: true },
      author: 'text',
      date: 'text',
      category: 'text',
      readTime: 'text',
    },
  },
  articles: { type: 'list', of: 'article' },
  faqItem: { type: 'object', fields: { question: { type: 'text', required: true }, answer: { type: 'richtext', required: true } } },
  faqItems: { type: 'list', of: 'faqItem' },
  listItems: { type: 'list', of: 'text' },
  button: {
    type: 'object',
    fields: { label: { type: 'text', required: true }, href: { type: 'url', required: true }, style: { type: 'enum', values: ['primary', 'secondary'], default: 'primary' } },
  },
  buttons: { type: 'list', of: 'button' },
  socialLink: {
    type: 'object',
    fields: {
      network: { type: 'enum', values: ['facebook', 'instagram', 'x', 'twitter', 'linkedin', 'youtube', 'pinterest', 'tiktok', 'snapchat', 'github', 'medium', 'vimeo', 'tumblr', 'web'], required: true },
      href: { type: 'url', required: true },
      label: { type: 'text', attr: true },
      icon: 'url',
    },
  },
  socialLinks: { type: 'list', of: 'socialLink' },
};

function normalize(spec) {
  const s = typeof spec === 'string' ? { type: spec } : { ...spec };
  const named = NAMED_TYPES[s.type];
  if (named) {
    const { type: _t, ...own } = s;
    return { ...normalize(named), ...own };
  }
  return s;
}

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function clone(v) {
  return v === undefined ? v : JSON.parse(JSON.stringify(v));
}

// Problems with the spec itself (used by the registry to validate component metadata).
function specProblems(spec, where) {
  const problems = [];
  const s = normalize(spec);
  if (!isPlainObject(s) || typeof s.type !== 'string') return [`${where}: spec needs a type`];
  if (!BASE_TYPES.has(s.type)) return [`${where}: unknown type "${s.type}"`];
  if (s.type === 'enum' && (!Array.isArray(s.values) || !s.values.length)) problems.push(`${where}: enum needs values`);
  if (s.type === 'list') {
    if (s.of === undefined) problems.push(`${where}: list needs "of"`);
    else problems.push(...specProblems(s.of, `${where}[]`));
  }
  if (s.type === 'object') {
    if (!isPlainObject(s.fields)) problems.push(`${where}: object needs fields`);
    else for (const [k, v] of Object.entries(s.fields)) problems.push(...specProblems(v, `${where}.${k}`));
  }
  return problems;
}

function typeName(v) {
  return Array.isArray(v) ? 'a list' : v === null ? 'null' : `a ${typeof v}`;
}

/**
 * Validates `value` against `spec`. Pushes readable messages to `errors` and returns the coerced value
 * (defaults applied, slots rendered). `ctx.renderSlot(value, accepts)` renders slot content.
 */
function check(spec, value, path, errors, ctx = {}) {
  const s = normalize(spec);

  if (value === undefined || value === null) {
    if (s.default !== undefined) return clone(s.default);
    if (s.required) errors.push(`${path} is required`);
    return undefined;
  }

  const bad = (msg) => {
    errors.push(`${path} ${msg}`);
    return undefined;
  };

  switch (s.type) {
    case 'text':
    case 'richtext': {
      if (typeof value !== 'string') return bad(`must be text, got ${typeName(value)}`);
      if (value.trim() === '' && !s.allowEmpty) return bad('must not be empty (leave it out instead)');
      if (s.attr && value.includes('"')) {
        return bad(`contains a double quote, use single quotes (it ends up in an HTML attribute)`);
      }
      return value;
    }
    case 'url': {
      if (typeof value !== 'string' || value.trim() === '') return bad('must be a URL');
      if (value.includes('"')) return bad(`contains a double quote, use single quotes inside Klaviyo tags`);
      if (/^\s*javascript:/i.test(value)) return bad('must not be a javascript: URL');
      if (!URL_OK.test(value.trim())) {
        return bad(`must start with https://, http://, mailto:, tel:, #, / or a Klaviyo tag, got "${value}"`);
      }
      return value;
    }
    case 'number': {
      if (typeof value !== 'number' || Number.isNaN(value)) return bad(`must be a number, got ${typeName(value)}`);
      if (s.min !== undefined && value < s.min) return bad(`must be at least ${s.min}`);
      if (s.max !== undefined && value > s.max) return bad(`must be at most ${s.max}`);
      return value;
    }
    case 'boolean':
      return typeof value === 'boolean' ? value : bad(`must be true or false, got ${typeName(value)}`);
    case 'enum':
      return s.values.includes(value) ? value : bad(`must be one of ${s.values.join(', ')}, got "${value}"`);
    case 'alignment':
      return ['left', 'center', 'right'].includes(value) ? value : bad(`must be left, center or right, got "${value}"`);
    case 'color': {
      if (typeof value !== 'string') return bad('must be a color');
      if (value.includes('"')) return bad('contains a double quote');
      if (HEX.test(value) || /^rgba?\([\d\s.,%]+\)$/i.test(value) || value === 'transparent' || /^[a-z]{3,20}$/i.test(value)) {
        return value;
      }
      return bad(`must be a hex color, rgb(), transparent or a color name, got "${value}"`);
    }
    case 'length':
      return typeof value === 'string' && LENGTH.test(value.trim()) ? value : bad(`must be a length like 24px, got ${JSON.stringify(value)}`);
    case 'spacing': {
      const parts = typeof value === 'string' ? value.trim().split(/\s+/) : [];
      return parts.length >= 1 && parts.length <= 4 && parts.every((p) => LENGTH.test(p))
        ? value
        : bad(`must be 1-4 lengths like "16px 24px", got ${JSON.stringify(value)}`);
    }
    case 'image': {
      if (!isPlainObject(value)) return bad(`must be an object { src, alt }, got ${typeName(value)}`);
      const out = {};
      out.src = check({ type: 'url', required: true }, value.src, `${path}.src`, errors, ctx);
      if (value.decorative === true) {
        out.decorative = true;
        out.alt = '';
      } else {
        const before = errors.length;
        out.alt = check({ type: 'text', attr: true, required: true }, value.alt, `${path}.alt`, errors, ctx);
        if (errors.length > before && value.alt === undefined) {
          errors[errors.length - 1] = `${path}.alt is required, describe the image or set decorative: true if it adds no meaning`;
        }
      }
      if (value.href !== undefined) out.href = check('url', value.href, `${path}.href`, errors, ctx);
      if (value.width !== undefined) out.width = check('length', value.width, `${path}.width`, errors, ctx);
      const known = new Set(['src', 'alt', 'decorative', 'href', 'width']);
      for (const k of Object.keys(value)) if (!known.has(k)) errors.push(`${path}.${k} is not a known image field`);
      return out;
    }
    case 'cta': {
      if (!isPlainObject(value)) return bad(`must be an object { label, href }, got ${typeName(value)}`);
      if (typeof value.label === 'string' && VAGUE_LINK.test(value.label)) {
        errors.push(`${path}.label "${value.label.trim()}" is not descriptive link text, say what the link does ("View your order")`);
      }
      const out = {
        label: check({ type: 'text', required: true }, value.label, `${path}.label`, errors, ctx),
        href: check({ type: 'url', required: true }, value.href, `${path}.href`, errors, ctx),
      };
      for (const k of Object.keys(value)) if (k !== 'label' && k !== 'href') errors.push(`${path}.${k} is not a known cta field`);
      return out;
    }
    case 'list': {
      if (!Array.isArray(value)) return bad(`must be a list, got ${typeName(value)}`);
      if (s.min !== undefined && value.length < s.min) return bad(`needs at least ${s.min} item(s), got ${value.length}`);
      if (s.max !== undefined && value.length > s.max) return bad(`allows at most ${s.max} item(s), got ${value.length}`);
      return value.map((item, i) => check({ ...normalize(s.of), required: true }, item, `${path}[${i}]`, errors, ctx));
    }
    case 'object': {
      if (!isPlainObject(value)) return bad(`must be an object, got ${typeName(value)}`);
      const out = {};
      for (const [k, sub] of Object.entries(s.fields)) {
        const v = check(sub, value[k], path ? `${path}.${k}` : k, errors, ctx);
        if (v !== undefined) out[k] = v;
      }
      for (const k of Object.keys(value)) {
        if (!(k in s.fields)) errors.push(`${path ? `${path}.` : ''}${k} is not a known field (known: ${Object.keys(s.fields).join(', ') || 'none'})`);
      }
      return out;
    }
    case 'slot': {
      if (!ctx.renderSlot) return bad('slots need a renderer');
      return ctx.renderSlot(value, s.accepts, path);
    }
    default:
      return bad(`has unknown type "${s.type}"`);
  }
}

// Validates a whole `fields` map (a plain object of specs). Returns { value, errors }.
function validateFields(fields, data, ctx = {}, label = '') {
  const errors = [];
  const value = check({ type: 'object', fields }, data === undefined ? {} : data, label, errors, ctx);
  return { value, errors };
}

module.exports = { ComponentError, NAMED_TYPES, KLAVIYO_TAG, VAGUE_LINK, check, validateFields, specProblems, normalize, isPlainObject, clone };
