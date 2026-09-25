const test = require('node:test');
const assert = require('node:assert');
const { createEnv } = require('../scripts/lib/render');
const { loadTokenFile } = require('../scripts/lib/tokens');

const env = createEnv(loadTokenFile('placeholder'));
const render = (id, data, opts) => env.componentApi.render(id, data, opts).replace(/\s+/g, ' ');
const text = (t) => ({ component: 'content/text', data: { text: t } });
const widths = (html) => [...html.matchAll(/width="([\d.]+)%"/g)].map((m) => m[1]);

test('columns: reverse flips the DOM order and widths and sets rtl, so mobile shows the last column first', () => {
  const out = render('layout/columns', { columns: [text('A'), text('B')] }, { variant: 'split-60-40', settings: { mobileLayout: 'reverse' } });
  assert.ok(out.includes('direction="rtl"'));
  assert.deepStrictEqual(widths(out), ['40', '60']);
  assert.ok(out.indexOf('>B<') < out.indexOf('>A<'));
});

test('columns: stack keeps order and ltr, preserve wraps in a group', () => {
  const stack = render('layout/columns', { columns: [text('A'), text('B')] });
  assert.ok(!stack.includes('direction="rtl"') && !stack.includes('<mj-group>'));
  assert.ok(render('layout/columns', { columns: [text('A'), text('B')] }, { settings: { mobileLayout: 'preserve' } }).includes('<mj-group>'));
});

test('columns: the split must match the number of columns and add up to 100', () => {
  assert.throws(() => render('layout/columns', { columns: [text('A'), text('B'), text('C')] }), /split "50\/50" has 2 column\(s\) but 3 were given/);
  assert.throws(() => render('layout/columns', { columns: [text('A')] }, { settings: { split: '60/30' } }), /must add up to 100/);
});

test('columns: every named split variant works with the right column count', () => {
  const expected = { 'one-column': 1, default: 2, 'three-column': 3, 'four-column': 4, 'split-60-40': 2, 'sidebar-left': 2 };
  for (const [variant, n] of Object.entries(expected)) {
    const out = render('layout/columns', { columns: Array.from({ length: n }, (_, i) => text(`c${i}`)) }, { variant });
    assert.strictEqual((out.match(/<mj-column/g) || []).length, n, variant);
  }
});

test('columns: mobileColumns 2 and mobileAlignment add the classes the base CSS understands', () => {
  const out = render('layout/columns', { columns: [text('A'), text('B')] }, { settings: { mobileColumns: 2, mobileAlignment: 'center' } });
  assert.ok(out.includes('m-col-2') && out.includes('m-center'));
  const plain = render('layout/columns', { columns: [text('A'), text('B')] });
  assert.ok(!plain.includes('m-col-2') && !plain.includes('m-center'));
});

test('media-text: the image is first on mobile for both positions, text first with mobileLayout reverse', () => {
  const data = { media: { src: 'https://a.test/i.png', alt: 'x' }, content: [text('TEXT')] };
  const left = render('layout/media-text', data);
  assert.ok(!left.includes('direction="rtl"') && left.indexOf('<mj-image') < left.indexOf('TEXT'), 'image left, image first');

  const right = render('layout/media-text', data, { variant: 'image-right' });
  assert.ok(right.includes('direction="rtl"') && right.indexOf('<mj-image') < right.indexOf('TEXT'), 'image right on desktop, image first on mobile');
  assert.deepStrictEqual(widths(right), ['45', '55'], 'DOM order media then content, rtl puts the content on the left at 55%');

  const textFirst = render('layout/media-text', data, { settings: { mobileLayout: 'reverse' } });
  assert.ok(textFirst.indexOf('TEXT') < textFirst.indexOf('<mj-image'));
});

test('grid: items wrap into rows and a short last row keeps the same column width', () => {
  const out = render('layout/grid', { items: [1, 2, 3, 4, 5].map((n) => text(`item${n}`)) }, { variant: 'three-column' });
  assert.strictEqual((out.match(/<mj-section/g) || []).length, 2);
  assert.strictEqual((out.match(/<mj-column/g) || []).length, 5);
  assert.ok(widths(out).every((w) => w === '33.33'));
});

test('grid: mobileColumns 2 puts the class on every column', () => {
  const out = render('layout/grid', { items: [1, 2, 3, 4].map((n) => text(`i${n}`)) }, { settings: { mobileColumns: 2, columns: 4 } });
  assert.strictEqual((out.match(/m-col-2/g) || []).length, 4);
});

test('slots reject the wrong level with a clear message', () => {
  assert.throws(() => render('layout/section', { content: [{ component: 'layout/gap' }] }), /takes content-level components, but "layout\/gap" is section-level/);
  assert.throws(() => render('layout/wrapper', { content: [text('x')] }), /takes section-level components, but "content\/text" is content-level/);
});

test('container: side padding is worked out from the email width', () => {
  const out = render('layout/container', { content: [text('x')] });
  assert.ok(out.includes('60px'), '(600 - 480) / 2 = 60');
  assert.throws(() => render('layout/container', { content: [text('x')] }, { settings: { maxWidth: '50%' } }), /must be in px/);
});

