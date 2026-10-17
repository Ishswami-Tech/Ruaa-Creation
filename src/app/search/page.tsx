"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { searchProducts } from "@/lib/products";
import Catalog from "@/components/Catalog";
import { YouMayLike } from "@/components/bits";

function Results() {
  const q = useSearchParams().get("q") ?? "";
  const hits = searchProducts(q);
  if (hits.length === 0)
    return (
      <div className="shop-ui">
        <section className="wrap stack center" style={{ padding: "72px 24px", alignItems: "center" }}>
          <h1 className="shop-title" style={{ fontSize: 40 }}>No results for &ldquo;{q}&rdquo;</h1>
          <p style={{ color: "var(--shop-muted)", margin: 0 }}>Try a simpler word like &ldquo;saree&rdquo;, &ldquo;blouse&rdquo; or &ldquo;lehenga&rdquo; — or ask us on WhatsApp, we may be able to make it.</p>
          <div className="row" style={{ justifyContent: "center" }}><Link href="/shop/" className="btn-shop dark">Browse all</Link><Link href="/custom/" className="btn-shop ghost">Request a custom piece</Link></div>
        </section>
        <section className="wrap" style={{ paddingBottom: 72 }}><h2 className="shop-title" style={{ fontSize: 28, marginBottom: 20 }}>You may like</h2><YouMayLike exclude={[]} /></section>
      </div>
    );
  return <Catalog base={hits} eyebrow="Search results" title={`“${q}”`} blurb={`${hits.length} matching ${hits.length === 1 ? "piece" : "pieces"}`} showTrust={false} />;
}

export default function SearchPage() {
  return <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Searching…</div>}><Results /></Suspense>;
}
