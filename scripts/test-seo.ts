import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { site } from "../src/lib/site";
import { products } from "../src/lib/products";

const decode = (text: string) => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&#39;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const tags = (html: string, tag: string) => [...html.matchAll(new RegExp(`<${tag}\\b([^>]*)>`, "gi"))].map((match) => Object.fromEntries([...match[1].matchAll(/([\w:-]+)="([^"]*)"/g)].map((attribute) => [attribute[1], decode(attribute[2])])));
async function main() {
  const port = process.env.SEO_PORT || "3200";
  const base = `http://127.0.0.1:${port}`;
  const server = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", port], { env: { ...process.env, NODE_ENV: "production", DATABASE_URL: "", DIRECT_URL: "", VERCEL_ENV: "production" }, stdio: "ignore" });
  let exited = false; server.on("exit", () => { exited = true; });
  const get = (path: string) => fetch(base + path, { headers: { "User-Agent": "Googlebot" }, redirect: "manual" });
  try {
    for (let i = 0; i < 120; i++) {
      try { if ((await get("/robots.txt")).ok) break; } catch {}
      if (exited || i === 119) throw new Error("SEO test server did not start. Run npm run build first.");
      await new Promise((r) => setTimeout(r, 500));
    }
    const robots = await (await get("/robots.txt")).text();
    assert.ok(robots.includes(`Sitemap: ${site.url}/sitemap.xml`));
    assert.ok(robots.includes("Allow: /api/media/"));
    assert.ok(!robots.includes("Disallow: /\n"), "Production must be crawlable");
    const sitemap = await (await get("/sitemap.xml")).text();
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => decode(match[1]));
    assert.ok(urls.length > products.length);
    assert.equal(new Set(urls).size, urls.length);
    const titles = new Set(); const images = new Set<string>();
    for (const url of urls) {
      assert.equal(new URL(url).origin, new URL(site.url).origin);
      assert.equal(new URL(url).search, "");
      assert.ok(!/\/(?:admin|cart|checkout|account|wishlist|search)\//.test(new URL(url).pathname));
      const path = new URL(url).pathname;
      const response = await get(path); assert.equal(response.status, 200, `${path} status`);
      const html = await response.text();
      const meta = tags(html, "meta");
      const canonical = tags(html, "link").filter((link) => link.rel === "canonical");
      assert.deepEqual(canonical.map((link) => link.href), [url], `${path} canonical`);
      const title = decode(html.match(/<title>([^<]+)<\/title>/)?.[1] || "");
      assert.ok(title && !titles.has(title), `${path} needs a unique title`); titles.add(title);
      assert.ok(meta.find((tag) => tag.name === "description")?.content.length, `${path} description`);
      assert.equal(meta.find((tag) => tag.property === "og:url")?.content, url, `${path} sharing URL`);
      assert.ok(meta.find((tag) => tag.property === "og:image")?.content.startsWith(site.url), `${path} sharing image`);
      assert.equal(meta.find((tag) => tag.name === "twitter:card")?.content, "summary_large_image");
      assert.ok(!meta.find((tag) => tag.name === "robots")?.content.includes("noindex"), `${path} should be indexable`);
      assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path} needs one H1`);
      for (const image of tags(html, "img")) {
        assert.ok("alt" in image, `${path} has an image without alternative text`);
        if (image.src?.startsWith("/")) images.add(image.src);
      }
      const structured = [...html.matchAll(/<script[^>]+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
      if (path === "/") assert.ok(structured.some((data) => data["@graph"]?.some((item: { "@type": string }) => item["@type"] === "Organization")));
      if (path.startsWith("/product/")) {
        const data = structured.find((data) => data["@type"] === "Product");
        const product = products.find((p) => path === `/product/${p.slug}/`)!;
        assert.equal(data?.offers.price, product.price); assert.equal(data?.offers.url, url);
        assert.ok(structured.some((data) => data["@type"] === "BreadcrumbList"));
      }
    }
    for (const path of ["/cart/", "/checkout/", "/checkout/success/", "/account/", "/wishlist/", "/search/?q=saree", "/admin/", "/admin/login/"]) {
      const response = await get(path); assert.equal(response.status, 200);
      const meta = tags(await response.text(), "meta");
      assert.ok(meta.find((tag) => tag.name === "robots")?.content.includes("noindex"), `${path} must not be indexed`);
    }
    for (const path of ["/not-a-real-page/", "/product/not-a-real-product/", "/collections/not-a-real-collection/"]) assert.equal((await get(path)).status, 404, path);
    for (const image of images) assert.equal((await get(image)).status, 200, image);
    const share = await get("/share-image/"); assert.equal(share.status, 200); assert.match(share.headers.get("content-type") || "", /image\/png/);
    const manifest = await (await get("/manifest.webmanifest")).json(); assert.equal(manifest.name, site.name);
    console.log(`PASS: ${urls.length} public pages: canonical URLs, unique titles, descriptions, social tags, headings, image alt text and structured data`);
    console.log(`PASS: private noindex, real 404s, robots, sitemap, ${images.size} image URLs, sharing image and web manifest`);
  } finally { server.kill(); }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "SEO check failed."); process.exitCode = 1; });
