import type { Metadata } from "next";
import Link from "next/link";
import CustomBrief from "./CustomBrief";

export const metadata: Metadata = {
  title: "Customised outfits",
  description: "Designer blouses, festive sets and western outfits designed around you and stitched to your measurements.",
};

const FAQ = [
  ["How long does a custom outfit take?", "Blouses take 7–10 days. Festive and bridal sets take 3–4 weeks. Rush orders are possible for an extra charge, depending on our calendar."],
  ["Can I give you my own fabric?", "Yes. Bring or courier your fabric and we'll stitch it to your design. Stitching-only prices apply."],
  ["What if it doesn't fit?", "Alterations within 15 days of delivery are free. We fit-check every piece against your measurements before it ships."],
  ["Can I order if I live in another city?", "Yes, we ship across India. Measurements can be taken over a guided video call."],
  ["How do I pay?", "A 50% advance confirms your order once you approve the sketch and quote. The balance is due before dispatch."],
];

export default function CustomPage() {
  return (
    <>
      <section className="section">
        <div className="wrap split">
          <div className="stack" style={{ gap: 22 }}>
            <span className="eyebrow">Customised Outfits</span>
            <h1 className="h1">Designed around you,<br /><em>stitched to your measure.</em></h1>
            <p className="lead">Bring a reference photo, a colour you love or just an occasion. We sketch it, source the fabric, and stitch it to your measurements — with a fitting before it&apos;s final.</p>
            <div className="row"><a href="#brief" className="btn">Start your design</a><Link href="/contact/" className="btn btn-outline">Book a studio visit</Link></div>
          </div>
          <div className="circle-art"><img src="/images/custom.png" alt="Dress form with a measuring tape" /></div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap">
          <h2 className="h2 center" style={{ marginBottom: 40 }}>How it works</h2>
          <ol className="steps">
            <li><span className="num">01</span><strong>Share your idea</strong><p>Fill the brief below or WhatsApp us a reference. We reply within 24 hours.</p><small>Day 1</small></li>
            <li><span className="num">02</span><strong>Sketch, fabric &amp; quote</strong><p>Approve the sketch, swatches and a fixed price. 50% advance confirms the order.</p><small>Days 2–4</small></li>
            <li><span className="num">03</span><strong>Stitch &amp; trial</strong><p>Crafted to your measurements, with a trial fitting in-studio or over video.</p><small>Weeks 1–3</small></li>
            <li><span className="num">04</span><strong>Finish &amp; deliver</strong><p>Final alterations, pressing and the Ruaa gift box — delivered anywhere in India.</p><small>Weeks 2–4</small></li>
          </ol>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="h2 center">What we make</h2>
          <p className="lead center" style={{ margin: "10px auto 40px" }}>Indicative starting prices — your final quote depends on fabric and work.</p>
          <div className="grid-auto">
            <div className="card"><div className="card-img" style={{ background: "#F2E4D6" }}><img src="/images/blouse.png" alt="" /></div><h3 className="h3">Designer blouses</h3><p>Princess cut, sweetheart, high neck, backless — with your fabric or ours.</p><strong>From ₹1,450 stitching</strong></div>
            <div className="card"><div className="card-img" style={{ background: "#F3DCD3" }}><img src="/images/traditional.png" alt="" /></div><h3 className="h3">Festive &amp; bridal sets</h3><p>Lehengas, anarkalis and shararas for weddings, sangeet and pujo.</p><strong>From ₹9,500</strong></div>
            <div className="card"><div className="card-img" style={{ background: "#F6E4DE" }}><img src="/images/western.png" alt="" /></div><h3 className="h3">Western &amp; Indo-western</h3><p>Dresses, co-ords and gowns for parties, receptions and trips.</p><strong>From ₹3,800</strong></div>
          </div>
        </div>
      </section>

      <section id="brief" className="section section-sand">
        <div className="wrap" style={{ maxWidth: 860 }}><CustomBrief /></div>
      </section>

      <section className="section">
        <div className="wrap" style={{ maxWidth: 820 }}>
          <h2 className="h2 center" style={{ marginBottom: 24 }}>Common questions</h2>
          <div className="faq">
            {FAQ.map(([q, a], i) => (<details key={q} open={i === 0}><summary>{q}</summary><p>{a}</p></details>))}
          </div>
        </div>
      </section>
    </>
  );
}
