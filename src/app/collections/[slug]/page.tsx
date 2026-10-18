import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { collections } from "@/lib/products";
import { getCatalogue, getCategories, getStoreCollection } from "@/lib/catalogue";
import { pageMetadata, jsonLd, breadcrumbs, absoluteUrl } from "@/lib/seo";
import Catalog from "@/components/Catalog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = await getStoreCollection(slug);
  return c ? pageMetadata(c.name, c.blurb, `/collections/${slug}/`, c.image || "/share-image/") : { robots: { index: false } };
}

export default async function CollectionPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = await getStoreCollection(slug);
  if (!c) notFound();
  const base = (await getCatalogue()).filter(c.match);
  const more = [...(await getCategories()).map((x) => ({ slug: x.id, name: x.name })), ...collections.slice(6)];

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(breadcrumbs([{ name: "Home", path: "/" }, { name: "Shop", path: "/shop/" }, { name: c.name, path: `/collections/${slug}/` }])) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd({ "@context": "https://schema.org", "@type": "CollectionPage", name: c.name, url: absoluteUrl(`/collections/${slug}/`), mainEntity: { "@type": "ItemList", numberOfItems: base.length, itemListElement: base.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(`/product/${p.slug}/`) })) } }) }} />
      <nav aria-label="Breadcrumb" className="wrap breadcrumb shop-ui" style={{ paddingTop: 18, background: "transparent" }}>
        <Link href="/">Home</Link> / <Link href="/shop/">Shop</Link> / <span>{c.name}</span>
      </nav>
      <Catalog base={base} eyebrow={`${base.length} pieces`} title={c.name} blurb={c.blurb} heroImage={c.image} heroTone={c.tone} showTrust={false} />
      <section className="shop-ui" style={{ padding: "48px 0 72px" }}>
        <div className="wrap">
          <h2 className="shop-title" style={{ fontSize: 28, marginBottom: 16 }}>More collections</h2>
          <div className="chips">
            {more.filter((x) => x.slug !== c.slug).map((x) => (
              <Link key={x.slug} href={`/collections/${x.slug}/`} className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }}>{x.name}</Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
