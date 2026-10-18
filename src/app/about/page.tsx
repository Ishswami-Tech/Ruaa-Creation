import { pageMetadata } from "@/lib/seo";
import Link from "next/link";

export const metadata = pageMetadata('Our story', 'Discover Ruaa Creation: sarees, designer blouses and custom outfits, finished by hand and made to fit.', '/about/');

const VALUES = [
  ["Made by hand", "Painting, tassels, finishing — the details are done by hand, not by machine.", "/images/painting.png"],
  ["Made to fit", "Ready sizes from XS to XXL, and any piece can be altered or stitched to measure.", "/images/custom.png"],
  ["Small batches", "We make a few of each design, so what you wear stays special.", "/images/saree.png"],
  ["Honest pricing", "Clear prices, GST included, and a fixed quote before any custom work begins.", "/images/tassels.png"],
];

export default function AboutPage() {
  return (
    <>
      <section className="section center">
        <div className="wrap stack" style={{ alignItems: "center", gap: 24, maxWidth: 980 }}>
          <img src="/images/logo.jpg" alt="Ruaa Creation logo" width={200} height={200} style={{ borderRadius: "50%" }} />
          <span className="eyebrow">Our Story</span>
          <h1 className="h1" style={{ fontSize: "clamp(40px,5vw,64px)" }}>Clothes that feel made for you — <em>because they are.</em></h1>
          <p className="lead" style={{ maxWidth: 720 }}>Ruaa Creation began with a simple idea: beautiful Indian wear shouldn&apos;t mean weeks at the tailor or settling for &ldquo;almost right&rdquo;. So we make pieces that arrive ready to wear, fit like they were stitched for you, and carry a little handwork you won&apos;t find anywhere else.</p>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <h2 className="h2 center" style={{ marginBottom: 40 }}>What Ruaa stands for</h2>
          <div className="grid-auto">
            {VALUES.map(([t, d, img]) => (
              <div key={t} className="card"><img src={img} alt="" style={{ width: 96, height: 64, objectFit: "contain", mixBlendMode: "multiply" }} /><h3 className="h3">{t}</h3><p>{d}</p></div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap split">
          <div className="stack">
            <span className="eyebrow">The mark</span>
            <h2 className="h2">A lotus, a drape and a hanger.</h2>
            <p className="lead">The R in our logo grows a lotus bud for craft that blooms slowly. A blush silk drape flows through the letters for the sarees we love, and the hanger above it is our promise: everything arrives ready to wear.</p>
          </div>
          <img src="/images/banner.jpg" alt="The full Ruaa Creation brand artwork" style={{ width: "100%", border: "6px solid #F6E7DA" }} />
        </div>
      </section>

      <section className="section center">
        <div className="wrap stack" style={{ alignItems: "center", gap: 18 }}>
          <h2 className="h2">Come say hello</h2>
          <p className="lead">Visit the studio by appointment, or browse the edit online.</p>
          <div className="row" style={{ justifyContent: "center" }}><Link href="/shop/" className="btn">Shop the edit</Link><Link href="/contact/" className="btn btn-outline">Book a visit</Link></div>
        </div>
      </section>
    </>
  );
}
