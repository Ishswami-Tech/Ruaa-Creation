"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { site, formatINR } from "@/lib/site";
import MiniCart from "./MiniCart";
import SearchOverlay from "./SearchOverlay";

const SHOP_MENU = [
  { title: "Shop by category", links: [["Sarees", "/collections/sarees/"], ["Designer Blouses", "/collections/blouses/"], ["Tassels & Latkans", "/collections/tassels/"], ["Western Wear", "/collections/western/"], ["Traditional Wear", "/collections/traditional/"], ["Hand Painted", "/collections/hand-painted/"]] },
  { title: "Edits", links: [["New Arrivals", "/collections/new-arrivals/"], ["The Festive Edit", "/collections/festive-edit/"], ["The Wedding Edit", "/collections/wedding-edit/"], ["Under ₹3,000", "/collections/under-3000/"], ["Sale", "/collections/sale/"], ["Shop all", "/shop/"]] },
];

const NAV = [
  { href: "/collections/new-arrivals/", label: "New In" },
  { href: "/collections/sarees/", label: "Sarees" },
  { href: "/collections/blouses/", label: "Blouses" },
  { href: "/custom/", label: "Custom" },
  { href: "/hand-painting/", label: "Hand Painting" },
  { href: "/about/", label: "Our Story" },
  { href: "/collections/sale/", label: "Sale", sale: true },
];

export default function Header() {
  const { count, ready, wishlist, setDrawerOpen, setSearchOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const path = usePathname();

  useEffect(() => { setOpen(false); setMega(false); }, [path]);

  return (
    <>
      <div className="announce">
        Free shipping across India above {formatINR(site.freeShippingAbove)} · COD available · Use <strong>{site.launchCode}</strong> for {site.launchDiscountPct}% off your first order
      </div>
      <header className="site-header">
        <div className="wrap header-row">
          <Link href="/" className="brand" aria-label={`${site.name} home`}>
            <img src="/images/logo.jpg" alt="" width={56} height={56} />
            <span>{site.name}</span>
          </Link>

          <nav aria-label="Main" className={`main-nav ${open ? "is-open" : ""}`}>
            <button className="nav-shop" aria-expanded={mega} aria-controls="mega" onClick={() => setMega(!mega)}>
              Shop <span aria-hidden="true">▾</span>
            </button>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className={"sale" in n ? "nav-sale" : undefined} aria-current={path === n.href ? "page" : undefined}>{n.label}</Link>
            ))}
            <Link href="/account/" className="mobile-only">My orders</Link>
            <Link href="/contact/" className="mobile-only">Contact</Link>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            </button>
            <Link href="/account/" className="icon-btn desktop-only" aria-label="My orders">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>
            </Link>
            <Link href="/wishlist/" className="icon-btn" aria-label={`Wishlist, ${wishlist.length} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
              {ready && wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" aria-label={`Bag, ${count} items`} onClick={() => setDrawerOpen(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              {ready && count > 0 && <span className="badge">{count}</span>}
            </button>
            <button className="icon-btn menu-btn" aria-expanded={open} aria-label="Menu" onClick={() => setOpen(!open)}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        {mega && (
          <div id="mega" className="mega">
            <div className="wrap mega-grid">
              <button className="icon-btn mega-close" aria-label="Close menu" onClick={() => setMega(false)}>✕</button>
              {SHOP_MENU.map((col) => (
                <div key={col.title}>
                  <h2>{col.title}</h2>
                  {col.links.map(([l, h]) => <Link key={h} href={h}>{l}</Link>)}
                </div>
              ))}
              <Link href="/collections/festive-edit/" className="mega-card" style={{ background: "#F1E3D2" }}>
                <img src="/images/saree.png" alt="" />
                <span><small>The Festive Edit</small><br />Sarees, blouses &amp; sets for the season →</span>
              </Link>
              <Link href="/custom/" className="mega-card" style={{ background: "#F3DCD3" }}>
                <img src="/images/custom.png" alt="" />
                <span><small>Made for you</small><br />Customised outfits from ₹1,450 →</span>
              </Link>
            </div>
          </div>
        )}
      </header>
      <MiniCart />
      <SearchOverlay />
    </>
  );
}
