import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { site, waLink } from "@/lib/site";
import ContactForm from "./ContactForm";

export const metadata = pageMetadata('Contact & order enquiries', 'Contact Ruaa Creation on WhatsApp for saree orders, product questions, custom designs and fitting enquiries.', '/contact/');

export default function ContactPage() {
  return (
    <section className="section">
      <div className="wrap">
        <div className="center stack" style={{ gap: 10, marginBottom: 48 }}>
          <span className="eyebrow">Contact</span>
          <h1 className="h1" style={{ fontSize: "clamp(40px,5vw,60px)" }}>We&apos;d love to hear from you</h1>
          <p className="lead">Questions about a piece, sizing, an order or a custom design — we usually reply within a few hours.</p>
        </div>

        <div className="grid-auto" style={{ marginBottom: 56 }}>
          <a className="card section-dark" style={{ textDecoration: "none", border: 0 }} href={waLink("Hi Ruaa Creation!")} target="_blank" rel="noopener">
            <strong style={{ fontSize: 18, fontWeight: 500 }}>WhatsApp</strong><span style={{ color: "#E2CFC0" }}>{site.whatsappDisplay}</span>
            <span style={{ fontSize: 13, letterSpacing: ".12em", textTransform: "uppercase", color: "var(--blush)" }}>Fastest reply →</span>
          </a>
          <a className="card" style={{ textDecoration: "none" }} href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener"><strong style={{ fontSize: 18, fontWeight: 500 }}>Instagram</strong><span>@{site.instagram}</span><span style={{ fontSize: 13, color: "var(--ink-3)" }}>New drops &amp; behind the scenes</span></a>
        </div>

        <div className="split" style={{ alignItems: "start" }}>
          <ContactForm />
          <div className="stack" style={{ gap: 0 }}>
            <h2 className="h3" style={{ marginBottom: 12 }}>Quick answers</h2>
            {[["/policies/?t=size", "Size guide"], ["/policies/?t=shipping", "Shipping times & charges"], ["/policies/?t=returns", "Returns & exchanges"], ["/custom/", "How custom orders work"]].map(([h, l]) => (
              <Link key={h} href={h} style={{ display: "flex", justifyContent: "space-between", padding: "18px 0", borderBottom: "1px solid var(--line)", textDecoration: "none" }}><span>{l}</span><span aria-hidden="true">→</span></Link>
            ))}
            <div className="section-dark stack" style={{ padding: 24, gap: 6, marginTop: 24 }}>
              <strong style={{ fontWeight: 500 }}>Track an order</strong>
              <span style={{ color: "#E2CFC0", fontSize: 14 }}>Your tracking link is sent on WhatsApp after your order ships.</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
