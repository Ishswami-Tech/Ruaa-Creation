const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2021, module: ts.ModuleKind.CommonJS } }).outputText, filename);
const { site } = require('../src/lib/site.ts');
const { products } = require('../src/lib/products.ts');
const { pageMetadata, privateMetadata, productStructuredData, breadcrumbs, jsonLd, absoluteUrl, websiteStructuredData } = require('../src/lib/seo.ts');

test('public metadata has one canonical origin and complete sharing metadata', () => {
  const data = pageMetadata('Sarees', 'Explore our sarees.', '/collections/sarees/');
  assert.equal(data.alternates.canonical, `${site.url}/collections/sarees/`);
  assert.equal(data.openGraph.url, data.alternates.canonical);
  assert.equal(data.twitter.card, 'summary_large_image');
  assert.ok(data.openGraph.images[0].url.startsWith(site.url));
  assert.equal(new URL(site.url).protocol, 'https:');
});
test('private screens are explicitly excluded from indexing', () => {
  for (const name of ['Your bag','Checkout','Account','Wishlist','Search']) {
    const data = privateMetadata(name);
    assert.equal(data.robots.index, false);
    assert.equal(data.alternates.canonical, null);
  }
});
test('product schema reflects actual catalogue prices, photos and availability', () => {
  const data = productStructuredData(products[0]);
  assert.equal(data.offers.price, products[0].price);
  assert.equal(data.offers.priceCurrency, 'INR');
  assert.equal(data.image[0], absoluteUrl(products[0].images[0]));
  assert.equal(productStructuredData({...products[0],stock:0}).offers.availability, 'https://schema.org/OutOfStock');
  assert.equal(data.aggregateRating, undefined);
});
test('structured data escapes script boundaries and does not invent private business details', () => {
  const name = '</script><script>alert(1)</script>';
  const encoded = jsonLd({name});
  assert.ok(!encoded.includes('<'));
  assert.equal(JSON.parse(encoded).name, name);
  const organization = websiteStructuredData()['@graph'][0];
  assert.equal(organization.address, undefined);
  assert.equal(organization.founder, undefined);
  const trail = breadcrumbs([{name:'Home',path:'/'},{name:'Shop',path:'/shop/'}]);
  assert.deepEqual(trail.itemListElement.map(x=>x.position),[1,2]);
});
