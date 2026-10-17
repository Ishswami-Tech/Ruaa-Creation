import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collectionForCategory, getProduct, products } from "@/lib/products";
import { site } from "@/lib/site";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/bits";

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) return {};
  return { title: p.name, description: p.description, openGraph: { images: [p.images[0]] } };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p) notFound();
  const col = collectionForCategory(p.category);
  const sameCat = products.filter((x) => x.slug !== p.slug && x.category === p.category);
  const pairs = products.filter((x) => x.slug !== p.slug && x.category !== p.category && x.occasions.some((o) => p.occasions.includes(o)));
  const related = [...sameCat.slice(0, 2), ...pairs.slice(0, 4 - Math.min(2, sameCat.length))].slice(0, 4);

  const jsonLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, description: p.description,
    image: p.images.map((i) => site.url + i), brand: { "@type": "Brand", name: site.name }, category: p.category,
    offers: { "@type": "Offer", priceCurrency: "INR", price: p.price, availability: p.stock === 0 ? "https://schema.org/OutOfStock" : "https://schema.org/InStock", url: `${site.url}/product/${p.slug}/` },
  };

  return (
    <div className="shop-ui">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb" style={{ padding: "20px 0" }}>
          <Link href="/">Home</Link> / <Link href={`/collections/${col.slug}/`}>{col.name}</Link> / <span>{p.name}</span>
        </nav>
        <ProductDetail p={p} />
      </div>
      <section style={{ background: "var(--shop-soft)", padding: "64px 0" }}>
        <div className="wrap">
          <h2 className="shop-title" style={{ fontSize: 34, marginBottom: 24 }}>Complete the look</h2>
          <div className="product-grid">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
        </div>
      </section>
      <RecentlyViewed exclude={p.slug} />
    </div>
  );
}
