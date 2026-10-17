import Link from "next/link";
import { site, waLink } from "@/lib/site";
import Brand from "./Brand";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="wrap footer-grid">
        <div className="footer-brand">
          <Brand light />
          <p>Sarees, designer blouses and ready-to-wear — finished by hand. {site.tagline}.</p>
        </div>
        <nav aria-label="Shop">
          <h2>Shop</h2>
          <Link href="/collections/sarees/">Sarees</Link>
          <Link href="/collections/blouses/">Designer Blouses</Link>
          <Link href="/collections/tassels/">Tassels</Link>
          <Link href="/collections/western/">Western Wear</Link>
          <Link href="/collections/traditional/">Traditional Wear</Link>
          <Link href="/collections/sale/">Sale</Link>
        </nav>
        <nav aria-label="Atelier">
          <h2>Atelier</h2>
          <Link href="/custom/">Customised Outfits</Link>
          <Link href="/hand-painting/">Hand Painting</Link>
          <Link href="/about/">Our Story</Link>
          <Link href="/contact/">Book an appointment</Link>
        </nav>
        <nav aria-label="Help">
          <h2>Help</h2>
          <Link href="/account/">My orders &amp; tracking</Link>
          <Link href="/wishlist/">Wishlist</Link>
          <Link href="/policies/?t=size">Size guide</Link>
          <Link href="/policies/?t=shipping">Shipping</Link>
          <Link href="/policies/?t=returns">Returns &amp; exchanges</Link>
          <Link href="/policies/?t=privacy">Privacy policy</Link>
          <Link href="/policies/?t=terms">Terms of sale</Link>
        </nav>
        <div>
          <h2>Reach us</h2>
          <a href={waLink("Hi Ruaa Creation!")} target="_blank" rel="noopener">WhatsApp {site.whatsappDisplay}</a>
          <a href={`https://instagram.com/${site.instagram}`} target="_blank" rel="noopener">Instagram @{site.instagram}</a>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
        <span>UPI · Cards · Net banking · Cash on delivery</span>
      </div>
      <a className="wa-float" href={waLink("Hi Ruaa Creation! I have a question.")} target="_blank" rel="noopener" aria-label="Chat with us on WhatsApp">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M4 20l1.3-4A8 8 0 1 1 8 18.7L4 20z" /></svg>
      </a>
    </footer>
  );
}
