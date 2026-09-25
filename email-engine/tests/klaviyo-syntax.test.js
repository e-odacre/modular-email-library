const test = require('node:test');
const assert = require('node:assert');
const mjml2html = require('mjml');
const { renderEmail } = require('../scripts/lib/render');
const { runChecks, findDroppedTags } = require('../scripts/lib/checks');
const { loadTokenFile } = require('../scripts/lib/tokens');

const tokens = loadTokenFile('placeholder');
const FIXTURE = 'tests/fixtures/klaviyo-syntax.mjml';

// Every Klaviyo tag the fixture uses, verbatim.
const EXPECTED_TAGS = [
  '{% if person.first_name %}',
  '{{ person.first_name|default:"there" }}',
  '{% elif person.email %}',
  '{{ person.email }}',
  '{% else %}',
  '{% endif %}',
  '{% for item in event.extra.items %}',
  '{{ item.name }}',
  '{{ item.price|floatformat:2 }}',
  '{% endfor %}',
  '{{ event.extra.checkout_url }}',
  '{{ organization.name }}',
  '{{ event.extra.image_url }}',
  '{% web_view_link %}',
  '{{ event.extra.order_url }}',
  '{{ event.extra.order_id }}',
  '{% unsubscribe_link %}',
  '{% manage_preferences_link %}',
  '{{ organization.full_address }}',
];

test('Klaviyo tags survive the Nunjucks and MJML pipeline untouched', async () => {
  const { html } = await renderEmail(FIXTURE, tokens);
  for (const tag of EXPECTED_TAGS) {
    assert.ok(html.includes(tag), `missing from output: ${tag}`);
  }
});

test('conditionals wrapped in mj-raw keep their order around the sections they guard', async () => {
  const { html } = await renderEmail(FIXTURE, tokens);
  const order = ['{% if person.first_name %}', '{% elif person.email %}', '{% else %}', '{% endif %}'];
  const positions = order.map((tag) => html.indexOf(tag));
  assert.ok(positions.every((p) => p >= 0), 'all conditional tags present');
  assert.deepStrictEqual([...positions].sort((a, b) => a - b), positions, 'tags appear in source order');
  assert.ok(html.indexOf('Hi {{ person.first_name') > positions[0] && html.indexOf('Hi {{ person.first_name') < positions[1]);
});

test('the fixture passes every output check, including the dropped-tag check', async () => {
  const { html, mjml } = await renderEmail(FIXTURE, tokens);
  const { errors } = runChecks(html, 'placeholder', mjml);
  assert.deepStrictEqual(errors, []);
});

// The gotcha: MJML drops Klaviyo tags placed between mj-* elements, silently, even at validationLevel strict.
// If MJML ever changes this, this test fails and the mj-raw rule in the docs can be revisited.
const section = (t) => `<mjml><mj-body><mj-section><mj-column><mj-text>${t}</mj-text></mj-column></mj-section></mj-body></mjml>`;
const bare = `<mjml><mj-body>{% if person.first_name %}<mj-section><mj-column><mj-text>A</mj-text></mj-column></mj-section>{% endif %}</mj-body></mjml>`;
const wrapped = `<mjml><mj-body><mj-raw>{% if person.first_name %}</mj-raw><mj-section><mj-column><mj-text>A</mj-text></mj-column></mj-section><mj-raw>{% endif %}</mj-raw></mj-body></mjml>`;

test('MJML drops a bare {% if %} between mj-* elements without any error', async () => {
  const { html, errors } = await mjml2html(bare, { validationLevel: 'strict' });
  assert.ok(!html.includes('{% if'), 'expected the bare tag to be dropped');
  assert.deepStrictEqual(errors, [], 'MJML gives no warning, which is why the build check exists');
});

test('the dropped-tag check catches a bare {% if %} and passes the mj-raw version', async () => {
  const bareResult = await mjml2html(bare, { validationLevel: 'strict' });
  assert.deepStrictEqual(findDroppedTags(bare, bareResult.html), ['{% if person.first_name %}', '{% endif %}']);

  const wrappedResult = await mjml2html(wrapped, { validationLevel: 'strict' });
  assert.deepStrictEqual(findDroppedTags(wrapped, wrappedResult.html), []);
});

test('output checks flag a missing footer and a bare unsubscribe tag in an href', () => {
  const noFooter = runChecks('<p>hi</p>', 'placeholder');
  assert.ok(noFooter.errors.some((e) => e.includes('unsubscribe')));
  assert.ok(noFooter.errors.some((e) => e.includes('full_address')));

  const badHref = runChecks('<a href="{% unsubscribe %}">x</a>{{ organization.full_address }}', 'placeholder');
  assert.ok(badHref.errors.some((e) => e.includes('inside an href')));

  const goodHref = runChecks('<a href="{% unsubscribe_link %}">x</a>{{ organization.full_address }}', 'placeholder');
  assert.deepStrictEqual(goodHref.errors, []);
});
