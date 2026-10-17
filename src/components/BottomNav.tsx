"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

/** Phone-only tab bar (hidden on desktop by CSS). */
export default function BottomNav() {
  const path = usePathname();
  const { count, wishlist, ready, setDrawerOpen } = useCart();
  const is = (p: string) => (p === "/" ? path === "/" : path.startsWith(p));
  const Item = ({ href, label, active, children }: { href: string; label: string; active: boolean; children: React.ReactNode }) => (
    <Link href={href} aria-current={active ? "page" : undefined}>{children}<span>{label}</span></Link>
  );
  return (
    <nav className="bottom-nav" aria-label="Quick navigation">
      <Item href="/" label="Home" active={is("/")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M4 11l8-7 8 7v9H4z" /></svg></Item>
      <Item href="/shop/" label="Shop" active={is("/shop") || is("/collections") || is("/product") || is("/search")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="4" y="4" width="7" height="7" /><rect x="13" y="4" width="7" height="7" /><rect x="4" y="13" width="7" height="7" /><rect x="13" y="13" width="7" height="7" /></svg></Item>
      <Item href="/wishlist/" label="Wishlist" active={is("/wishlist")}>
        <span className="bn-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" /></svg>{ready && wishlist.length > 0 && <b>{wishlist.length}</b>}</span>
      </Item>
      <button onClick={() => setDrawerOpen(true)} aria-label={`Bag, ${count} items`}>
        <span className="bn-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>{ready && count > 0 && <b>{count}</b>}</span><span>Bag</span>
      </button>
      <Item href="/account/" label="Account" active={is("/account")}><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4-6 8-6s7 2 8 6" /></svg></Item>
    </nav>
  );
}
