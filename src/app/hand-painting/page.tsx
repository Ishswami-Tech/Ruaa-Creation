import type { Metadata } from "next";
import Link from "next/link";
import { products } from "@/lib/products";
import ProductCard from "@/components/ProductCard";

export const metadata: Metadata = {
  title: "Hand painting",
  description: "Florals, birds and borders painted by hand on silk, organza and chanderi — every piece one of a kind.",
};

const MOTIFS = [
  ["Lotus", "Soft pink lotus buds — our signature, straight from the Ruaa logo.", "/images/silk-a.jpg"],
  ["Peony bloom", "Full, layered petals for pallus and dupattas.", "/images/painting.png"],
  ["Gold vine border", "Fine trailing leaves in metallic paint along the border.", "/images/silk-b.jpg"],
  ["Gypsophila scatter", "Tiny all-over blossoms for a light, airy drape.", "/images/silk-c.jpg"],
];

export default function HandPaintingPage() {
  const painted = products.filter((p) => p.category === "Hand Painted");
  return (
    <>
      <section className="page-hero">
        <div className="wrap split">
          <div className="stack" style={{ gap: 22 }}>
            <span className="eyebrow">Hand Painting</span>
            <h1 className="h1">Every brushstroke,<br /><em>one of a kind.</em></h1>
            <p className="lead">Florals, birds and borders painted by hand directly onto silk, organza and chanderi. No prints, no stencils — so no two pieces are ever the same.</p>
            <div className="row"><Link href="/collections/hand-painted/" className="btn">Shop painted pieces</Link><Link href="/custom/" className="btn btn-outline">Commission a painting</Link></div>
          </div>
          <div className="framed" style={{ background: "var(--cream)" }}><img src="/images/painting.png" alt="A hand painting a pink peony with a fine brush" /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="h2 center" style={{ marginBottom: 40 }}>From sketch to silk</h2>
          <ol className="grid-auto" style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[["I. Sketch", "The motif is drawn to scale and placed on the drape — pallu, border or all-over."], ["II. Outline", "Fine outlines are traced by hand with fabric-safe liner."], ["III. Paint", "Colour is built up in layers — shading petals and leaves stroke by stroke."], ["IV. Set", "Heat-set so the colours stay bright, then finished with tassels or a border."]].map(([t, d]) => (
              <li key={t} className="stack" style={{ gap: 10, paddingTop: 20, borderTop: "2px solid var(--rose)" }}><span className="h3" style={{ color: "var(--rose)", fontSize: 24 }}>{t}</span><span style={{ color: "var(--ink-2)", lineHeight: 1.7 }}>{d}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap">
          <h2 className="h2">Signature motifs</h2>
          <p className="lead" style={{ margin: "8px 0 36px" }}>Pick one, mix them, or bring your own idea.</p>
          <div className="grid-auto">
            {MOTIFS.map(([n, d, img]) => (
              <div key={n} className="stack" style={{ gap: 12 }}>
                <div style={{ aspectRatio: "1/1", overflow: "hidden", border: "1px solid #6B5241" }}><img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <strong className="h3" style={{ fontSize: 24 }}>{n}</strong><span style={{ color: "#CDB7A6", lineHeight: 1.6 }}>{d}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap shop-ui" style={{ background: "transparent" }}>
          <h2 className="h2" style={{ marginBottom: 28 }}>Painted pieces</h2>
          <div className="product-grid">{painted.map((p) => <ProductCard key={p.slug} p={p} />)}</div>
        </div>
      </section>

      <section className="section section-sand">
        <div className="wrap split">
          <div className="prose"><h2 className="h2" style={{ marginBottom: 14 }}>Caring for painted fabric</h2><ul><li>Dry clean only for the first three washes</li><li>Never scrub or wring the painted area</li><li>Iron on the reverse, on low heat</li><li>Store folded in muslin, away from direct sunlight</li></ul></div>
          <div className="section-dark stack" style={{ padding: 36, gap: 14 }}>
            <h3 className="h3">Commission your own</h3>
            <p className="lead">Bring a saree you love or choose a fabric from us. Painting commissions start from ₹2,500 and take 10–14 days.</p>
            <Link href="/custom/" className="btn btn-blush" style={{ alignSelf: "flex-start" }}>Start a commission</Link>
          </div>
        </div>
      </section>
    </>
  );
}
