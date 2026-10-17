import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { collections, getCollection, products } from "@/lib/products";
import Catalog from "@/components/Catalog";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = getCollection(slug);
  return c ? { title: c.name, description: c.blurb } : {};
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = getCollection(slug);
  if (!c) notFound();
  const base = products.filter(c.match);

  return (
    <>
      <nav aria-label="Breadcrumb" className="wrap breadcrumb shop-ui" style={{ paddingTop: 18, background: "transparent" }}>
        <Link href="/">Home</Link> / <Link href="/shop/">Shop</Link> / <span>{c.name}</span>
      </nav>
      <Catalog base={base} eyebrow={`${base.length} pieces`} title={c.name} blurb={c.blurb} heroImage={c.image} heroTone={c.tone} showTrust={false} />
      <section className="shop-ui" style={{ padding: "48px 0 72px" }}>
        <div className="wrap">
          <h2 className="shop-title" style={{ fontSize: 28, marginBottom: 16 }}>More collections</h2>
          <div className="chips">
            {collections.filter((x) => x.slug !== c.slug).map((x) => (
              <Link key={x.slug} href={`/collections/${x.slug}/`} className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{x.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
