"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart, type Address } from "@/components/CartProvider";
import { formatINR, site, waLink } from "@/lib/site";

const TABS = [["orders", "My orders"], ["measure", "My measurements"], ["addr", "Saved addresses"], ["track", "Track an order"]] as const;
type Tab = (typeof TABS)[number][0];
const MEASURES = ["Bust", "Under-bust", "Waist", "Hip", "Shoulder", "Sleeve length", "Blouse length"];
const STATES = ["Andhra Pradesh","Assam","Bihar","Chhattisgarh","Delhi","Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh","Maharashtra","Odisha","Punjab","Rajasthan","Tamil Nadu","Telangana","Uttar Pradesh","Uttarakhand","West Bengal","Other"];
const cleanPhone = (v: string) => v.replace(/[\s()-]/g, "").replace(/^(?:\+91|91)(?=\d{10}$)/, "");

export default function AccountPage() {
  const { orders, ready, add, profile, updateProfile, notify } = useCart();
  const [tab, setTab] = useState<Tab>("orders");

  if (!ready) return <div className="shop-ui"><p className="empty" role="status">Loading…</p></div>;
  if (!profile.signedIn) return <SignIn onDone={(name, phone) => updateProfile({ name: name || profile.name, phone, signedIn: true })} />;

  return (
    <div className="shop-ui">
      <div className="wrap account">
        <aside className="account-nav">
          <div className="row" style={{ gap: 12, marginBottom: 14 }}>
            <span className="avatar">{(profile.name || "R").charAt(0).toUpperCase()}</span>
            <span><strong>{profile.name || "Welcome"}</strong><br /><span style={{ fontSize: 13, color: "var(--shop-muted)" }}>+91 {profile.phone}</span></span>
          </div>
          {TABS.map(([k, l]) => <button key={k} aria-current={tab === k} onClick={() => setTab(k)}>{l}</button>)}
          <Link href="/wishlist/">Wishlist</Link>
          <button className="danger" onClick={() => updateProfile({ signedIn: false })}>Log out</button>
        </aside>

        <div className="results" style={{ gap: 20 }}>
          {tab === "orders" && <Orders />}
          {tab === "measure" && <Measurements />}
          {tab === "addr" && <Addresses />}
          {tab === "track" && <Track />}
        </div>
      </div>
    </div>
  );

  function Orders() {
    return (
      <>
        <h1 className="shop-title" style={{ fontSize: 40 }}>My orders</h1>
        <p style={{ margin: "-10px 0 0", color: "var(--shop-muted)" }}>Order requests made from this device. An order is confirmed only when we reply on WhatsApp.</p>
        {orders.length === 0 ? (
          <div className="empty stack" style={{ alignItems: "center", border: "1px dashed var(--shop-chip)", borderRadius: 20 }}>
            <p style={{ margin: 0, fontSize: 18, color: "var(--shop-ink)" }}>No orders yet.</p>
            <Link href="/shop/" className="btn-shop dark">Start shopping</Link>
          </div>
        ) : orders.map((o) => (
          <article key={o.id} className="order-card">
            <div className="toolbar">
              <div><strong style={{ fontSize: 17 }}>{o.id}</strong><br /><small style={{ color: "var(--shop-muted)" }}>{new Date(o.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })} · {o.payment} · {formatINR(o.total)}</small></div>
              <span className="pill" style={{ position: "static", background: "#FDF1E3", color: "#8A4B12" }}>Request sent — awaiting confirmation</span>
            </div>
            <div className="row" style={{ gap: 10, margin: "14px 0" }}>
              {o.lines.map((l) => <Link key={l.key} href={`/product/${l.slug}/`} className="cart-thumb" title={l.name} style={{ width: 64, background: l.tone, borderRadius: 10 }}><img src={l.image} alt={l.name} /></Link>)}
            </div>
            <div className="row" style={{ gap: 8 }}>
              <a className="btn-sm" href={o.link || waLink(`Hi ${site.name}! Could you share the status of my order ${o.id}?`)} target="_blank" rel="noopener">{o.link ? "Resend on WhatsApp" : "Ask on WhatsApp"}</a>
              <a className="btn-sm" href={waLink(`Hi ${site.name}! Could you share the status of my order ${o.id}?`)} target="_blank" rel="noopener">Track on WhatsApp</a>
              <button className="btn-sm" onClick={() => { o.lines.forEach((l) => add({ slug: l.slug, name: l.name, image: l.image, tone: l.tone, options: l.options, unitPrice: l.unitPrice }, l.qty)); }}>Buy again</button>
            </div>
          </article>
        ))}
      </>
    );
  }

  function Measurements() {
    const [m, setM] = useState<Record<string, string>>(profile.measurements);
    return (
      <>
        <h1 className="shop-title" style={{ fontSize: 40 }}>My measurements</h1>
        <p style={{ margin: "-10px 0 0", color: "var(--shop-muted)" }}>Saved on this device and added to your custom-order brief. Inches.</p>
        <form className="stack" onSubmit={(e) => { e.preventDefault(); updateProfile({ measurements: m }); notify("Measurements saved"); }}>
          <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            {MEASURES.map((k) => (
              <label key={k} className="field">{k}<input inputMode="decimal" value={m[k] ?? ""} onChange={(e) => setM({ ...m, [k]: e.target.value.replace(/[^\d.]/g, "").slice(0, 5) })} style={{ borderRadius: 10, borderColor: "var(--shop-chip)" }} /></label>
            ))}
          </div>
          <div className="row"><button className="btn-shop dark" type="submit">Save measurements</button><Link href="/contact/" className="btn-shop ghost">Book a video fitting</Link></div>
        </form>
      </>
    );
  }

  function Addresses() {
    const empty: Address = { id: "", label: "Home", name: profile.name, phone: profile.phone, address: "", city: "", state: "West Bengal", pin: "" };
    const [draft, setDraft] = useState<Address | null>(null);
    const [err, setErr] = useState("");
    const save = () => {
      if (!draft) return;
      if (!draft.name.trim() || !draft.address.trim() || !draft.city.trim() || !/^[1-9]\d{5}$/.test(draft.pin) || !/^[6-9]\d{9}$/.test(cleanPhone(draft.phone))) { setErr("Please fill name, a 10-digit mobile, address, city and a 6-digit pincode."); return; }
      const a = { ...draft, id: draft.id || "a" + Date.now() };
      updateProfile({ addresses: [a, ...profile.addresses.filter((x) => x.id !== a.id)] });
      setDraft(null); setErr(""); notify("Address saved");
    };
    return (
      <>
        <h1 className="shop-title" style={{ fontSize: 40 }}>Saved addresses</h1>
        <div className="grid-auto" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14 }}>
          {profile.addresses.map((a, i) => (
            <div key={a.id} className="addr-card" data-default={i === 0 ? "1" : "0"}>
              <strong>{a.label}{i === 0 ? " · Default" : ""}</strong>
              <span style={{ color: "#5A4A42", fontSize: 14, lineHeight: 1.6 }}>{a.name}<br />{a.address}<br />{a.city}, {a.state} {a.pin}<br />+91 {cleanPhone(a.phone)}</span>
              <div className="row" style={{ gap: 6 }}>
                <button className="text-btn" style={{ color: "var(--shop-ink)" }} onClick={() => setDraft(a)}>Edit</button>
                {i > 0 && <button className="text-btn" style={{ color: "var(--shop-ink)" }} onClick={() => updateProfile({ addresses: [a, ...profile.addresses.filter((x) => x.id !== a.id)] })}>Make default</button>}
                <button className="text-btn" onClick={() => updateProfile({ addresses: profile.addresses.filter((x) => x.id !== a.id) })}>Remove</button>
              </div>
            </div>
          ))}
          <button className="addr-card add" onClick={() => setDraft(empty)}>+ Add a new address</button>
        </div>
        {draft && (
          <form className="co-form" style={{ background: "var(--shop-soft)", borderRadius: 20, padding: 24 }} noValidate onSubmit={(e) => { e.preventDefault(); save(); }}>
            <fieldset>
              <legend style={{ fontSize: 22 }}>{draft.id ? "Edit address" : "New address"}</legend>
              <label className="field">Label<input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value.slice(0, 20) })} /></label>
              <label className="field">Full name<input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} /></label>
              <label className="field">Mobile<input type="tel" value={draft.phone} onChange={(e) => setDraft({ ...draft, phone: e.target.value })} /></label>
              <label className="field full">House / flat, street, area<input value={draft.address} onChange={(e) => setDraft({ ...draft, address: e.target.value })} /></label>
              <label className="field">City<input value={draft.city} onChange={(e) => setDraft({ ...draft, city: e.target.value })} /></label>
              <label className="field">State<select value={draft.state} onChange={(e) => setDraft({ ...draft, state: e.target.value })}>{STATES.map((s) => <option key={s}>{s}</option>)}</select></label>
              <label className="field">Pincode<input inputMode="numeric" maxLength={6} value={draft.pin} onChange={(e) => setDraft({ ...draft, pin: e.target.value.replace(/\D/g, "") })} /></label>
            </fieldset>
            {err && <p role="alert" style={{ margin: 0, color: "var(--shop-accent)", fontSize: 14 }}>{err}</p>}
            <div className="row"><button className="btn-shop dark" type="submit">Save address</button><button type="button" className="btn-shop ghost" onClick={() => setDraft(null)}>Cancel</button></div>
          </form>
        )}
      </>
    );
  }

  function Track() {
    const [t, setT] = useState({ id: "", phone: profile.phone });
    const [err, setErr] = useState("");
    return (
      <form className="stack" style={{ maxWidth: 520 }} onSubmit={(e) => { e.preventDefault(); if (!t.id.trim()) { setErr("Please enter your order number (it starts with RC-)."); return; } setErr(""); window.open(waLink(`Hi ${site.name}! Could you share the status of my order ${t.id.trim()}?${t.phone ? `\nPhone: ${t.phone}` : ""}`), "_blank", "noopener"); }}>
        <h1 className="shop-title" style={{ fontSize: 40 }}>Track an order</h1>
        <p style={{ margin: "-10px 0 0", color: "var(--shop-muted)" }}>We&apos;ll reply with the courier and tracking link on WhatsApp.</p>
        <label className="field">Order number<input placeholder="RC-…" value={t.id} onChange={(e) => setT({ ...t, id: e.target.value })} style={{ borderRadius: 10, borderColor: "var(--shop-chip)" }} /></label>
        <label className="field">Mobile number<input type="tel" value={t.phone} onChange={(e) => setT({ ...t, phone: e.target.value })} style={{ borderRadius: 10, borderColor: "var(--shop-chip)" }} /></label>
        {err && <p role="alert" style={{ margin: 0, color: "var(--shop-accent)", fontSize: 14 }}>{err}</p>}
        <button className="btn-shop wa" type="submit" style={{ alignSelf: "flex-start" }}>Get status on WhatsApp</button>
      </form>
    );
  }
}

