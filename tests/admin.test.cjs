const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.CommonJS } }).outputText, filename);
const { hashPassword, verifyPassword, tokenHash, sameOrigin } = require('../src/lib/admin/security.ts');
const { productSchema, checkoutSchema, imageSchema } = require('../src/lib/admin/validation.ts');
const { stockEffect } = require('../src/lib/admin/order-state.ts');
const { restoreCart, restoreOrderLines } = require('../src/lib/cart.ts');
const { products } = require('../src/lib/products.ts');

test('admin passwords use unique salted hashes and reject incorrect passwords', () => {
  const password = 'A long test-only password';
  const hash = hashPassword(password);
  assert.notEqual(hash, hashPassword(password));
  assert.equal(verifyPassword(password, hash), true);
  assert.equal(verifyPassword('incorrect', hash), false);
  assert.equal(verifyPassword(password, 'malformed'), false);
  assert.equal(tokenHash('session').length, 64);
});
test('cross-origin mutations and requests without Origin are rejected', () => {
  assert.equal(sameOrigin(new Request('https://ruaa.example/api/admin/products/', { headers: { origin: 'https://ruaa.example' } })), true);
  for (const origin of ['https://evil.example', 'null', 'https://ruaa.example.evil.com']) assert.equal(sameOrigin(new Request('https://ruaa.example/api/admin/products/', { headers: { origin } })), false);
  assert.equal(sameOrigin(new Request('https://ruaa.example/api/admin/products/')), false);
});
test('product validation rejects unsafe photos, invalid prices, stock and malformed variants', () => {
  const product = { ...products[0], status: 'published', version: 1 };
  assert.equal(productSchema.safeParse(product).success, true);
  for (const change of [{ price: -10 }, { stock: -1 }, { stock: 1.5 }, { mrp: 1 }, { images: ['javascript:alert(1)'] }, { images: ['/images/../private.jpg'] }, { slug: '../etc' }, { occasions: ['anything'] }]) assert.equal(productSchema.safeParse({ ...product, ...change }).success, false);
  assert.equal(imageSchema.safeParse('/api/media/11111111-1111-4111-8111-111111111111/').success, true);
});
test('catalogue changes control bag prices, new products and out-of-stock products', () => {
  const catalogue = [{ ...products[8], slug: 'new-admin-product', price: 1200, stock: 2 }];
  const lines = [{ slug: 'new-admin-product', options: 'Size M', qty: 9, unitPrice: 1 }];
  assert.equal(restoreCart(lines, catalogue)[0].unitPrice, 1200);
  assert.equal(restoreCart(lines, catalogue)[0].qty, 2);
  assert.deepEqual(restoreCart(lines, [{ ...catalogue[0], stock: 0 }]), []);
});
test('stock is deducted once at confirmation and restored once on cancellation', () => {
  assert.equal(stockEffect('requested', 'confirmed'), -1);
  assert.equal(stockEffect('confirmed', 'confirmed'), 0);
  assert.equal(stockEffect('confirmed', 'in_progress'), 0);
  assert.equal(stockEffect('in_progress', 'shipped'), 0);
  assert.equal(stockEffect('shipped', 'delivered'), 0);
  assert.equal(stockEffect('confirmed', 'cancelled'), 1);
  assert.equal(stockEffect('requested', 'cancelled'), 0);
  assert.throws(() => stockEffect('requested', 'delivered'));
  assert.throws(() => stockEffect('cancelled', 'confirmed'));
  assert.throws(() => stockEffect('delivered', 'cancelled'));
});
test('order history preserves recorded prices and archived product snapshots', () => {
  const snapshot = { slug: 'archived-product', name: 'Original name', options: 'Free size', image: '/images/saree.png', tone: '#F3DDD6', unitPrice: 900, qty: 2 };
  assert.equal(restoreOrderLines([snapshot])[0].unitPrice, 900);
  assert.equal(restoreOrderLines([snapshot])[0].name, 'Original name');
  assert.deepEqual(restoreOrderLines([{ ...snapshot, image: 'https://untrusted.example/x' }]), []);
});
test('checkout requires valid customer details, request key and bounded quantities', () => {
  const request = { requestKey: '11111111-1111-4111-8111-111111111111', lines: [{ slug: 'test-product', options: 'Free size', qty: 1 }], customer: { name: 'Test Customer', phone: '9999999999', email: '', address: 'Test street 12', city: 'Pune', state: 'Maharashtra', pin: '411001', notes: '' }, payment: 'upi', coupon: null, expectedTotal: 1000 };
  assert.equal(checkoutSchema.safeParse(request).success, true);
  assert.equal(checkoutSchema.safeParse({ ...request, requestKey: 'guessable' }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...request, lines: [{ ...request.lines[0], qty: 1000 }] }).success, false);
  assert.equal(checkoutSchema.safeParse({ ...request, customer: { ...request.customer, phone: 'bad' } }).success, false);
});
