"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { site, formatINR } from "@/lib/site";
import MiniCart from "./MiniCart";
import SearchOverlay from "./SearchOverlay";
import Brand from "./Brand";
import { useCategories } from "./CatalogueProvider";

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
  const categories = useCategories();
  const shopMenu = [{ title: "Shop by category", links: categories.map((c) => [c.name, `/collections/${c.id}/`]) }, SHOP_MENU[1]];
  const { count, ready, wishlist, setDrawerOpen, setSearchOpen } = useCart();
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const path = usePathname();
  const menuButton = useRef<HTMLButtonElement>(null);
  const shopButton = useRef<HTMLButtonElement>(null);
  const closeMenus = () => { setOpen(false); setMega(false); };

  useEffect(() => { setOpen(false); setMega(false); }, [path]);
  useEffect(() => {
    if (!open && !mega) return;
    const close = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setOpen(false); setMega(false);
      (window.matchMedia("(max-width: 980px)").matches ? menuButton.current : shopButton.current)?.focus();
    };
    document.addEventListener("keydown", close);
    return () => document.removeEventListener("keydown", close);
  }, [open, mega]);
  useEffect(() => { if (mega && window.matchMedia("(max-width: 980px)").matches) document.querySelector<HTMLAnchorElement>(".mega a")?.focus(); }, [mega]);

  return (
    <>
      <div className="announce">
        <span className="announce-mobile">Free shipping on orders above {formatINR(site.freeShippingAbove)}</span>
        <span className="announce-desktop">
        Free shipping across India above {formatINR(site.freeShippingAbove)} · COD available · Use <strong>{site.launchCode}</strong> for {site.launchDiscountPct}% off your first order
        </span>
      </div>
      <header className="site-header" onClick={(event) => { if ((event.target as HTMLElement).closest("a[href]")) closeMenus(); }}>
        <div className="wrap header-row">
          <Link href="/" className="brand-link" aria-label={`${site.name} home`}>
            <Brand />
          </Link>

          <nav aria-label="Main" className={`main-nav ${open ? "is-open" : ""}`}>
            <button ref={shopButton} className="nav-shop" aria-expanded={mega} aria-controls="mega" onClick={() => { setMega(!mega); setOpen(false); }}>
              Shop <span aria-hidden="true">▾</span>
            </button>
            {NAV.filter((n) => !["/collections/sarees/", "/collections/blouses/"].includes(n.href) || categories.some((c) => `/collections/${c.id}/` === n.href)).map((n) => (
              <Link key={n.href} href={n.href} className={"sale" in n ? "nav-sale" : undefined} aria-current={path === n.href ? "page" : undefined}>{categories.find((c) => `/collections/${c.id}/` === n.href)?.name || n.label}</Link>
            ))}
            <Link href="/account/" className="mobile-only">My orders</Link>
            <Link href="/contact/" className="mobile-only">Contact</Link>
          </nav>

          <div className="header-actions">
            <button className="icon-btn" aria-label="Search" onClick={() => { closeMenus(); setSearchOpen(true); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            </button>
            <Link href="/account/" className="icon-btn desktop-only" aria-label="My orders">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg>
            </Link>
            <Link href="/wishlist/" className="icon-btn" aria-label={`Wishlist, ${wishlist.length} items`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>
              {ready && wishlist.length > 0 && <span className="badge">{wishlist.length}</span>}
            </Link>
            <button className="icon-btn" aria-label={`Bag, ${count} items`} onClick={() => { closeMenus(); setDrawerOpen(true); }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>
              {ready && count > 0 && <span className="badge">{count}</span>}
            </button>
            <button ref={menuButton} className="icon-btn menu-btn" aria-expanded={open || mega} aria-label="Menu" onClick={() => { setOpen(!(open || mega)); setMega(false); }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                {open || mega ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </div>
        </div>

        <nav className="mobile-category-nav" aria-label="Collections">
          <Link href="/shop/">Explore all</Link>
          {categories.map((category) => <Link key={category.id} href={`/collections/${category.id}/`} aria-current={path === `/collections/${category.id}/` ? "page" : undefined}>{category.name}</Link>)}
          <Link href="/custom/">Made for you</Link>
        </nav>
        {mega && (
          <div id="mega" className="mega">
            <div className="wrap mega-grid">
              <button className="icon-btn mega-close" aria-label="Close menu" onClick={() => setMega(false)}>✕</button>
              {shopMenu.map((col) => (
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