test('hide settings add classes to the root element of both levels', () => {
  assert.ok(render('layout/spacer', {}, { settings: { hideOnMobile: true } }).includes('hide-mobile'));
  assert.ok(render('layout/gap', {}, { settings: { hideOnDesktop: true } }).includes('hide-desktop'));
});

test('dark-mode classes only go on blocks that sit on the brand surface or background', () => {
  assert.ok(render('layout/gap', {}).includes('dm-surface'));
  assert.ok(render('layout/gap', {}, { variant: 'page' }).includes('dm-bg'));
  assert.ok(!render('layout/gap', {}, { settings: { background: '#FF0000' } }).includes('dm-'));
});

test('content components validate their own rules', () => {
  const bad = (id, data, re) => assert.throws(() => render(id, data), re);
  bad('content/link', { label: 'click here', href: '/x' }, /not descriptive link text/);
  bad('content/social-links', { links: [{ network: 'tiktok', href: 'https://t.test' }] }, /no built-in icon/);
  bad('content/logo', { src: 'https://a.test/l.png' }, /alt is required/);
  bad('content/image', { image: { src: 'https://a.test/i.png' } }, /image\.alt is required/);
  bad('content/quote', { text: 'Great', role: 'Buyer' }, /role needs an author/);
  bad('content/button-group', { buttons: [{ label: 'One', href: '/a' }] }, /needs at least 2/);
  bad('content/list', { items: [] }, /needs at least 1/);
});

test('headings carry a real tag and explicit inline typography (no inherit)', () => {
  const out = render('content/heading', { text: 'Summer' }, { variant: 'display' });
  assert.ok(/<h1 style="[^"]*font-size:44px/.test(out));
  assert.ok(!/inherit/.test(out));
});

test('a decorative image gets an empty alt on purpose', () => {
  const out = render('content/image', { image: { src: 'https://a.test/i.png', decorative: true } });
  assert.ok(out.includes('alt=""'));
});

test('a Klaviyo tag inside a nested slot survives', () => {
  const out = render('layout/section', { content: [{ component: 'content/button', data: { label: 'View order', href: '{{ event.extra.order_url }}' } }] });
  assert.ok(out.includes('{{ event.extra.order_url }}'));
});

test('tracking-safe CTA: appends UTM with the right separator, before any anchor, and refuses to guess for Klaviyo tags', () => {
  const href = (data, opts) => (render('email/tracking-safe-cta', data, opts).match(/href="([^"]+)"/) || [])[1];
  assert.strictEqual(href({ label: 'Go', href: 'https://a.test/p?sort=new#top', utm: { source: 'klaviyo', medium: 'email' } }), 'https://a.test/p?sort=new&amp;utm_source=klaviyo&amp;utm_medium=email#top');
  assert.strictEqual(href({ label: 'Go', href: 'https://a.test/p', utm: { campaign: 'x' } }), 'https://a.test/p?utm_campaign=x');
  assert.strictEqual(href({ label: 'Go', href: 'https://a.test/p' }), 'https://a.test/p');
  assert.throws(() => href({ label: 'Go', href: '{{ event.extra.checkout_url }}', utm: { source: 'klaviyo' } }), /unknown whether it already has a query string/);
  assert.strictEqual(href({ label: 'Go', href: '{{ event.extra.checkout_url }}', utm: { source: 'klaviyo' } }, { settings: { separator: '&' } }), '{{ event.extra.checkout_url }}&amp;utm_source=klaviyo');
  assert.throws(() => href({ label: 'Go', href: 'https://a.test/p?utm_source=x', utm: { medium: 'email' } }), /already has utm_/);
});

test('outlook-safe button: VML for Outlook, a normal link for everyone else, radius as a percentage of height', () => {
  const out = render('email/outlook-safe-button', { label: 'Shop', href: 'https://a.test' });
  assert.ok(out.includes('<v:roundrect') && out.includes('<w:anchorlock/>') && out.includes('<!--[if mso]>') && out.includes('<!--[if !mso]><!-->'));
  assert.ok(out.includes('arcsize="8%"'), '4px radius on a 48px button');
  assert.throws(() => render('email/outlook-safe-button', { label: 'Shop', href: 'https://a.test' }, { settings: { width: '50%' } }), /must be in px/);
});

test('preheader falls back to the Klaviyo preview text tag, and footers always keep the compliance tags', () => {
  assert.ok(render('email/preheader', {}).includes('{% render_variable preview_text %}'));
  assert.ok(render('email/preheader', { text: 'Hello there' }).includes('Hello there'));
  for (const variant of ['default', 'rich', 'minimal']) {
    const out = render('email/footer', {}, { variant });
    for (const tag of ['{% unsubscribe_link %}', '{% manage_preferences_link %}', '{{ organization.full_address }}']) assert.ok(out.includes(tag), `${variant}: ${tag}`);
  }
});

test('mobile-only and desktop-only wrap sections with the right visibility class', () => {
  const inner = [{ component: 'layout/gap' }];
  assert.ok(render('email/mobile-only', { content: inner }).includes('hide-desktop'));
  assert.ok(render('email/desktop-only', { content: inner }).includes('hide-mobile'));
});

test('fallback content refuses nested conditional comments', () => {
  assert.throws(() => render('email/fallback-content', { primary: '<!--[if mso]>x<![endif]-->', fallback: [text('x')] }), /cannot be nested/);
});
