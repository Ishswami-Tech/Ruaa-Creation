"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/products";
import { site, formatINR, waLink } from "@/lib/site";
import { useCart } from "@/components/CartProvider";
import { Price, WishButton, SizeGuideModal, useDeliveryDate } from "@/components/bits";

const BLOUSE = [
  { id: "piece", label: "Unstitched blouse piece (0.8 m)", extra: 0, note: "Included" },
  { id: "ready", label: "Ready blouse, sizes XS–XXL", extra: 950, note: "+ ₹950" },
  { id: "custom", label: "Custom-stitched to my measurements", extra: 1450, note: "+ ₹1,450" },
];

export default function ProductDetail({ p }: { p: Product }) {
  const { add, markViewed, notify, ready, setDrawerOpen } = useCart();
  const router = useRouter();
  const [shot, setShot] = useState(0);
  const [colour, setColour] = useState(0);
  const [blouse, setBlouse] = useState("piece");
  const [size, setSize] = useState<string | null>(null);
  const [qty, setQty] = useState(1);
  const [error, setError] = useState("");
  const [pin, setPin] = useState("");
  const [pinMsg, setPinMsg] = useState("");
  const [guide, setGuide] = useState(false);
  const dispatchDays = p.blouseOptions && blouse === "custom" ? 9 : 3;
  const eta = useDeliveryDate(dispatchDays + 4);

  useEffect(() => { if (ready) markViewed(p.slug); }, [p.slug, markViewed, ready]);

  const b = BLOUSE.find((x) => x.id === blouse)!;
  const needsSize = !!p.sizes || (p.blouseOptions && blouse === "ready");
  const sizeList = p.sizes ?? ["XS", "S", "M", "L", "XL", "XXL"];
  const unit = p.price + (p.blouseOptions ? b.extra : 0);
  const soldOut = p.stock === 0;

  const options = [
    p.colours ? `Colour: ${p.colours[colour].name}` : null,
    p.blouseOptions ? `Blouse: ${b.id === "piece" ? "unstitched piece" : b.id === "ready" ? `ready, size ${size ?? "?"}` : "custom-stitched"}` : null,
    p.sizes ? `Size ${size}` : null,
  ].filter(Boolean).join(" · ") || "Free size";

  const addToBag = (goCheckout: boolean) => {
    if (needsSize && !size) { setError("Please choose a size."); document.getElementById("size-field")?.scrollIntoView({ behavior: "smooth", block: "center" }); return; }
    setError("");
    add({ slug: p.slug, name: p.name, image: p.images[0], tone: p.tone, options, unitPrice: unit }, qty);
    if (goCheckout) { setDrawerOpen(false); router.push("/checkout/"); }
  };

  const share = async () => {
    const url = `${site.url}/product/${p.slug}/`;
    try {
      if (navigator.share) { await navigator.share({ title: p.name, url }); return; }
      await navigator.clipboard.writeText(url); notify("Link copied");
    } catch {}
  };

  const isArt = /\.(?:jpe?g|webp)$/i.test(p.images[shot]) || p.images[shot].startsWith("/api/media/");

  return (
    <>
      <div className="pdp">
        <div className="gallery">
          <div className="gallery-main" style={{ background: p.tone }}>
            <img src={p.images[shot]} alt={`${p.name} — view ${shot + 1}`} style={{ objectFit: isArt ? "cover" : "contain", width: isArt ? "100%" : "78%", height: isArt ? "100%" : "78%" }} />
            <WishButton slug={p.slug} name={p.name} />
            {p.mrp && <span className="pill sale" style={{ left: 16, top: 16 }}>Sale</span>}
          </div>
          {p.images.length > 1 && (
            <div className="thumbs" role="group" aria-label="Product images">
              {p.images.map((img, i) => (
                <button key={img + i} aria-pressed={shot === i} aria-label={`Show view ${i + 1}`} onClick={() => setShot(i)} style={{ background: p.tone }}><img src={img} alt="" /></button>
              ))}
            </div>
          )}
        </div>

        <div className="pdp-info">
          <div className="row" style={{ gap: 8 }}>
            {p.tag && <span className="pill" style={{ position: "static", background: "var(--shop-panel)" }}>{p.tag}</span>}
            <span className="pill" style={{ position: "static", background: "var(--shop-soft)" }}>{p.category} · {p.fabric}</span>
          </div>
          <h1 className="shop-title" style={{ fontSize: "clamp(32px,4vw,46px)" }}>{p.name}</h1>
          <div className="row" style={{ alignItems: "baseline" }}>
            <Price p={{ ...p, price: unit, mrp: p.mrp ? p.mrp + (unit - p.price) : undefined }} size={26} />
            <span style={{ fontSize: 14, color: "var(--shop-muted)" }}>Inclusive of all taxes</span>
          </div>
          {p.stock !== undefined && p.stock > 0 && p.stock <= 5 && <p className="low" style={{ margin: 0 }}>Only {p.stock} left — {p.stock === 1 ? "this is a one-of-one piece" : "order soon"}</p>}
          <p style={{ margin: 0, lineHeight: 1.75, color: "#5A4A42" }}>{p.description}</p>

          {p.colours && (
            <fieldset><legend>Colour — {p.colours[colour].name}</legend>
              <div className="row" style={{ gap: 12 }}>{p.colours.map((c, i) => <button key={c.name} className="swatch" aria-label={c.name} aria-pressed={colour === i} style={{ background: c.hex }} onClick={() => setColour(i)} />)}</div>
            </fieldset>
          )}

          {p.blouseOptions && (
            <fieldset><legend>Blouse</legend>
              <div className="stack" style={{ gap: 10 }}>
                {BLOUSE.map((o) => (
                  <label key={o.id} className="option">
                    <span className="check"><input type="radio" name="blouse" checked={blouse === o.id} onChange={() => { setBlouse(o.id); setError(""); }} /> {o.label}</span>
                    <span style={{ color: "var(--shop-muted)", fontSize: 14 }}>{o.note}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {needsSize && (
            <fieldset id="size-field"><legend>{p.blouseOptions ? "Blouse size" : "Size"} <button type="button" className="text-btn" style={{ minHeight: 0, padding: 0, fontWeight: 400 }} onClick={() => setGuide(true)}>Size guide</button></legend>
              <div className="chips">{sizeList.map((s) => <button key={s} className="size-btn" aria-pressed={size === s} onClick={() => { setSize(s); setError(""); }}>{s}</button>)}</div>
              {error && <p role="alert" style={{ color: "var(--shop-accent)", margin: "10px 0 0", fontSize: 14 }}>{error}</p>}
            </fieldset>
          )}
          {p.blouseOptions && blouse === "custom" && <p className="note-box" style={{ margin: 0 }}>We&apos;ll WhatsApp you after ordering to take your measurements (video call or a well-fitting blouse sent to us). Adds 5–7 days.</p>}

          <div className="row" id="buy-row">
            <div className="qty">
              <button aria-label="Decrease quantity" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
              <span aria-live="polite">{qty}</span>
              <button aria-label="Increase quantity" onClick={() => setQty(Math.min(p.stock ?? 99, qty + 1))}>+</button>
            </div>
            <button className="btn-shop dark" style={{ flex: "1 1 200px" }} disabled={soldOut} onClick={() => addToBag(false)}>{soldOut ? "Sold out" : "Add to bag"}</button>
            <button className="btn-shop" style={{ flex: "1 1 160px" }} disabled={soldOut} onClick={() => addToBag(true)}>Buy now</button>
          </div>

          <ul className="perks">
            <li><strong>Delivery by {eta || "…"}</strong> — dispatches in {dispatchDays} working days</li>
            <li>{unit >= site.freeShippingAbove ? "Free shipping on this piece" : `Free shipping above ${formatINR(site.freeShippingAbove)}`}</li>
            <li>{site.exchangeDays}-day exchange{p.blouseOptions && blouse === "custom" ? " (not on custom-stitched blouse)" : ""} · COD available</li>
          </ul>

          <div className="row" style={{ gap: 8 }}>
            <a className="btn-shop wa" style={{ flex: "1 1 220px" }} href={waLink(`Hi ${site.name}! I'd like to know more about the ${p.name} (${formatINR(p.price)}).\n${site.url}/product/${p.slug}/`)} target="_blank" rel="noopener">Ask on WhatsApp</a>
            <button className="btn-shop ghost" onClick={share}>Share</button>
          </div>

          <form className="note-box" onSubmit={(e) => { e.preventDefault(); setPinMsg(/^\d{6}$/.test(pin) ? `Delivers to ${pin} by around ${eta}. Cash on delivery available.` : "Please enter a 6-digit pincode."); }}>
            <label htmlFor="pin" style={{ fontWeight: 500, display: "block", marginBottom: 8, color: "var(--shop-ink)" }}>Check delivery to your pincode</label>
            <div className="row" style={{ gap: 8 }}>
              <input id="pin" inputMode="numeric" maxLength={6} placeholder="e.g. 700091" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))} style={{ flex: 1, minWidth: 0, height: 44, border: "1px solid var(--shop-chip)", borderRadius: 10, padding: "0 12px" }} />
              <button className="btn-sm" type="submit">Check</button>
            </div>
            {pinMsg && <p style={{ margin: "8px 0 0" }} aria-live="polite">{pinMsg}</p>}
          </form>

          <div className="acc">
            <details open><summary>Details</summary><ul>{p.details.map((d) => <li key={d}>{d}</li>)}</ul></details>
            <details><summary>Fabric &amp; care</summary><ul><li>{p.fabric}</li>{p.care.map((d) => <li key={d}>{d}</li>)}</ul></details>
            <details><summary>Shipping &amp; exchange</summary><ul>
              <li>Free shipping across India above {formatINR(site.freeShippingAbove)}</li>
              <li>Ready-to-wear dispatches in 2–3 working days</li>
              <li>Exchange within {site.exchangeDays} days if unworn with tags</li>
              <li>Custom-stitched and hand-painted commissions are not returnable</li>
            </ul></details>
          </div>
        </div>
      </div>

      <section className="reviews">
        <div className="toolbar">
          <div><h2 className="shop-title" style={{ fontSize: 30 }}>Customer reviews</h2><p style={{ margin: "4px 0 0", color: "var(--shop-muted)" }}>No reviews yet — be the first to share how it looks on you.</p></div>
          <a className="btn-sm" href={waLink(`Hi ${site.name}! Here's my review of the ${p.name}:\n\nRating (1–5): \nWhat I loved: \n\n(I'll attach a photo)`)} target="_blank" rel="noopener">Write a review</a>
        </div>
      </section>

      <div className="sticky-buy">
        <div><strong style={{ fontSize: 14, display: "block" }}>{p.name}</strong><span style={{ fontSize: 14 }}>{formatINR(unit)}</span></div>
        <button className="btn-shop dark" disabled={soldOut} onClick={() => addToBag(false)}>{soldOut ? "Sold out" : "Add to bag"}</button>
      </div>

      <SizeGuideModal open={guide} onClose={() => setGuide(false)} />
    </>
  );
}
