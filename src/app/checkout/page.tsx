"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useStoreConnected } from "@/components/CatalogueProvider";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";
import { site, formatINR, waLink } from "@/lib/site";
import { totals, COUPON_KEY } from "@/lib/pricing";

const PAY = [
  { id: "upi", label: "UPI — GPay, PhonePe, Paytm", note: "We'll send a payment link / QR on WhatsApp" },
  { id: "card", label: "Credit / debit card or net banking", note: "Secure payment link on WhatsApp" },
  { id: "cod", label: "Cash on delivery", note: `+ ${formatINR(site.codFee)} · up to ${formatINR(site.codMax)}` },
];

const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal","Other"];

export default function CheckoutPage() {
  const connected = useStoreConnected();
  const [submitting, setSubmitting] = useState(false);
  const request = useRef({ signature: "", key: "" });
  const { lines, subtotal, ready, saveOrder, profile, updateProfile } = useCart();
  const router = useRouter();
  const [pay, setPay] = useState("upi");
  const [coupon, setCoupon] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "", city: "", state: "", pin: "", notes: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [placed, setPlaced] = useState<{ id: string; link: string } | null>(null);

  useEffect(() => { try { setCoupon(localStorage.getItem(COUPON_KEY)); } catch {} }, []);
  // Prefill from the saved profile / default address (kept in this browser only).
  useEffect(() => {
    if (!ready) return;
    const a = profile.addresses[0];
    setForm((f) => ({ ...f, name: f.name || a?.name || profile.name, phone: f.phone || a?.phone || profile.phone, email: f.email || profile.email,
      address: f.address || a?.address || "", city: f.city || a?.city || "", state: a?.state || f.state, pin: f.pin || a?.pin || "" }));
  }, [ready, profile]);

  const cod = pay === "cod";
  const t = totals(subtotal, coupon, cod);
  const codBlocked = cod && t.total > site.codMax;
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setForm({ ...form, [k]: e.target.value });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, ""))) e.phone = "Enter a 10-digit Indian mobile number.";
    if (form.email && !/^\S+@\S+\.\S+$/.test(form.email)) e.email = "Check your email address.";
    if (!form.address.trim()) e.address = "Please enter your address.";
    if (!form.city.trim()) e.city = "Please enter your city.";
    if (!form.state) e.state = "Please choose your state.";
    if (!/^[1-9]\d{5}$/.test(form.pin)) e.pin = "Enter a 6-digit pincode.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const place = async () => {
    if (submitting || !ready || lines.length === 0 || !validate() || codBlocked) return;
    if (connected) {
      setSubmitting(true);
      const payload = { lines: lines.map(({ slug, options, qty }) => ({ slug, options, qty })), customer: { ...form, phone: form.phone.replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, "") }, payment: pay, coupon, expectedTotal: t.total };
      const signature = JSON.stringify(payload);
      if (request.current.signature !== signature) request.current = { signature, key: crypto.randomUUID() };
      try {
        const response = await fetch("/api/orders/", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...payload, requestKey: request.current.key }) });
        const order = await response.json();
        if (!response.ok) throw new Error(order.error || "Your request could not be recorded. Please try again.");
        saveOrder({ id: order.id, date: order.date, lines: order.lines, total: order.total, payment: order.payment.toUpperCase(), name: form.name, city: form.city, link: order.link });
        setPlaced({ id: order.id, link: order.link });
        router.push(`/checkout/success/?id=${encodeURIComponent(order.id)}`);
      } catch (error) { setErrors((e) => ({ ...e, submit: error instanceof Error ? error.message : "Please try again." })); }
      finally { setSubmitting(false); }
      return;
    }
    const id = "RC-" + crypto.randomUUID().slice(0, 8).toUpperCase();
    const items = lines.map((l, i) => `${i + 1}. ${l.name} — ${l.options} × ${l.qty} = ${formatINR(l.unitPrice * l.qty)}`).join("\n");
    const msg = [
      `Order request ${id} — ${site.name}`,
      "",
      items,
      "",
      `Subtotal: ${formatINR(subtotal)}`,
      t.discount ? `Discount (${coupon}): −${formatINR(t.discount)}` : null,
      `Shipping: ${t.shipping ? formatINR(t.shipping) : "Free"}`,
      cod ? `COD fee: ${formatINR(site.codFee)}` : null,
      `TOTAL: ${formatINR(t.total)}`,
      `Payment: ${PAY.find((p) => p.id === pay)!.label}`,
      "",
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      form.email ? `Email: ${form.email}` : null,
      `Address: ${form.address}, ${form.city}, ${form.state} – ${form.pin}`,
      form.notes ? `Notes: ${form.notes}` : null,
    ].filter((x) => x !== null).join("\n");
    const link = waLink(msg);
    window.open(link, "_blank", "noopener");
    saveOrder({ id, date: new Date().toISOString(), lines, total: t.total, payment: PAY.find((p) => p.id === pay)!.label.split(" —")[0], name: form.name, city: form.city, link });
    const addr = { id: "home", label: "Home", name: form.name, phone: form.phone, address: form.address, city: form.city, state: form.state, pin: form.pin };
    updateProfile({ name: form.name, phone: form.phone, email: form.email || profile.email, addresses: [addr, ...profile.addresses.filter((x) => x.id !== "home")] });
    setPlaced({ id, link });
    router.push(`/checkout/success/?id=${encodeURIComponent(id)}`);
  };

  if (placed)
    return (
      <div className="shop-ui">
        <section className="wrap stack center" style={{ maxWidth: 720, padding: "96px 24px", alignItems: "center" }}>
          <img src="/images/logo.jpg" alt="" width={120} height={120} style={{ borderRadius: "50%" }} />
          <h1 className="shop-title" style={{ fontSize: 46 }}>Thank you, {form.name.split(" ")[0]}!</h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: "#5A4A42", margin: 0 }}>
            Your order request <strong>{placed.id}</strong> is ready. Press <strong>Send</strong> in WhatsApp so we receive it.
            Your order is confirmed only after we reply with availability and {cod ? "delivery arrangements" : "payment instructions"}. Your bag has been kept in case you need to try again.
          </p>
          <div className="row" style={{ justifyContent: "center" }}>
            <a className="btn-shop wa" href={placed.link} target="_blank" rel="noopener">WhatsApp didn&apos;t open? Tap here</a>
            <Link className="btn-shop ghost" href="/shop/">Continue shopping</Link>
          </div>
        </section>
      </div>
    );

  return (
    <div className="shop-ui">
      <div className="wrap" style={{ paddingTop: 36 }}>
        <h1 className="shop-title" style={{ fontSize: "clamp(32px, 5vw, 46px)", marginBottom: 20 }}>Delivery &amp; payment</h1>
        <ol aria-label="Checkout steps" className="row" style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 14, gap: 10 }}>
          <li><Link href="/cart/">Bag</Link></li><li aria-hidden="true">›</li><li><strong>Details &amp; payment</strong></li><li aria-hidden="true">›</li><li style={{ color: "var(--shop-muted)" }}>Confirmation</li>
        </ol>

        {!ready ? <p className="empty" role="status">Loading your bag…</p> : lines.length === 0 ? (
          <div className="empty stack" style={{ alignItems: "center" }}>
            <p style={{ margin: 0, fontSize: 18, color: "var(--shop-ink)" }}>Your bag is empty.</p>
            <Link href="/shop/" className="btn-shop dark">Go to shop</Link>
          </div>
        ) : (
          <div className="cart-layout">
            <form className="co-form" noValidate onSubmit={(e) => { e.preventDefault(); place(); }}>
              <fieldset>
                <legend>Contact</legend>
                <Field label="Full name" err={errors.name}><input autoComplete="name" value={form.name} onChange={set("name")} /></Field>
                <Field label="Mobile (WhatsApp)" err={errors.phone}><input type="tel" autoComplete="tel" inputMode="tel" value={form.phone} onChange={set("phone")} placeholder="98XXXXXXXX" /></Field>
                <Field label="Email (optional)" err={errors.email} full><input type="email" autoComplete="email" value={form.email} onChange={set("email")} /></Field>
              </fieldset>
              <fieldset>
                <legend>Delivery address</legend>
                <Field label="House / flat, street, area" err={errors.address} full><input autoComplete="street-address" value={form.address} onChange={set("address")} /></Field>
                <Field label="City" err={errors.city}><input autoComplete="address-level2" value={form.city} onChange={set("city")} /></Field>
                <Field label="State" err={errors.state}><select value={form.state} onChange={set("state")}><option value="" disabled>Choose your state</option>{STATES.map((s) => <option key={s}>{s}</option>)}</select></Field>
                <Field label="Pincode" err={errors.pin}><input inputMode="numeric" maxLength={6} autoComplete="postal-code" value={form.pin} onChange={(e) => setForm({ ...form, pin: e.target.value.replace(/\D/g, "") })} /></Field>
                <Field label="Order notes (optional)" full><textarea rows={3} value={form.notes} onChange={set("notes")} placeholder="Gift message, delivery date, measurements…" style={{ border: "1px solid var(--shop-chip)", borderRadius: 10, padding: "10px 12px" }} /></Field>
              </fieldset>
              <fieldset style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <legend>Payment</legend>
                {PAY.map((p) => (
                  <label key={p.id} className="option">
                    <span className="check"><input type="radio" name="pay" checked={pay === p.id} onChange={() => setPay(p.id)} /> {p.label}</span>
                    <span style={{ fontSize: 13, color: "var(--shop-muted)" }}>{p.note}</span>
                  </label>
                ))}
                {codBlocked && <p role="alert" style={{ margin: 0, color: "var(--shop-accent)" }}>Cash on delivery is available up to {formatINR(site.codMax)}. Please choose UPI or card.</p>}
              </fieldset>
              {errors.submit && <p role="alert" className="checkout-error">{errors.submit} <Link href="/cart/">Review bag</Link> or <a href={waLink("I need help placing an order.")} target="_blank" rel="noopener">contact us on WhatsApp</a>.</p>}
              <button className="btn-shop dark" type="submit" disabled={codBlocked || submitting} style={{ minHeight: 58 }}>
                {submitting ? "Recording your request…" : `Request order on WhatsApp · ${formatINR(t.total)}`}
              </button>
              <p style={{ margin: "-18px 0 0", fontSize: 13, color: "var(--shop-muted)" }}>
                {connected ? "Your request is recorded securely. On the next screen, open WhatsApp and send it for confirmation." : "Your order opens in WhatsApp, ready to send."} By placing it you agree to our <Link href="/policies/?t=terms">terms</Link> and <Link href="/policies/?t=returns">exchange policy</Link>.
              </p>
            </form>

            <aside className="summary" aria-label="Order summary">
              <h2 className="shop-title" style={{ fontSize: 26 }}>Your order</h2>
              {lines.map((l) => (
                <div key={l.key} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="cart-thumb" style={{ width: 60, background: l.tone, borderRadius: 10 }}><img src={l.image} alt="" /></div>
                  <div style={{ flex: 1, fontSize: 14 }}><div style={{ fontWeight: 500 }}>{l.name}</div><div style={{ color: "var(--shop-muted)" }}>{l.options} · Qty {l.qty}</div></div>
                  <span>{formatINR(l.unitPrice * l.qty)}</span>
                </div>
              ))}
              <div className="line" style={{ borderTop: "1px solid #E2C9C0", paddingTop: 14 }}><span>Subtotal</span><span>{formatINR(subtotal)}</span></div>
              {t.discount > 0 && <div className="line ok"><span>Discount ({coupon})</span><span>− {formatINR(t.discount)}</span></div>}
              <div className="line"><span>Shipping</span><span>{t.shipping ? formatINR(t.shipping) : "Free"}</span></div>
              {cod && <div className="line"><span>COD fee</span><span>{formatINR(site.codFee)}</span></div>}
              <div className="line total"><span>Total</span><span>{formatINR(t.total)}</span></div>
              <span style={{ fontSize: 13, color: "var(--shop-muted)" }}>Inclusive of GST · Delivery in 3–8 working days after dispatch</span>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, err, full, children }: { label: string; err?: string; full?: boolean; children: React.ReactNode }) {
  return (
    <label className={`field ${full ? "full" : ""}`}>
      {label}
      {children}
      {err && <span role="alert" style={{ color: "var(--shop-accent)", fontWeight: 400, fontSize: 13 }}>{err}</span>}
    </label>
  );
}
