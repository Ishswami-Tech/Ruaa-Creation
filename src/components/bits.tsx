"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { discountPct, getProduct, products, type Product } from "@/lib/products";
import { site, formatINR } from "@/lib/site";
import { useCart } from "./CartProvider";
import ProductCard from "./ProductCard";

export function Price({ p, size = 15 }: { p: Product; size?: number }) {
  return (
    <span className="price-wrap" style={{ fontSize: size }}>
      <span className="price">{formatINR(p.price)}</span>
      {p.mrp && (
        <>
          <s className="mrp">{formatINR(p.mrp)}</s>
          <span className="off">{discountPct(p)}% off</span>
        </>
      )}
    </span>
  );
}

export function WishButton({ slug, name, floating = true }: { slug: string; name: string; floating?: boolean }) {
  const { isWished, toggleWish, ready } = useCart();
  const on = ready && isWished(slug);
  return (
    <button
      type="button"
      className={floating ? "wish-btn" : "wish-btn inline"}
      aria-pressed={on}
      aria-label={on ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWish(slug); }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
      </svg>
    </button>
  );
}

export function FreeShipBar() {
  const { subtotal, ready } = useCart();
  if (!ready || subtotal === 0) return null;
  const left = site.freeShippingAbove - subtotal;
  const pct = Math.min(100, Math.round((subtotal / site.freeShippingAbove) * 100));
  return (
    <div className="ship-bar">
      <p>{left > 0 ? <>Add <strong>{formatINR(left)}</strong> more for free shipping</> : <>You&apos;ve unlocked <strong>free shipping</strong></>}</p>
      <div className="ship-track" aria-hidden="true"><span style={{ width: `${pct}%` }} /></div>
    </div>
  );
}

export function RecentlyViewed({ exclude, title = "Recently viewed" }: { exclude?: string; title?: string }) {
  const { recent, ready } = useCart();
  const list = recent.filter((s) => s !== exclude).map(getProduct).filter(Boolean).slice(0, 4) as Product[];
  if (!ready || list.length === 0) return null;
  return (
    <section className="shop-ui" style={{ padding: "56px 0", background: "transparent" }}>
      <div className="wrap">
        <h2 className="shop-title" style={{ fontSize: 32, marginBottom: 22 }}>{title}</h2>
        <div className="product-grid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
      </div>
    </section>
  );
}

export function SizeGuideModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  const rows: [string, number, number, number, number][] = [["XS", 32, 26, 35, 13.5], ["S", 34, 28, 37, 14], ["M", 36, 30, 39, 14.5], ["L", 38, 32, 41, 15], ["XL", 40, 34, 43, 15.5], ["XXL", 42, 36, 45, 16]];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="sg-title" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head"><h2 id="sg-title" className="shop-title" style={{ fontSize: 28 }}>Size guide</h2><button className="icon-btn" aria-label="Close size guide" onClick={onClose}>✕</button></div>
        <p style={{ margin: "0 0 16px", color: "var(--shop-muted)" }}>Body measurements in inches. Between sizes? Pick the larger — every blouse has 1&quot; side margin.</p>
        <div className="table-box"><table><thead><tr><th>Size</th><th>Bust</th><th>Waist</th><th>Hip</th><th>Shoulder</th></tr></thead>
          <tbody>{rows.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th><td>{r[1]}</td><td>{r[2]}</td><td>{r[3]}</td><td>{r[4]}</td></tr>)}</tbody></table></div>
        <p style={{ margin: "16px 0 0", fontSize: 14 }}>Not sure? <Link href="/contact/" onClick={onClose}>Book a free video fitting</Link> or choose <strong>custom-stitched</strong>.</p>
      </div>
    </div>
  );
}

export function useDeliveryDate(days: number) {
  const [label, setLabel] = useState("");
  useEffect(() => {
    const d = new Date();
    let added = 0;
    while (added < days) { d.setDate(d.getDate() + 1); if (d.getDay() !== 0) added++; }
    setLabel(d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" }));
  }, [days]);
  return label;
}

export function YouMayLike({ exclude, max = 4 }: { exclude: string[]; max?: number }) {
  const list = products.filter((p) => !exclude.includes(p.slug)).sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0)).slice(0, max);
  return <div className="product-grid">{list.map((p) => <ProductCard key={p.slug} p={p} />)}</div>;
}
