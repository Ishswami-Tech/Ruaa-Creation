"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { formatINR, site } from "@/lib/site";

function Success() {
  const id = useSearchParams().get("id");
  const { orders, ready } = useCart();
  const order = orders.find((o) => o.id === id) ?? orders[0];

  if (!ready) return <p className="empty" role="status">Loading…</p>;
  if (!order)
    return (
      <section className="wrap stack center" style={{ padding: "96px 24px", alignItems: "center" }}>
        <h1 className="shop-title" style={{ fontSize: 40 }}>No recent order request on this device</h1>
        <Link href="/shop/" className="btn-shop dark">Go to shop</Link>
      </section>
    );

  const first = order.name.split(" ")[0] || "there";
  const cod = order.payment.toLowerCase().includes("cash");

  return (
    <section className="wrap" style={{ maxWidth: 1120, padding: "56px 24px 80px" }}>
      <div className="split" style={{ alignItems: "start" }}>
        <div className="stack" style={{ gap: 18 }}>
          <span aria-hidden="true" style={{ width: 64, height: 64, borderRadius: "50%", background: "#EAF3EC", color: "#2F6B3A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 30 }}>✓</span>
          <span className="shop-eyebrow">Order request {order.id}</span>
          <h1 className="shop-title" style={{ fontSize: "clamp(36px,5vw,52px)" }}>Thank you, {first}!</h1>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.7, color: "#5A4A42" }}>
            Your request has opened in WhatsApp — press <strong>Send</strong> so we receive it. Your order is confirmed only after we reply with availability and {cod ? "delivery arrangements" : "payment instructions"}. Your bag has been kept in case you need to try again.
          </p>
          <ol className="track" aria-label="Order progress">
            <li data-on="1"><strong>Request sent</strong><span>Today</span></li>
            <li><strong>Confirmed</strong><span>We reply on WhatsApp</span></li>
            <li><strong>Packed &amp; shipped</strong><span>2–3 working days</span></li>
            <li><strong>Delivered</strong><span>3–8 days after dispatch</span></li>
          </ol>
          <div className="row">
            <a className="btn-shop wa" href={order.link} target="_blank" rel="noopener">WhatsApp didn&apos;t open? Tap here</a>
            <Link href="/account/" className="btn-shop ghost">My orders</Link>
            <Link href="/shop/" className="btn-shop ghost">Continue shopping</Link>
          </div>
        </div>
        <aside className="summary" aria-label="Order summary">
          <h2 className="shop-title" style={{ fontSize: 26 }}>Order summary</h2>
          {order.lines.map((l) => (
            <div key={l.key} style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <span className="cart-thumb" style={{ width: 60, background: l.tone, borderRadius: 10 }}><img src={l.image} alt="" /></span>
              <span style={{ flex: 1, fontSize: 14 }}><strong style={{ fontWeight: 500 }}>{l.name}</strong><br /><span style={{ color: "var(--shop-muted)" }}>{l.options} · Qty {l.qty}</span></span>
              <span>{formatINR(l.unitPrice * l.qty)}</span>
            </div>
          ))}
          <div className="line total"><span>Total requested</span><span>{formatINR(order.total)}</span></div>
          <span style={{ fontSize: 13, color: "var(--shop-muted)" }}>{order.payment} · {new Date(order.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
          <div style={{ background: "#fff", borderRadius: 14, padding: 16, fontSize: 14 }}><strong>Need it altered?</strong><br /><span style={{ color: "#5A4A42" }}>Message us on WhatsApp within {site.exchangeDays} days of delivery — ready blouses can be altered for free.</span></div>
        </aside>
      </div>
    </section>
  );
}

export default function SuccessPage() {
  return (
    <div className="shop-ui">
      <Suspense fallback={<p className="empty">Loading…</p>}><Success /></Suspense>
    </div>
  );
}
