import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { collectionForCategory } from "@/lib/products";
import { getCatalogue, getCategories } from "@/lib/catalogue";
import { pageMetadata, jsonLd, breadcrumbs, productStructuredData } from "@/lib/seo";
import ProductDetail from "./ProductDetail";
import ProductCard from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/bits";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const products = await getCatalogue();
  const p = products.find((p) => p.slug === slug);
  if (!p) return { robots: { index: false } };
  return pageMetadata(p.name, p.description, `/product/${p.slug}/`, p.images[0]);
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getCatalogue();
  const p = products.find((p) => p.slug === slug);
  if (!p) notFound();
  const category = (await getCategories()).find((c) => c.name === p.category);
  const col = category ? { slug: category.id, name: category.name } : collectionForCategory(p.category);
  const sameCat = products.filter((x) => x.slug !== p.slug && x.category === p.category);
  const pairs = products.filter((x) => x.slug !== p.slug && x.category !== p.category && x.occasions.some((o) => p.occasions.includes(o)));
  const related = [...sameCat.slice(0, 2), ...pairs.slice(0, 4 - Math.min(2, sameCat.length))].slice(0, 4);


  return (
    <div className="shop-ui">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(productStructuredData(p)) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name: col.name, path: col.slug ? `/collections/${col.slug}/` : "/shop/" }, { name: p.name, path: `/product/${p.slug}/` }])) }} />
      <div className="wrap">
        <nav aria-label="Breadcrumb" className="breadcrumb" style={{ padding: "20px 0" }}>
          <Link href="/">Home</Link> / <Link href={col.slug ? `/collections/${col.slug}/` : `/shop/?c=${encodeURIComponent(p.category)}`}>{col.name}</Link> / <span>{p.name}</span>
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
