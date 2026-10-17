import Link from "next/link";
import { categories } from "@/lib/products";
import { site, formatINR } from "@/lib/site";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import { RecentlyViewed } from "@/components/bits";

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap split">
          <div className="stack" style={{ gap: 24 }}>
            <span className="eyebrow">The Festive Edit · 2026</span>
            <h1 className="h1">Woven in <em>Elegance</em>,<br />ready to wear.</h1>
            <p className="lead">Sarees, designer blouses and festive sets — finished by hand, sized for you, and delivered pressed and ready for the occasion.</p>
            <div className="row">
              <Link href="/shop/" className="btn">Shop the edit</Link>
              <Link href="/custom/" className="btn btn-outline">Book a custom fit</Link>
            </div>
            <ul className="ticks">
              <li>✓ Free shipping above {formatINR(site.freeShippingAbove)}</li>
              <li>✓ Sizes XS–XXL + made to measure</li>
              <li>✓ {site.exchangeDays}-day exchange</li>
            </ul>
          </div>
          <div className="hero-arch">
            <img src="/images/banner.jpg" alt="Ruaa Creation — sarees, designer blouses, tassels, western, traditional, customised outfits and hand painting" />
          </div>
        </div>
      </section>

      <section className="section section-sand">
        <div className="wrap">
          <div className="center stack" style={{ gap: 10, marginBottom: 40 }}>
            <span className="eyebrow">Shop by category</span>
            <h2 className="h2">Seven ways to wear Ruaa</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.name} href={c.href} className="cat-tile">
                <img src={c.image} alt="" />
                <b>{c.name}</b>
                <small>{c.from}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="edits">
            <Link href="/collections/festive-edit/" className="edit-card big" style={{ background: "#F1E3D2" }}>
              <span><small>The Festive Edit</small><b>Pujo, Diwali &amp; every celebration</b><em>Shop now →</em></span>
              <img src="/images/saree.png" alt="" />
            </Link>
            <Link href="/collections/wedding-edit/" className="edit-card" style={{ background: "#F3DCD3" }}>
              <span><small>The Wedding Edit</small><b>Lehengas, shararas &amp; blouses</b><em>Shop now →</em></span>
              <img src="/images/traditional.png" alt="" />
            </Link>
            <Link href="/collections/under-3000/" className="edit-card" style={{ background: "#F5E2DC" }}>
              <span><small>Easy gifting</small><b>Under ₹3,000</b><em>Shop now →</em></span>
              <img src="/images/tassels.png" alt="" />
            </Link>
            <Link href="/collections/sale/" className="edit-card dark">
              <span><small>Limited time</small><b>Sale — up to 19% off</b><em>Shop the sale →</em></span>
              <img src="/images/western.png" alt="" />
            </Link>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <NewArrivals />
          <div className="center" style={{ marginTop: 40 }}>
            <Link href="/shop/" className="btn btn-outline">View all pieces</Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="wrap split">
          <div className="stack">
            <span className="eyebrow">Customised Outfits</span>
            <h2 className="h2">Designed around you, stitched to your measure.</h2>
            <p className="lead">Share your idea, your occasion and your measurements. We sketch, source and stitch — with a fitting before it&apos;s final. Blouses from ₹1,450, festive sets from ₹9,500.</p>
            <Link href="/custom/" className="btn btn-blush" style={{ alignSelf: "flex-start" }}>Start your design</Link>
          </div>
          <div className="circle-art"><img src="/images/custom.png" alt="Dress form with a measuring tape" /></div>
        </div>
      </section>

      <section className="section">
        <div className="wrap split">
          <div className="framed"><img src="/images/painting.png" alt="A hand painting a peony on fabric" /></div>
          <div className="stack">
            <span className="eyebrow">Hand Painting</span>
            <h2 className="h2">Every brushstroke, one of a kind.</h2>
            <p className="lead">Lotus, peony and gold-vine motifs painted by hand on sarees, dupattas and blouses. No prints, no stencils — no two pieces alike.</p>
            <Link href="/hand-painting/" className="link-arrow">Explore painted pieces →</Link>
          </div>
        </div>
      </section>

      <section className="section-sand" style={{ padding: "64px 0" }}>
        <div className="wrap promises">
          <div><strong>Free shipping</strong><span>Across India above {formatINR(site.freeShippingAbove)}</span></div>
          <div><strong>{site.exchangeDays}-day exchange</strong><span>On all ready-to-wear</span></div>
          <div><strong>Free alterations</strong><span>Within 15 days on custom orders</span></div>
          <div><strong>UPI, cards &amp; COD</strong><span>Pay the way you like</span></div>
        </div>
      </section>

      <RecentlyViewed title="Pick up where you left off" />

      <section className="section center">
        <div className="wrap stack" style={{ alignItems: "center", gap: 18 }}>
          <h2 className="h2">Join the Ruaa circle</h2>
          <p className="lead">New drops, festive edits and custom-order slots — first. Plus {site.launchDiscountPct}% off your first order.</p>
          <Newsletter />
        </div>
      </section>
    </>
  );
}
