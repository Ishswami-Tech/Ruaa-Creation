"use client";

import { useMemo, useState, useEffect } from "react";
import { type Category, type Occasion, type Product } from "@/lib/products";
import { site, formatINR } from "@/lib/site";
import ProductCard from "./ProductCard";

const PRICES = [
  { id: "u3", label: "Under ₹3,000", test: (p: number) => p < 3000 },
  { id: "3-7", label: "₹3,000 – ₹7,500", test: (p: number) => p >= 3000 && p <= 7500 },
  { id: "7-15", label: "₹7,500 – ₹15,000", test: (p: number) => p > 7500 && p <= 15000 },
  { id: "15+", label: "Above ₹15,000", test: (p: number) => p > 15000 },
];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const OCCASIONS: Occasion[] = ["Festive", "Wedding", "Party", "Everyday", "Office"];

type Props = {
  base: Product[];
  eyebrow?: string;
  title: string;
  blurb?: string;
  heroImage?: string;
  heroTone?: string;
  initialCategory?: Category | "All";
  showTrust?: boolean;
};

export default function Catalog({ base, eyebrow, title, blurb, heroImage, heroTone, initialCategory = "All", showTrust = true }: Props) {
  const cats = useMemo(() => ["All", ...Array.from(new Set(base.map((p) => p.category)))] as (Category | "All")[], [base]);
  const fabrics = useMemo(() => Array.from(new Set(base.map((p) => p.fabric))).sort(), [base]);
  const [cat, setCat] = useState<Category | "All">(initialCategory);
  const [q, setQ] = useState("");
  const [size, setSize] = useState<string | null>(null);
  const [fab, setFab] = useState<string[]>([]);
  const [prices, setPrices] = useState<string[]>([]);
  const [occ, setOcc] = useState<string[]>([]);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => setCat(initialCategory), [initialCategory]);

  const toggle = (arr: string[], v: string, set: (x: string[]) => void) => set(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);
  const activeCount = (size ? 1 : 0) + fab.length + prices.length + occ.length;

  const list = useMemo(() => {
    let l = base.filter((p) => cat === "All" || p.category === cat);
    if (q.trim()) { const s = q.toLowerCase(); l = l.filter((p) => (p.name + p.fabric + p.category + p.description).toLowerCase().includes(s)); }
    if (size) l = l.filter((p) => !p.sizes || p.sizes.includes(size) || p.blouseOptions);
    if (fab.length) l = l.filter((p) => fab.includes(p.fabric));
    if (prices.length) l = l.filter((p) => PRICES.some((r) => prices.includes(r.id) && r.test(p.price)));
    if (occ.length) l = l.filter((p) => p.occasions.some((o) => occ.includes(o)));
    if (sort === "new") l = [...l].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
    if (sort === "low") l = [...l].sort((a, b) => a.price - b.price);
    if (sort === "high") l = [...l].sort((a, b) => b.price - a.price);
    if (sort === "discount") l = [...l].sort((a, b) => (b.mrp ? b.mrp - b.price : 0) - (a.mrp ? a.mrp - a.price : 0));
    return l;
  }, [base, cat, q, size, fab, prices, occ, sort]);

  const clearAll = () => { setCat("All"); setQ(""); setSize(null); setFab([]); setPrices([]); setOcc([]); setSort("featured"); };

  return (
    <div className="shop-ui">
      <div className="wrap" style={{ paddingTop: 28 }}>
        <div className="shop-hero" style={{ background: heroTone ?? "var(--shop-panel)" }}>
          <div className="shop-hero-text">
            {eyebrow && <span className="shop-eyebrow">{eyebrow}</span>}
            <h1 className="shop-title">{title}</h1>
            {blurb && <p>{blurb}</p>}
            <form className="searchbar" role="search" onSubmit={(e) => e.preventDefault()}>
              <label htmlFor="cat-q" className="sr-only">Search in this collection</label>
              <input id="cat-q" type="search" placeholder="Search in this collection…" value={q} onChange={(e) => setQ(e.target.value)} />
              <button type="submit" aria-label="Search"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg></button>
            </form>
          </div>
          {heroImage && <img className="shop-hero-img" src={heroImage} alt="" />}
        </div>
        {showTrust && (
          <ul className="trust">
            <li><strong>Free shipping</strong><br /><span>Above {formatINR(site.freeShippingAbove)} across India</span></li>
            <li><strong>Easy exchanges</strong><br /><span>Within {site.exchangeDays} days</span></li>
            <li><strong>Custom sizing</strong><br /><span>On any blouse, from ₹1,450</span></li>
            <li><strong>Cash on delivery</strong><br /><span>Up to {formatINR(site.codMax)}</span></li>
          </ul>
        )}

        <div className="shop-layout">
          <aside className={`filters ${showFilters ? "is-open" : ""}`} aria-label="Filters">
            <div className="filters-head"><h2>Filters</h2><button className="text-btn mobile-only" onClick={() => setShowFilters(false)}>Done</button></div>
            <fieldset><legend>Size</legend>
              <div className="chips">{SIZES.map((s) => <button key={s} type="button" className="size-btn" aria-pressed={size === s} onClick={() => setSize(size === s ? null : s)}>{s}</button>)}</div>
            </fieldset>
            <fieldset><legend>Occasion</legend>
              {OCCASIONS.map((o) => <label key={o} className="check"><input type="checkbox" checked={occ.includes(o)} onChange={() => toggle(occ, o, setOcc)} /> {o}</label>)}
            </fieldset>
            <fieldset><legend>Price</legend>
              {PRICES.map((r) => <label key={r.id} className="check"><input type="checkbox" checked={prices.includes(r.id)} onChange={() => toggle(prices, r.id, setPrices)} /> {r.label}</label>)}
            </fieldset>
            <fieldset><legend>Fabric</legend>
              {fabrics.map((f) => <label key={f} className="check"><input type="checkbox" checked={fab.includes(f)} onChange={() => toggle(fab, f, setFab)} /> {f}</label>)}
            </fieldset>
            <button type="button" className="text-btn" style={{ alignSelf: "flex-start" }} onClick={clearAll}>Clear all filters</button>
          </aside>

          <div className="results">
            <div className="toolbar">
              {cats.length > 2 ? (
                <div className="chips" role="group" aria-label="Category">
                  {cats.map((c) => <button key={c} className="chip" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
                </div>
              ) : <span />}
              <div className="row" style={{ gap: 8 }}>
                <button className="chip mobile-only" onClick={() => setShowFilters(true)}>Filters{activeCount ? ` (${activeCount})` : ""}</button>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>Sort
                  <select className="select" value={sort} onChange={(e) => setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="new">Newest</option>
                    <option value="low">Price: low to high</option>
                    <option value="high">Price: high to low</option>
                    <option value="discount">Biggest discount</option>
                  </select>
                </label>
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 14, color: "var(--shop-muted)" }} aria-live="polite">Showing {list.length} {list.length === 1 ? "piece" : "pieces"}</p>
            {list.length ? (
              <div className="product-grid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
            ) : (
              <div className="empty">Nothing matches those filters. <button className="text-btn" onClick={clearAll}>Clear filters</button></div>
            )}
          </div>
        </div>
      </div>

      <section style={{ background: "var(--shop-ink)", color: "#F7ECE6", padding: "64px 0" }}>
        <div className="wrap split" style={{ gap: 32 }}>
          <div className="stack" style={{ gap: 10 }}>
            <h2 className="shop-title" style={{ fontSize: 40 }}>Can&apos;t find your fit? We&apos;ll make it.</h2>
            <p style={{ margin: 0, color: "#D9C8BF", fontSize: 17 }}>Customised outfits and hand-painted pieces, made to your measurements.</p>
          </div>
          <div className="row" style={{ justifyContent: "flex-end" }}>
            <a href="/custom/" className="btn-shop" style={{ background: "#F6E4DF", color: "#2B211C" }}>Request a custom outfit</a>
            <a href="/policies/?t=size" className="btn-shop ghost" style={{ background: "transparent", color: "#F7ECE6", borderColor: "#F6E4DF" }}>Size guide</a>
          </div>
        </div>
      </section>
    </div>
  );
}
