const { REFERENCE_BRAND, PLACEHOLDER_URL } = require('./tokens');

const GMAIL_CLIP_BYTES = 102 * 1024;

const KLAVIYO_TAG = /\{\{[^}]*\}\}|\{%[^%]*%\}/g;

function countTags(text) {
  const counts = new Map();
  for (const tag of text.match(KLAVIYO_TAG) || []) counts.set(tag, (counts.get(tag) || 0) + 1);
  return counts;
}

// MJML silently drops Klaviyo tags it finds between mj-* elements (for example an {% if %} wrapped around
// an mj-section) with no error, even at validationLevel "strict". Wrap them in <mj-raw>. Compare the tags
// going into MJML with the tags coming out. Extra copies in the output (the hero's VML fallback) are fine.
function findDroppedTags(mjml, html) {
  const before = countTags(mjml);
  const after = countTags(html);
  const dropped = [];
  for (const [tag, n] of before) {
    if ((after.get(tag) || 0) < n) dropped.push(tag);
  }
  return dropped;
}

// Post-build checks on compiled HTML. `mjml` is the source that went into MJML. Returns { errors, warnings }.
function runChecks(html, brand, mjml) {
  const errors = [];
  const warnings = [];

  if (mjml) {
    const dropped = findDroppedTags(mjml, html);
    if (dropped.length) {
      errors.push(`MJML dropped Klaviyo tag(s), wrap them in <mj-raw>: ${dropped.join('  ')}`);
    }
  }

  // Klaviyo tags verified against Klaviyo's help center (message personalization reference).
  if (!/\{%\s*unsubscribe(_link)?\b/.test(html)) {
    errors.push('no {% unsubscribe %} or {% unsubscribe_link %} tag (Klaviyo requires one)');
  }
  if (!/\{\{\s*organization\.(full_address|street_address)\b/.test(html)) {
    errors.push('no {{ organization.full_address }} (physical address is required in commercial email)');
  }
  // Klaviyo: the bare {% unsubscribe %} tag outputs a full <a>, so it breaks inside an href.
  if (/href\s*=\s*"[^"]*\{%\s*unsubscribe\b(?!_)/.test(html)) {
    errors.push('bare {% unsubscribe %} inside an href, use {% unsubscribe_link %} there');
  }

  if (/\[%|\[\[|%\]|\]\]/.test(html)) {
    errors.push('leftover Nunjucks delimiters ([[ ]] or [% %]) in output');
  }

  if (brand !== REFERENCE_BRAND && PLACEHOLDER_URL.test(html)) {
    errors.push('output still contains a placehold.co or example.com URL');
  }

  const bytes = Buffer.byteLength(html, 'utf8');
  if (bytes > GMAIL_CLIP_BYTES) {
    warnings.push(`${(bytes / 1024).toFixed(1)} KB, Gmail clips messages over ~102 KB`);
  }
  if (/<img(?![^>]*\balt=)[^>]*>/i.test(html)) {
    warnings.push('an <img> has no alt attribute');
  }

  return { errors, warnings };
}

module.exports = { runChecks, findDroppedTags };
