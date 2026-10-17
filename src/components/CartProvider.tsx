"use client";

/**
 * Store state for the whole site: bag, wishlist, recently viewed, saved order
 * requests, customer profile (name, phone, measurements, addresses), the
 * slide-out bag and the search overlay. Everything is kept in the visitor's
 * own browser (localStorage); nothing is sent to a server.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { restoreCart, quantity } from "@/lib/cart";
import { getProduct } from "@/lib/products";

export type CartLine = {
  key: string;
  slug: string;
  name: string;
  image: string;
  tone: string;
  options: string; // human-readable, e.g. "Size M · Blouse: ready"
  unitPrice: number;
  qty: number;
};

export type SavedOrder = {
  id: string;
  date: string;
  lines: CartLine[];
  total: number;
  payment: string;
  name: string;
  city: string;
  link: string;
};

export type Address = { id: string; label: string; name: string; phone: string; address: string; city: string; state: string; pin: string };
export type Measurements = Record<string, string>;
export type Profile = { name: string; phone: string; email: string; measurements: Measurements; addresses: Address[]; signedIn: boolean };

type StoreCtx = {
  ready: boolean;
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "key" | "qty">, qty?: number) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  setDrawerOpen: (v: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (v: boolean) => void;
  wishlist: string[];
  toggleWish: (slug: string) => void;
  isWished: (slug: string) => boolean;
  recent: string[];
  markViewed: (slug: string) => void;
  orders: SavedOrder[];
  saveOrder: (o: SavedOrder) => void;
  profile: Profile;
  updateProfile: (patch: Partial<Profile>) => void;
  toast: string | null;
  notify: (msg: string) => void;
};

const Ctx = createContext<StoreCtx | null>(null);
const K = { cart: "ruaa-cart-v1", wish: "ruaa-wish-v1", recent: "ruaa-recent-v1", orders: "ruaa-orders-v1", profile: "ruaa-profile-v1" };
const EMPTY_PROFILE: Profile = { name: "", phone: "", email: "", measurements: {}, addresses: [], signedIn: false };

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function save(key: string, v: unknown) {
  try { localStorage.setItem(key, JSON.stringify(v)); } catch {}
}
const slugList = (v: unknown) => (Array.isArray(v) ? v.filter((s): s is string => typeof s === "string" && !!getProduct(s)).slice(0, 100) : []);

function restoreOrders(v: unknown): SavedOrder[] {
  if (!Array.isArray(v)) return [];
  return v
    .filter((o) => o && typeof o === "object" && typeof o.id === "string" && typeof o.date === "string" && Array.isArray(o.lines))
    .map((o) => ({ id: String(o.id).slice(0, 60), date: o.date, lines: restoreCart(o.lines), total: Number(o.total) || 0, payment: String(o.payment ?? "").slice(0, 60), name: String(o.name ?? "").slice(0, 80), city: String(o.city ?? "").slice(0, 80), link: typeof o.link === "string" && o.link.startsWith("https://wa.me/") ? o.link : "" }))
    .slice(0, 50);
}
function restoreProfile(v: unknown): Profile {
  if (!v || typeof v !== "object") return EMPTY_PROFILE;
  const p = v as Partial<Profile>;
  return {
    name: String(p.name ?? "").slice(0, 80),
    phone: String(p.phone ?? "").slice(0, 20),
    email: String(p.email ?? "").slice(0, 120),
    measurements: p.measurements && typeof p.measurements === "object" ? Object.fromEntries(Object.entries(p.measurements).slice(0, 12).map(([k, val]) => [k.slice(0, 30), String(val).slice(0, 10)])) : {},
    addresses: Array.isArray(p.addresses) ? p.addresses.filter((a) => a && typeof a === "object" && typeof a.id === "string").slice(0, 10) : [],
    signedIn: !!p.signedIn,
  };
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [orders, setOrders] = useState<SavedOrder[]>([]);
  const [profile, setProfile] = useState<Profile>(EMPTY_PROFILE);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setLines(restoreCart(load(K.cart, [])));
    setWishlist(slugList(load(K.wish, [])));
    setRecent(slugList(load(K.recent, [])));
    setOrders(restoreOrders(load(K.orders, [])));
    setProfile(restoreProfile(load(K.profile, null)));
    setReady(true);
  }, []);

  useEffect(() => { if (ready) save(K.cart, lines); }, [lines, ready]);
  useEffect(() => { if (ready) save(K.wish, wishlist); }, [wishlist, ready]);
  useEffect(() => { if (ready) save(K.recent, recent); }, [recent, ready]);
  useEffect(() => { if (ready) save(K.orders, orders); }, [orders, ready]);
  useEffect(() => { if (ready) save(K.profile, profile); }, [profile, ready]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2600);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen || searchOpen ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setDrawerOpen(false); setSearchOpen(false); } };
    window.addEventListener("keydown", onKey);
    return () => { window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [drawerOpen, searchOpen]);

  const add = useCallback((line: Omit<CartLine, "key" | "qty">, qty = 1) => {
    const key = `${line.slug}|${line.options}`;
    setLines((prev) => {
      const found = prev.find((l) => l.key === key);
      if (found) return restoreCart(prev.map((l) => (l.key === key ? { ...l, qty: quantity(l.qty + quantity(qty)) } : l)));
      return restoreCart([...prev, { ...line, key, qty: quantity(qty) }]);
    });
    setDrawerOpen(true);
  }, []);
  const setQty = useCallback((key: string, qty: number) => setLines((p) => p.map((l) => (l.key === key ? { ...l, qty: quantity(qty) } : l))), []);
  const remove = useCallback((key: string) => setLines((p) => p.filter((l) => l.key !== key)), []);
  const clear = useCallback(() => setLines([]), []);

  const toggleWish = useCallback((slug: string) => {
    setWishlist((p) => {
      const on = p.includes(slug);
      setToast(on ? "Removed from wishlist" : "Saved to your wishlist");
      return on ? p.filter((s) => s !== slug) : [slug, ...p].slice(0, 100);
    });
  }, []);
  const isWished = useCallback((slug: string) => wishlist.includes(slug), [wishlist]);
  const markViewed = useCallback((slug: string) => setRecent((p) => [slug, ...p.filter((s) => s !== slug)].slice(0, 12)), []);
  const saveOrder = useCallback((o: SavedOrder) => setOrders((p) => [o, ...p].slice(0, 50)), []);
  const updateProfile = useCallback((patch: Partial<Profile>) => setProfile((p) => restoreProfile({ ...p, ...patch })), []);

  const value = useMemo(() => {
    const count = lines.reduce((a, l) => a + l.qty, 0);
    const subtotal = lines.reduce((a, l) => a + l.qty * l.unitPrice, 0);
    return {
      ready, lines, count, subtotal, add, setQty, remove, clear,
      drawerOpen, setDrawerOpen, searchOpen, setSearchOpen,
      wishlist, toggleWish, isWished, recent, markViewed, orders, saveOrder, profile, updateProfile,
      toast, notify: setToast,
    };
  }, [ready, lines, add, setQty, remove, clear, drawerOpen, searchOpen, wishlist, toggleWish, isWished, recent, markViewed, orders, saveOrder, profile, updateProfile, toast]);

  return (
    <Ctx.Provider value={value}>
      {children}
      <div className="toast" role="status" aria-live="polite" data-show={toast ? "1" : "0"}>{toast}</div>
    </Ctx.Provider>
  );
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
}
