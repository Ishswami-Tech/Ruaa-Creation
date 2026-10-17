import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { products, collections } from "@/lib/products";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/shop/", "/custom/", "/hand-painting/", "/about/", "/contact/", "/policies/", ...collections.map((c) => `/collections/${c.slug}/`), ...products.map((p) => `/product/${p.slug}/`)].map((path) => ({ url: `${site.url}${path}` }));
}
