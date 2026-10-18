import assert from "node:assert/strict";
import { randomUUID, randomBytes, randomInt } from "node:crypto";
import { readFile } from "node:fs/promises";
import { spawn } from "node:child_process";
import { resolve } from "node:path";
import { Client } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/admin/security";

async function main() {
  const connectionString = process.env.TEST_DATABASE_URL;
  if (!connectionString) throw new Error("Set TEST_DATABASE_URL to an isolated database with a name ending in _test. Production DATABASE_URL is never used.");
  const url = new URL(connectionString);
  if (!decodeURIComponent(url.pathname).endsWith("_test")) throw new Error("Refusing to run: the test database name must end in _test.");
  const sql = new Client({ connectionString });
  await sql.connect();
  const tables = await sql.query('SELECT to_regclass(\'public."RuaaCategory"\') as name');
  if (!tables.rows[0].name) await sql.query(await readFile(resolve("prisma/migrations/20261017000000_ruaa_admin/migration.sql"), "utf8"));
  await sql.end();
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  const suffix = randomUUID().slice(0, 8);
  const categoryId = `qa-${suffix}`; const slug = `qa-product-${suffix}`; const email = `qa-${suffix}@ruaa.test`;
  const password = randomBytes(32).toString("hex");
  const account = await db.ruaaAdmin.create({ data: { email, passwordHash: hashPassword(password) } });
  const port = process.env.TEST_PORT || "3199";
  const base = `http://127.0.0.1:${port}`;
  let cookie = ""; let mediaId = ""; let orderId = ""; let serverFailed = false;
  const server = spawn(process.execPath, [resolve("node_modules/next/dist/bin/next"), "start", "--hostname", "127.0.0.1", "--port", port], { env: { ...process.env, NODE_ENV: "production", DATABASE_URL: connectionString, DIRECT_URL: "" }, stdio: ["ignore", "pipe", "pipe"] });
  server.on("exit", () => { serverFailed = true; });
  server.stdout?.on("data", () => {});
  server.stderr?.on("data", () => {});
  async function call(path: string, method = "GET", body?: unknown, authenticated = true, origin = base) {
    const response = await fetch(base + path, { method, headers: { ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }), Origin: origin, ...(authenticated && cookie ? { Cookie: cookie } : {}) }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined, redirect: "manual" });
    const text = await response.text();
    let data; try { data = JSON.parse(text); } catch { data = text; }
    return { response, data, status: response.status };
  }
  try {
    for (let i = 0; i < 120; i++) {
      try { if ((await fetch(base + "/admin/login/")).ok) break; } catch {}
      if (serverFailed || i === 119) throw new Error("Test server did not start. Run npm run build first.");
      await new Promise((r) => setTimeout(r, 500));
    }
    const anonymous = await call("/api/admin/products/", "GET", undefined, false);
    assert.equal(anonymous.status, 401, `Anonymous products: ${JSON.stringify(anonymous.data)}`);
    assert.equal((await call("/api/admin/categories/", "POST", {}, false, "https://other.example")).status, 403);
    const wrong = await call("/api/admin/session/", "POST", { email, password: "incorrect" }, false);
    assert.equal(wrong.status, 401, `Wrong password: ${JSON.stringify(wrong.data)}`);
    const login = await call("/api/admin/session/", "POST", { email, password }, false);
    assert.equal(login.status, 200, `Login: ${JSON.stringify(login.data)}`);
    const setCookie = login.response.headers.get("set-cookie")!;
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=strict/i); assert.match(setCookie, /Secure/i);
    cookie = setCookie.split(";")[0];
    console.log("PASS: authentication, session cookie and cross-origin protection");
    const category = { id: categoryId, name: `QA Collection ${suffix}`, description: "Integration test collection", image: "/images/saree.png", position: 99 };
    assert.equal((await call("/api/admin/categories/", "POST", category)).status, 200);
    const image = new FormData();
    image.set("image", new File([new Uint8Array(await readFile(resolve("public/images/logo.jpg")))], "test.jpg", { type: "image/jpeg" }));
    const uploaded = await call("/api/admin/media/", "POST", image);
    assert.equal(uploaded.status, 200, JSON.stringify(uploaded.data)); mediaId = uploaded.data.id;
    const media = await fetch(base + uploaded.data.url); assert.equal(media.status, 200); assert.equal(media.headers.get("content-type"), "image/webp");
    const invalidImage = new FormData(); invalidImage.set("image", new File(["<script>bad</script>"], "fake.png", { type: "image/png" }));
    assert.equal((await call("/api/admin/media/", "POST", invalidImage)).status, 400);
    const product = { slug, name: `QA Product ${suffix}`, category: category.name, price: 1000, fabric: "Cotton", tone: "#F3DDD6", images: [uploaded.data.url], occasions: ["Everyday"], stock: 2, description: "A test product used only by isolated integration checks.", details: ["Test detail"], care: ["Hand wash"], status: "draft", version: 0 };
    assert.equal((await call("/api/admin/products/", "POST", product)).status, 200);
    assert.equal((await fetch(`${base}/product/${slug}/`)).status, 404);
    assert.equal((await call("/api/admin/products/", "POST", { ...product, status: "published", version: 1 })).status, 200);
    assert.equal((await fetch(`${base}/product/${slug}/`)).status, 200);
    assert.equal((await call("/api/admin/products/", "POST", { ...product, status: "published", version: 1 })).status, 409);
    assert.equal((await call("/api/admin/categories/", "DELETE", { id: categoryId })).status, 409);
    assert.equal((await call("/api/admin/media/", "DELETE", { id: mediaId })).status, 409);
    console.log("PASS: photo upload/decoding, product publish, live URL, stale edits and referenced media/category protection");
    const order = { requestKey: randomUUID(), customer: { name: "Test Customer", phone: `9${String(randomInt(0, 1000000000)).padStart(9, "0")}`, email: "", address: "12 Test Street", city: "Pune", state: "Maharashtra", pin: "411001", notes: "Isolated test only" }, lines: [{ slug, options: "Free size", qty: 1 }], payment: "upi", coupon: null, expectedTotal: 1099 };
    assert.equal((await call("/api/orders/", "POST", { ...order, expectedTotal: 1 }, false)).status, 409);
    const placed = await call("/api/orders/", "POST", order, false);
    assert.equal(placed.status, 201, JSON.stringify(placed.data)); orderId = placed.data.id;
    const retried = await call("/api/orders/", "POST", order, false); assert.equal(retried.status, 200); assert.equal(retried.data.id, orderId);
    const update = { id: orderId, status: "confirmed", paymentStatus: "unpaid", tracking: "", notes: "Test confirmation", version: 1 };
    const confirmations = await Promise.all([call("/api/admin/orders/", "POST", update), call("/api/admin/orders/", "POST", update)]);
    assert.deepEqual(confirmations.map((r) => r.status).sort(), [200, 409]);
    assert.equal((await db.ruaaProduct.findUniqueOrThrow({ where: { slug } })).stock, 1);
    assert.equal((await call("/api/admin/orders/", "POST", { ...update, status: "cancelled", version: 2 })).status, 200);
    assert.equal((await db.ruaaProduct.findUniqueOrThrow({ where: { slug } })).stock, 2);
    assert.equal((await call("/api/admin/orders/", "POST", { ...update, version: 3 })).status, 400);
    console.log("PASS: server pricing, duplicate retries, concurrent confirmation, atomic stock deduction and cancellation restoration");
    assert.equal((await call("/api/admin/products/", "DELETE", { slug })).status, 200);
    assert.equal((await fetch(`${base}/product/${slug}/`)).status, 404);
    assert.equal((await call("/api/admin/session/", "DELETE")).status, 200);
    assert.equal((await call("/api/admin/products/")).status, 401);
    console.log("PASS: archive visibility and logout revocation");
  } finally {
    server.kill();
    // Remove only the fixtures owned by this run, in the explicitly named test database.
    if (orderId) await db.ruaaOrder.deleteMany({ where: { id: orderId } });
    await db.ruaaProduct.deleteMany({ where: { slug } });
    await db.ruaaCategory.deleteMany({ where: { id: categoryId } });
    if (mediaId) await db.ruaaMedia.deleteMany({ where: { id: mediaId } });
    await db.ruaaAudit.deleteMany({ where: { adminId: account.id } });
    await db.ruaaAdmin.delete({ where: { id: account.id } });
    await db.$disconnect();
  }
}
main().catch((error) => { console.error(error instanceof Error ? error.message : "Integration check failed."); process.exitCode = 1; });
