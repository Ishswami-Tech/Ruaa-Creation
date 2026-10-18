import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { previewDeployment } from "@/lib/seo";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return { rules: previewDeployment ? { userAgent: "*", disallow: "/" } : { userAgent: "*", allow: ["/", "/api/media/"], disallow: ["/api/admin/", "/api/orders/", "/api/catalogue/"] }, sitemap: `${site.url}/sitemap.xml` };
}
