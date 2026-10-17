const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
// Load the same TypeScript business functions used by the browser.
require.extensions['.ts'] = (module, filename) => {
  const source = fs.readFileSync(filename, 'utf8');
  module._compile(ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { restoreCart, quantity } = require('../src/lib/cart.ts');
const { totals } = require('../src/lib/pricing.ts');

test('corrupt storage and removed products cannot break the bag', () => {
  for (const value of [null, {}, 'bad', [null, {}, { slug: 'missing', options: '', qty: 1 }]]) assert.deepEqual(restoreCart(value), []);
});
test('stored prices and display data are replaced with catalogue values', () => {
  const [line] = restoreCart([{ slug: 'gulabi-organza-saree', options: 'Colour: Gulabi pink · Blouse: ready, size M', qty: 2, unitPrice: 1, name: 'fake', image: 'https://example.com' }]);
  assert.equal(line.unitPrice, 7400);
  assert.equal(line.name, 'Gulabi Organza Saree');
  assert.equal(line.image, '/images/saree.png');
  assert.equal(line.qty, 2);
});
test('invalid variants are rejected, duplicates merged and quantities bounded', () => {
  assert.deepEqual(restoreCart([{ slug: 'zari-sweetheart-blouse', options: 'Size INVALID', qty: 1 }]), []);
  const item = { slug: 'silk-latkan-tassel-pair', options: 'Free size', qty: 15 };
  assert.equal(restoreCart([item, item])[0].qty, 20);
  assert.deepEqual([quantity(NaN), quantity(-1), quantity(2.9), quantity(Infinity)], [1, 1, 2, 1]);
});
test('shipping is calculated after discount and empty bags have no COD charge', () => {
  assert.deepEqual(totals(0, null, true), { discount: 0, shipping: 0, codFee: 0, total: 0 });
  assert.equal(totals(3000, 'RUAA10', false).shipping, 99);
  assert.equal(totals(2999, null, false).shipping, 0);
  assert.equal(totals(1000, 'INVALID', true).total, 1148);
});