/** Device-only sign-in: there is no server account yet. The number identifies the customer for order messages. */
function SignIn({ onDone }: { onDone: (name: string, phone: string) => void }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [err, setErr] = useState("");
  return (
    <div className="shop-ui">
      <section className="wrap split" style={{ maxWidth: 1120, padding: "64px 24px 88px", alignItems: "center" }}>
        <div className="stack" style={{ background: "var(--shop-panel)", borderRadius: 24, padding: 40, gap: 16 }}>
          <img src="/images/logo.jpg" alt="" width={88} height={88} style={{ borderRadius: "50%" }} />
          <h1 className="shop-title" style={{ fontSize: 40 }}>Welcome to Ruaa</h1>
          <ul style={{ margin: 0, paddingLeft: 20, color: "#5A4A42", lineHeight: 1.9 }}>
            <li>See your order requests and ask for status in one tap</li>
            <li>Save your measurements for custom orders</li>
            <li>Keep addresses ready for faster checkout</li>
          </ul>
          <p style={{ margin: 0, fontSize: 13, color: "var(--shop-muted)" }}>Details are saved on this device only.</p>
        </div>
        <form className="stack" style={{ gap: 14 }} noValidate onSubmit={(e) => { e.preventDefault(); const p = cleanPhone(phone); if (!/^[6-9]\d{9}$/.test(p)) { setErr("Enter a 10-digit Indian mobile number."); return; } onDone(name.trim(), p); }}>
          <h2 className="shop-title" style={{ fontSize: 30 }}>Continue with your mobile</h2>
          <label className="field">Your name (optional)<input autoComplete="name" value={name} onChange={(e) => setName(e.target.value.slice(0, 80))} style={{ borderRadius: 12, borderColor: "var(--shop-chip)" }} /></label>
          <label className="field">Mobile number
            <div style={{ display: "flex", border: "1px solid var(--shop-chip)", borderRadius: 12, overflow: "hidden" }}><span style={{ padding: "0 14px", display: "flex", alignItems: "center", background: "var(--shop-soft)", borderRight: "1px solid var(--shop-chip)", fontWeight: 400 }}>+91</span><input type="tel" autoComplete="tel" inputMode="tel" placeholder="98765 43210" value={phone} onChange={(e) => setPhone(e.target.value)} style={{ flex: 1, minWidth: 0, height: 52, border: 0, padding: "0 14px", fontSize: 16 }} /></div></label>
          {err && <p role="alert" style={{ margin: 0, color: "var(--shop-accent)", fontSize: 14 }}>{err}</p>}
          <button className="btn-shop dark" type="submit" style={{ minHeight: 54 }}>Continue</button>
          <p style={{ margin: 0, fontSize: 13, color: "var(--shop-muted)" }}>By continuing you agree to our <Link href="/policies/?t=terms">terms</Link> and <Link href="/policies/?t=privacy">privacy policy</Link>.</p>
        </form>
      </section>
    </div>
  );
}
