import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { collections } from "@/lib/products";

import { getCatalogue, getCategories } from "@/lib/catalogue";
export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCatalogue();
  const categories = await getCategories();
  const paths = ["/", "/shop/", "/custom/", "/hand-painting/", "/about/", "/contact/", "/policies/", ...categories.map((c) => `/collections/${c.id}/`), ...collections.slice(6).map((c) => `/collections/${c.slug}/`), ...products.map((p) => `/product/${p.slug}/`)];
  return [...new Set(paths)].map((path) => ({ url: `${site.url}${path}` }));
}
