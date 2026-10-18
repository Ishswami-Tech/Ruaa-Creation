"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { site, formatINR, waLink } from "@/lib/site";

const TABS = [
  ["size", "Size guide"],
  ["shipping", "Shipping"],
  ["returns", "Returns & exchanges"],
  ["privacy", "Privacy"],
  ["terms", "Terms"],
] as const;
type Tab = (typeof TABS)[number][0];

const SIZE_ROWS = [
  ["XS", 32, 27, 26, 35, 13.5], ["S", 34, 29, 28, 37, 14], ["M", 36, 31, 30, 39, 14.5],
  ["L", 38, 33, 32, 41, 15], ["XL", 40, 35, 34, 43, 15.5], ["XXL", 42, 37, 36, 45, 16],
];

export default function PoliciesClient() {
  const params = useSearchParams();
  const [tab, setTab] = useState<Tab>("size");
  useEffect(() => {
    const t = params.get("t") as Tab | null;
    if (t && TABS.some(([k]) => k === t)) setTab(t);
  }, [params]);

  return (
    <>
      <section className="section-sand" style={{ paddingTop: 56 }}>
        <div className="wrap" style={{ maxWidth: 1100 }}>
          <h1 className="h1" style={{ fontSize: "clamp(40px,5vw,56px)" }}>Help &amp; policies</h1>
          <p className="lead" style={{ margin: "8px 0 32px" }}>Everything you need to shop with confidence.</p>
          <div className="tabs" role="tablist" aria-label="Help topics">
            {TABS.map(([k, l]) => (
              <button key={k} role="tab" aria-selected={tab === k} onClick={() => { setTab(k); history.replaceState(null, "", `?t=${k}`); }}>{l}</button>
            ))}
          </div>
        </div>
      </section>

      <section className="wrap prose" style={{ maxWidth: 1100, padding: "48px 24px 88px" }}>
        {tab === "size" && (
          <div className="stack">
            <h2 className="h2">Blouse &amp; outfit size guide</h2>
            <p>All measurements are body measurements in inches. Between sizes? Choose the larger one — every ready blouse has 1&quot; margin on the side seams for easy alteration.</p>
            <div className="table-box">
              <table>
                <thead><tr><th scope="col">Size</th><th scope="col">Bust</th><th scope="col">Under-bust</th><th scope="col">Waist</th><th scope="col">Hip</th><th scope="col">Shoulder</th></tr></thead>
                <tbody>{SIZE_ROWS.map((r) => <tr key={r[0]}><th scope="row">{r[0]}</th>{r.slice(1).map((v, i) => <td key={i}>{v}</td>)}</tr>)}</tbody>
              </table>
            </div>
            <div className="grid-auto">
              <div className="card"><strong>Bust</strong><p>Around the fullest part, tape level across the back.</p></div>
              <div className="card"><strong>Waist</strong><p>Around the narrowest part, usually just above the navel.</p></div>
              <div className="card"><strong>Shoulder</strong><p>Across the back, from one shoulder edge to the other.</p></div>
            </div>
            <p>Sarees are 5.5 m plus a 0.8 m blouse piece unless stated. Need help? <Link href="/contact/">Book a free video fitting</Link>.</p>
          </div>
        )}

        {tab === "shipping" && (
          <div className="stack">
            <h2 className="h2">Shipping</h2>
            <div className="table-box">
              <table>
                <thead><tr><th scope="col">Order type</th><th scope="col">Dispatched in</th><th scope="col">Delivery</th></tr></thead>
                <tbody>
                  <tr><th scope="row">Ready-to-wear</th><td>2–3 working days</td><td>Metros 3–5 days · rest of India 5–8 days</td></tr>
                  <tr><th scope="row">Ready blouse alterations</th><td>4–6 working days</td><td>As above</td></tr>
                  <tr><th scope="row">Hand-painted commissions</th><td>10–14 days</td><td>As above</td></tr>
                  <tr><th scope="row">Custom outfits</th><td>2–4 weeks</td><td>As agreed on your quote</td></tr>
                </tbody>
              </table>
            </div>
            <ul>
              <li>Free shipping on orders above {formatINR(site.freeShippingAbove)}; {formatINR(site.shippingFee)} below that.</li>
              <li>Cash on delivery available up to {formatINR(site.codMax)} ({formatINR(site.codFee)} handling fee).</li>
              <li>Every order ships in a Ruaa gift box with a tracking link on WhatsApp and email.</li>
            </ul>
          </div>
        )}

        {tab === "returns" && (
          <div className="stack">
            <h2 className="h2">Returns &amp; exchanges</h2>
            <ul>
              <li>Ready-to-wear pieces can be exchanged for size or store credit within <strong>{site.exchangeDays} days</strong> of delivery.</li>
              <li>Items must be unworn, unwashed and with all tags and packaging.</li>
              <li>Damaged or incorrect item? Share an unboxing video within 48 hours and we&apos;ll replace it free.</li>
              <li>Not eligible: custom-stitched outfits, altered blouses, hand-painted commissions and sale items.</li>
              <li>Free alterations within 15 days on custom orders.</li>
            </ul>
            <p><Link href="/contact/">Start an exchange</Link> on WhatsApp with your order number.</p>
          </div>
        )}

        {tab === "privacy" && (
          <div className="stack">
            <h2 className="h2">Privacy policy</h2>
            <p>We collect only what we need to fulfil your order and stay in touch: your name, phone, email, address, measurements (for custom orders) and order history. Payments are handled by our payment partner — we never see or store your card details.</p>
            <p>We use your data to deliver orders, send order updates on WhatsApp and email, and — only if you opt in — share new collections. We do not sell your data. You can ask us to access, correct or delete your personal data at any time, in line with the Digital Personal Data Protection Act, 2023.</p>
            <p>Your bag, saved addresses, measurements and device order history stay in your browser. When online order recording is available, submitting checkout also saves your contact and delivery details, selected pieces and order notes to our store database so authorised staff can manage your request. We do not collect card details. The WhatsApp link contains the details needed to discuss your order; WhatsApp receives the message when you send it. For privacy questions or deletion requests, <a href={waLink("I have a privacy question or complaint.")} target="_blank" rel="noopener noreferrer">contact us on WhatsApp</a>.</p>
          </div>
        )}

        {tab === "terms" && (
          <div className="stack">
            <h2 className="h2">Terms of sale</h2>
            <p>Prices are in Indian rupees and include GST. Colours may vary slightly due to screen settings and the handmade nature of our work. Small variations in painting and finishing are part of each piece&apos;s character, not defects.</p>
            <p>Custom orders are confirmed with a 50% advance, which is non-refundable once fabric is cut. The balance is due before dispatch.</p>
            <p>Orders are requests until we confirm availability, delivery and payment arrangements on WhatsApp.</p>
          </div>
        )}
      </section>
    </>
  );
}
