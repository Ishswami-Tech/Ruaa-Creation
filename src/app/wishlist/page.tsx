"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { type Product } from "@/lib/products";
import { useCatalogue } from "@/components/CatalogueProvider";
import ProductCard from "@/components/ProductCard";
import { RecentlyViewed } from "@/components/bits";
import { waLink, site, formatINR } from "@/lib/site";

export default function WishlistPage() {
  const catalogue = useCatalogue();
  const { wishlist, ready } = useCart();
  const items = wishlist.map((slug) => catalogue.find((p) => p.slug === slug)).filter(Boolean) as Product[];
  const share = waLink(`My Ruaa Creation wishlist\n\n${items.map((p) => `• ${p.name} — ${formatINR(p.price)}\n  ${site.url}/product/${p.slug}/`).join("\n")}`);

  return (
    <div className="shop-ui">
      <div className="wrap" style={{ paddingTop: 40, paddingBottom: 48 }}>
        <div className="toolbar" style={{ marginBottom: 24 }}>
          <div><h1 className="shop-title" style={{ fontSize: 48 }}>Your wishlist</h1>
            <p style={{ margin: "6px 0 0", color: "var(--shop-muted)" }}>{ready ? `${items.length} saved ${items.length === 1 ? "piece" : "pieces"}` : "Loading…"} · saved on this device</p></div>
          {items.length > 0 && <a className="btn-shop wa" href={share} target="_blank" rel="noopener">Share wishlist on WhatsApp</a>}
        </div>
        {ready && items.length === 0 ? (
          <div className="empty stack" style={{ alignItems: "center" }}>
            <p style={{ fontSize: 18, margin: 0, color: "var(--shop-ink)" }}>Nothing saved yet.</p>
            <p style={{ margin: 0 }}>Tap the heart on any piece to save it here.</p>
            <Link href="/shop/" className="btn-shop dark">Browse the collection</Link>
          </div>
        ) : (
          <div className="product-grid">{items.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        )}
      </div>
      <RecentlyViewed />
    </div>
  );
}
