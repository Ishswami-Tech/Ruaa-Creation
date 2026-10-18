import "server-only";
import { cache } from "react";
import { db, databaseConfigured } from "./db";
import { products as seed, collections, type Product, type Collection } from "./products";
import type { ManagedProduct, StoreCategory } from "./admin/types";

export const seedCategories: StoreCategory[] = collections.slice(0, 6).map((c, i) => ({ id: c.slug, name: seed.find((p) => c.match(p))!.category, description: c.blurb, image: c.image, position: i }));
export const getCatalogue = cache(async (): Promise<Product[]> => {
  if (!databaseConfigured()) return seed;
  const rows = await db().ruaaProduct.findMany({ where: { status: "published" }, include: { category: true }, orderBy: { createdAt: "desc" } });
  return rows.map((row) => ({ ...(row.data as unknown as Product), slug: row.slug, category: row.category.name, stock: row.stock }));
});
export const getCategories = cache(async (): Promise<StoreCategory[]> => databaseConfigured() ? db().ruaaCategory.findMany({ orderBy: { position: "asc" } }) : seedCategories);
export const getStoreCollection = cache(async (slug: string): Promise<Collection | undefined> => {
  const category = (await getCategories()).find((c) => c.id === slug);
  if (category) return { slug: category.id, name: category.name, blurb: category.description, image: category.image, tone: "#F3DDD6", match: (p) => p.category === category.name };
  return collections.slice(6).find((c) => c.slug === slug);
});
export async function getManagedProducts(): Promise<ManagedProduct[]> {
  const rows = await db().ruaaProduct.findMany({ include: { category: true }, orderBy: { updatedAt: "desc" } });
  return rows.map((row) => ({ ...(row.data as unknown as Product), slug: row.slug, category: row.category.name, stock: row.stock, status: row.status as ManagedProduct["status"], updatedAt: row.updatedAt.toISOString(), version: row.version }));
}
