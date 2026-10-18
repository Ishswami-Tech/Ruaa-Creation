import { pageMetadata, jsonLd, websiteStructuredData } from "@/lib/seo";
import Link from "next/link";
import { getCatalogue, getCategories } from "@/lib/catalogue";
import { site, formatINR } from "@/lib/site";
import NewArrivals from "@/components/NewArrivals";
import Newsletter from "@/components/Newsletter";
import { RecentlyViewed } from "@/components/bits";

export const metadata = pageMetadata("Sarees, designer blouses & custom outfits", site.description, "/");

export default async function Home() {
  const [catalogue, shopCategories] = await Promise.all([getCatalogue(), getCategories()]);
  const categories = shopCategories.map((c) => {
    const prices = catalogue.filter((p) => p.category === c.name).map((p) => p.price);
    return { name: c.name, image: c.image || "/images/logo.jpg", href: `/collections/${c.id}/`, from: prices.length ? `From ${formatINR(Math.min(...prices))}` : "Explore collection" };
  });
  categories.push({ name: "Customised Outfits", image: "/images/custom.png", href: "/custom/", from: "Made to measure" });
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(websiteStructuredData()) }} />
      <section className="ruaa-hero" aria-label="Welcome to Ruaa Creation">
        <div className="ruaa-hero-art">
          <img src="/images/banner.jpg" width={1536} height={1024} fetchPriority="high" alt="Ruaa Creation — Woven in Elegance, with our signature floral and couture artwork" />
        </div>
        <div className="ruaa-hero-copy">
          <span className="eyebrow">The Ruaa wardrobe</span>
          <h1>Woven in<br /><em>Elegance.</em></h1>
          <p>Sarees, designer blouses &amp; outfits.<br />A little tradition. A little you.</p>
          <Link href="/shop/" className="ruaa-cta">Discover the collection <span aria-hidden="true">↗</span></Link>
          <Link href="/custom/" className="ruaa-custom">Made to your measure <span aria-hidden="true">→</span></Link>
        </div>
      </section>
      <section className="section section-sand">
        <div className="wrap">
          <div className="center stack" style={{ gap: 10, marginBottom: 40 }}>
            <span className="eyebrow">Shop by category</span>
            <h2 className="h2">The Ruaa collections</h2>
          </div>
          <div className="cat-grid">
            {categories.map((c) => (
              <Link key={c.name} href={c.href} className="cat-tile">
                <img src={c.image} width={110} height={110} loading="lazy" alt="" />
                <b>{c.name}</b>
                <small>{c.from}</small>
              </Link>
            ))}
          </div>
        </div>
      </section>


      <section className="section" style={{ paddingBottom: 0 }}>
        <div className="wrap">
          <div className="edits home-edits">
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

      <section className="section-sand home-services" style={{ padding: "64px 0" }}>
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
