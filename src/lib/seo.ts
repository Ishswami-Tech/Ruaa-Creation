import type { Metadata } from "next";
import { site } from "./site";
import type { Product } from "./products";

export const previewDeployment = process.env.VERCEL_ENV === "preview";
export const absoluteUrl = (path = "/") => new URL(path, site.url).href;
export const jsonLd = (data: unknown) => JSON.stringify(data).replace(/</g, "\\u003c");
export function pageMetadata(title: string, description: string, path: string, image = "/share-image/"): Metadata {
  const fullTitle = `${title} · ${site.name}`;
  return {
    title, description, alternates: { canonical: absoluteUrl(path) },
    robots: previewDeployment ? { index: false, follow: false } : { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
    openGraph: { type: "website", title: fullTitle, description, url: absoluteUrl(path), siteName: site.name, locale: "en_IN", images: [{ url: absoluteUrl(image), alt: image === "/share-image/" ? site.name : title }] },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [absoluteUrl(image)] },
  };
}
export const privateMetadata = (title: string): Metadata => ({ title, robots: { index: false, follow: false, noarchive: true }, alternates: { canonical: null } });
export function breadcrumbs(items: { name: string; path: string }[]) {
  return { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, item: absoluteUrl(item.path) })) };
}
export function productStructuredData(p: Product) {
  const url = absoluteUrl(`/product/${p.slug}/`);
  return {
    "@context": "https://schema.org", "@type": "Product", "@id": `${url}#product`, name: p.name, description: p.description,
    productID: p.slug, category: p.category, material: p.fabric, image: p.images.map(absoluteUrl), url,
    brand: { "@type": "Brand", name: site.name },
    offers: { "@type": "Offer", url, priceCurrency: "INR", price: p.price, availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", itemCondition: "https://schema.org/NewCondition", seller: { "@id": absoluteUrl("/#organization") } },
  };
}
export function websiteStructuredData() {
  return { "@context": "https://schema.org", "@graph": [
    { "@type": "Organization", "@id": absoluteUrl("/#organization"), name: site.name, url: absoluteUrl("/"), logo: { "@type": "ImageObject", url: absoluteUrl("/images/logo.jpg") }, sameAs: [`https://www.instagram.com/${site.instagram}/`] },
    { "@type": "WebSite", "@id": absoluteUrl("/#website"), name: site.name, url: absoluteUrl("/"), description: site.description, inLanguage: "en-IN", publisher: { "@id": absoluteUrl("/#organization") } },
  ] };
}
