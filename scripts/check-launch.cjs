const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
require.extensions['.ts'] = (module, filename) => {
  module._compile(ts.transpileModule(fs.readFileSync(filename, 'utf8'), { compilerOptions: { target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.CommonJS } }).outputText, filename);
};
const { site } = require('../src/lib/site.ts');
const { products } = require('../src/lib/products.ts');
const problems = [];
for (const [field, placeholder] of Object.entries({ whatsapp: '919999999999', whatsappDisplay: '+91 99999 99999' })) {
  if (!site[field] || site[field] === placeholder) problems.push(`Set the real ${field} in src/lib/site.ts.`);
}
if (!/^\d{10,15}$/.test(site.whatsapp)) problems.push('WhatsApp must contain 10–15 digits including the country code.');
if (!site.url.startsWith('https://')) problems.push('Use an HTTPS production domain.');
const illustrations = new Set(['/images/saree.png', '/images/blouse.png', '/images/tassels.png', '/images/western.png', '/images/traditional.png', '/images/painting.png']);
for (const product of products) {
  if (illustrations.has(product.images[0])) problems.push(`Replace the sample primary image for ${product.slug}.`);
  for (const image of product.images) if (!fs.existsSync(path.join(__dirname, '..', 'public', image))) problems.push(`Missing image: ${image}`);
}
if (problems.length) {
  console.error('Launch checks failed:\n' + problems.map((p) => `- ${p}`).join('\n'));
  process.exitCode = 1;
} else console.log('Configuration checks passed. Complete the manual release checks in PRODUCTION-READINESS.md.');
