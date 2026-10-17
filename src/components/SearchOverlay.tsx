"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { searchProducts, collections } from "@/lib/products";
import { formatINR } from "@/lib/site";

const POPULAR = ["organza saree", "blouse", "lehenga", "hand painted", "tassels", "dress"];

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen } = useCart();
  const [q, setQ] = useState("");
  const input = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => { if (searchOpen) setTimeout(() => input.current?.focus(), 30); else setQ(""); }, [searchOpen]);
  if (!searchOpen) return null;

  const results = searchProducts(q).slice(0, 6);
  const close = () => setSearchOpen(false);
  const go = (term: string) => { close(); router.push(`/search/?q=${encodeURIComponent(term)}`); };

  return (
    <div className="drawer-backdrop search-backdrop" onClick={close}>
      <div className="search-panel shop-ui" role="dialog" aria-modal="true" aria-label="Search" onClick={(e) => e.stopPropagation()}>
        <form className="searchbar" style={{ maxWidth: "none" }} role="search" onSubmit={(e) => { e.preventDefault(); if (q.trim()) go(q); }}>
          <label htmlFor="overlay-q" className="sr-only">Search products</label>
          <input id="overlay-q" ref={input} type="search" placeholder="Search sarees, blouses, lehengas…" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          <button type="submit" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></button>
        </form>
        <button className="text-btn" style={{ position: "absolute", top: 18, right: 18 }} onClick={close}>Close</button>

        {q.trim() === "" ? (
          <div className="search-sugg">
            <div><h3>Popular searches</h3><div className="chips">{POPULAR.map((t) => <button key={t} className="chip" onClick={() => go(t)}>{t}</button>)}</div></div>
            <div><h3>Collections</h3><div className="chips">{collections.slice(0, 8).map((c) => <Link key={c.slug} className="chip" style={{ display: "inline-flex", alignItems: "center", textDecoration: "none" }} href={`/collections/${c.slug}/`} onClick={close}>{c.name}</Link>)}</div></div>
          </div>
        ) : results.length === 0 ? (
          <p className="empty">No pieces match &ldquo;{q}&rdquo;. Try &ldquo;saree&rdquo; or &ldquo;blouse&rdquo;.</p>
        ) : (
          <div className="search-results">
            {results.map((p) => (
              <Link key={p.slug} href={`/product/${p.slug}/`} onClick={close} className="search-hit">
                <span className="cart-thumb" style={{ width: 56, background: p.tone, borderRadius: 10 }}><img src={p.images[0]} alt="" /></span>
                <span style={{ flex: 1 }}><strong style={{ fontWeight: 500 }}>{p.name}</strong><br /><small style={{ color: "var(--shop-muted)" }}>{p.category} · {p.fabric}</small></span>
                <span>{formatINR(p.price)}</span>
              </Link>
            ))}
            <button className="btn-shop ghost" onClick={() => go(q)}>See all results for &ldquo;{q}&rdquo;</button>
          </div>
        )}
      </div>
    </div>
  );
}
