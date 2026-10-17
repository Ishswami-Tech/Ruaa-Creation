"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";

export default function ContactForm() {
  const [f, setF] = useState({ name: "", phone: "", topic: "A product question", message: "" });
  const [sent, setSent] = useState(false);
  const [link, setLink] = useState("");
  const [err, setErr] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  if (sent)
    return (
      <div className="form" style={{ display: "block", padding: 48 }}>
        <h2 className="h3">Thank you — your message is ready in WhatsApp.</h2>
        <p className="lead" style={{ marginTop: 10 }}>Press send and we&apos;ll get back to you within a few hours.</p>
        <a className="btn" href={link} target="_blank" rel="noopener noreferrer">Open message in WhatsApp</a>
        <button className="btn btn-outline" style={{ marginTop: 18 }} onClick={() => setSent(false)}>Send another</button>
      </div>
    );

  return (
    <form
      className="form"
      style={{ background: "var(--sand)" }}
      onSubmit={(e) => {
        e.preventDefault();
        if (!f.name.trim() || !f.message.trim()) { setErr("Please add your name and a message."); return; }
        const destination = waLink(`Hi Ruaa Creation!\n\nName: ${f.name}\nPhone: ${f.phone || "-"}\nTopic: ${f.topic}\n\n${f.message}`);
        setLink(destination);
        window.open(destination, "_blank", "noopener");
        setSent(true);
      }}
    >
      <h2 className="h3 full">Send us a message</h2>
      <label className="field">Name<input autoComplete="name" value={f.name} onChange={set("name")} /></label>
      <label className="field">Phone (optional)<input type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
      <label className="field full">Topic
        <select value={f.topic} onChange={set("topic")}>
          <option>A product question</option><option>Size &amp; fit</option><option>My order</option><option>Custom outfit</option><option>Book a studio visit</option><option>Something else</option>
        </select>
      </label>
      <label className="field full">Message<textarea rows={5} value={f.message} onChange={set("message")} /></label>
      {err && <p role="alert" className="full" style={{ margin: 0, color: "var(--rose)" }}>{err}</p>}
      <button className="btn full" type="submit">Send on WhatsApp</button>
    </form>
  );
}
