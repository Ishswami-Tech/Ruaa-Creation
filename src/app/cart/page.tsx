"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartProvider";
import { site, formatINR } from "@/lib/site";
import { totals, COUPON_KEY } from "@/lib/pricing";
import { FreeShipBar, YouMayLike } from "@/components/bits";

export default function CartPage() {
  const { lines, count, subtotal, setQty, remove, ready } = useCart();
  const [code, setCode] = useState("");
  const [applied, setApplied] = useState<string | null>(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    try { const c = localStorage.getItem(COUPON_KEY); if (c) { setApplied(c); setCode(c); } } catch {}
  }, []);

  const t = totals(subtotal, applied, false);

  const apply = () => {
    if (code.trim().toUpperCase() === site.launchCode) {
      setApplied(site.launchCode); setMsg(`${site.launchDiscountPct}% off applied.`);
      try { localStorage.setItem(COUPON_KEY, site.launchCode); } catch {}
    } else { setApplied(null); setMsg("That code isn't valid."); try { localStorage.removeItem(COUPON_KEY); } catch {} }
  };

  return (
    <div className="shop-ui">
      <div className="wrap" style={{ paddingTop: 40 }}>
        <h1 className="shop-title" style={{ fontSize: 48 }}>Your bag</h1>
        {ready && count > 0 && (
          <div style={{ maxWidth: 560, marginTop: 12 }}>
            <p style={{ color: "var(--shop-muted)", margin: "0 0 8px" }}>{count} {count === 1 ? "item" : "items"}</p>
            <FreeShipBar />
          </div>
        )}

        {!ready ? (
          <p className="empty">Loading your bag…</p>
        ) : lines.length === 0 ? (
          <div className="empty stack" style={{ alignItems: "center" }}>
            <p style={{ fontSize: 18, margin: 0, color: "var(--shop-ink)" }}>Your bag is empty.</p>
            <Link href="/shop/" className="btn-shop dark">Continue shopping</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-lines">
              {lines.map((l) => (
                <article key={l.key} className="cart-line">
                  <Link href={`/product/${l.slug}/`} className="cart-thumb" style={{ background: l.tone }}><img src={l.image} alt={l.name} /></Link>
                  <div style={{ flex: "1 1 240px", display: "flex", flexDirection: "column", gap: 6 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <Link href={`/product/${l.slug}/`} className="shop-title" style={{ fontSize: 22, textDecoration: "none" }}>{l.name}</Link>
                      <strong>{formatINR(l.unitPrice * l.qty)}</strong>
                    </div>
                    <span style={{ fontSize: 14, color: "var(--shop-muted)" }}>{l.options}</span>
                    <span style={{ fontSize: 13 }} className="ok">In stock · dispatches in 2–3 working days</span>
                    <div className="row" style={{ marginTop: 6 }}>
                      <div className="qty">
                        <button aria-label={`Decrease quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                        <span>{l.qty}</span>
                        <button aria-label={`Increase quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                      </div>
                      <button className="text-btn" onClick={() => remove(l.key)}>Remove</button>
                    </div>
                  </div>
                </article>
              ))}
              <Link href="/shop/" style={{ display: "inline-block", marginTop: 20 }}>← Continue shopping</Link>
            </div>

            <aside className="summary" aria-label="Order summary">
              <h2 className="shop-title" style={{ fontSize: 28 }}>Order summary</h2>
              <div className="line"><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {t.discount > 0 && <div className="line ok"><span>Discount ({applied})</span><span>− {formatINR(t.discount)}</span></div>}
              <div className="line"><span>Shipping</span><span>{t.shipping ? formatINR(t.shipping) : "Free"}</span></div>
              <div className="line"><span>Gift wrap in Ruaa box</span><span>Complimentary</span></div>
              <form className="row" style={{ gap: 8 }} onSubmit={(e) => { e.preventDefault(); apply(); }}>
                <label htmlFor="coupon" className="sr-only">Coupon code</label>
                <input id="coupon" placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
                <button className="btn-sm" type="submit">Apply</button>
              </form>
              {msg && <p style={{ margin: 0, fontSize: 14 }} aria-live="polite">{msg}</p>}
              <div className="line total"><span>Total</span><span>{formatINR(t.total)}</span></div>
              <span style={{ fontSize: 13, color: "var(--shop-muted)", marginTop: -8 }}>Inclusive of GST</span>
              <Link href="/checkout/" className="btn-shop dark">Proceed to checkout</Link>
              <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 13, color: "var(--shop-muted)", display: "flex", flexDirection: "column", gap: 6 }}>
                <li>✓ Pay by UPI, card, net banking or COD</li>
                <li>✓ Cash on delivery up to {formatINR(site.codMax)}</li>
                <li>✓ {site.exchangeDays}-day exchange on ready-to-wear</li>
              </ul>
            </aside>
          </div>
        )}
      </div>
      {ready && (
        <section style={{ background: "var(--shop-soft)", padding: "56px 0" }}>
          <div className="wrap">
            <h2 className="shop-title" style={{ fontSize: 30, marginBottom: 20 }}>{lines.length ? "Pairs well with your bag" : "You may like"}</h2>
            <YouMayLike exclude={lines.map((l) => l.slug)} />
          </div>
        </section>
      )}
    </div>
  );
}
