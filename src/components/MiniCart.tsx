"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatINR } from "@/lib/site";
import { FreeShipBar } from "./bits";

export default function MiniCart() {
  const { drawerOpen, setDrawerOpen, lines, subtotal, setQty, remove, count } = useCart();
  if (!drawerOpen) return null;
  const close = () => setDrawerOpen(false);

  return (
    <div className="drawer-backdrop" onClick={close}>
      <aside className="drawer shop-ui" role="dialog" aria-modal="true" aria-label="Your bag" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-head">
          <h2 className="shop-title" style={{ fontSize: 26 }}>Your bag ({count})</h2>
          <button className="icon-btn" aria-label="Close bag" onClick={close}>✕</button>
        </div>
        <FreeShipBar />
        {lines.length === 0 ? (
          <div className="empty stack" style={{ alignItems: "center" }}>
            <p style={{ margin: 0 }}>Your bag is empty.</p>
            <Link href="/shop/" className="btn-shop dark" onClick={close}>Start shopping</Link>
          </div>
        ) : (
          <>
            <div className="drawer-lines">
              {lines.map((l) => (
                <div key={l.key} className="drawer-line">
                  <Link href={`/product/${l.slug}/`} onClick={close} className="cart-thumb" style={{ width: 76, background: l.tone, borderRadius: 12 }}><img src={l.image} alt={l.name} /></Link>
                  <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong style={{ fontWeight: 500, fontSize: 15 }}>{l.name}</strong>
                      <span style={{ fontSize: 15 }}>{formatINR(l.unitPrice * l.qty)}</span>
                    </div>
                    <span style={{ fontSize: 13, color: "var(--shop-muted)" }}>{l.options}</span>
                    <div className="row" style={{ gap: 8 }}>
                      <div className="qty small">
                        <button aria-label={`Decrease quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty - 1)}>−</button>
                        <span>{l.qty}</span>
                        <button aria-label={`Increase quantity of ${l.name}`} onClick={() => setQty(l.key, l.qty + 1)}>+</button>
                      </div>
                      <button className="text-btn" onClick={() => remove(l.key)}>Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="drawer-foot">
              <div className="line total" style={{ display: "flex", justifyContent: "space-between", fontSize: 18, fontWeight: 700 }}><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              <span style={{ fontSize: 13, color: "var(--shop-muted)" }}>Shipping and discounts calculated at checkout.</span>
              <Link href="/checkout/" className="btn-shop dark" onClick={close}>Checkout</Link>
              <Link href="/cart/" className="btn-shop ghost" onClick={close}>View bag</Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
