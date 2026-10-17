const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { products, collections, getCollection, searchProducts, discountPct, collectionForCategory } = require('../src/lib/products.ts');

test('every product is complete, unique and has images on disk', () => {
  const slugs = new Set();
  for (const p of products) {
    assert.ok(!slugs.has(p.slug), `duplicate slug ${p.slug}`); slugs.add(p.slug);
    assert.ok(p.price > 0 && (!p.mrp || p.mrp > p.price), `bad price on ${p.slug}`);
    assert.ok(p.occasions.length > 0 && p.images.length > 0 && p.details.length > 0 && p.care.length > 0, `incomplete ${p.slug}`);
    for (const img of p.images) assert.ok(fs.existsSync(path.join(__dirname, '..', 'public', img)), `missing ${img}`);
  }
});
test('every collection resolves and is non-empty; every category has a collection', () => {
  for (const c of collections) {
    assert.equal(getCollection(c.slug), c);
    assert.ok(products.some(c.match), `empty collection ${c.slug}`);
  }
  for (const cat of new Set(products.map((p) => p.category))) assert.ok(collectionForCategory(cat), `no collection for ${cat}`);
});
test('search matches all words, ignores case and returns nothing for blank input', () => {
  assert.deepEqual(searchProducts('   '), []);
  assert.ok(searchProducts('ORGANZA saree').some((p) => p.slug === 'gulabi-organza-saree'));
  assert.equal(searchProducts('zebra print jeans').length, 0);
});
test('discount percentage is rounded from mrp', () => {
  assert.equal(discountPct({ price: 1290, mrp: 1590 }), 19);
  assert.equal(discountPct({ price: 450 }), 0);
});
