import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { products, collections } from "../src/lib/products";

async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env first.");
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  try {
    await client.$transaction(async (tx) => {
      for (let i = 0; i < 6; i++) {
        const c = collections[i];
        const name = products.find(c.match)!.category;
        await tx.ruaaCategory.upsert({ where: { id: c.slug }, create: { id: c.slug, name, description: c.blurb, image: c.image, position: i }, update: {} });
      }
      const categories = await tx.ruaaCategory.findMany();
      for (const p of products) {
        const categoryId = categories.find((c) => c.name === p.category)?.id;
        if (!categoryId) continue;
        await tx.ruaaProduct.upsert({ where: { slug: p.slug }, create: { slug: p.slug, categoryId, status: "published", stock: p.stock ?? 0, data: p }, update: {} });
      }
    }, { timeout: 30000 });
    console.log("Starter catalogue imported. Existing product edits were preserved.");
  } finally { await client.$disconnect(); }
}
main().catch(() => { console.error("Catalogue import failed. Check the database connection and migration."); process.exitCode = 1; });
