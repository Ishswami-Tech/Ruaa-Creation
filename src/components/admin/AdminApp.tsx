"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Brand from "../Brand";
import { formatINR } from "@/lib/site";
import type { AdminData, ManagedProduct, StoreCategory, AdminOrder } from "@/lib/admin/types";
import { ORDER_STATUSES } from "@/lib/admin/types";
import ProductEditor from "./ProductEditor";
import MediaLibrary from "./MediaLibrary";

export async function adminFetch(path: string, method = "GET", body?: unknown) {
  const response = await fetch(`/api/admin/${path}/`, { method, headers: body instanceof FormData ? undefined : { "Content-Type": "application/json" }, body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined, cache: "no-store" });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "The request could not be completed.");
  return data;
}
const tabs = ["Overview", "Products", "Categories", "Orders", "Images"] as const;
type Tab = typeof tabs[number];
const label = (s: string) => s.replaceAll("_", " ");

function NavIcon({ name }: { name: string }) {
  const paths: Record<string, React.ReactNode> = {
    Overview: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    Products: <><path d="m3 7 9-4 9 4v10l-9 4-9-4Z M3 7l9 4 9-4 M12 11v10 M7 5l10 4" /></>,
    Categories: <><path d="M3 7h18v14H3z M3 7V3h7l3 4" /></>,
    Orders: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z M9 8h6 M9 12h6 M9 16h3" /></>,
    Images: <><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8" cy="8" r="1" /><path d="m3 17 5-5 4 4 4-6 5 7" /></>,
  };
  return <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
}

export default function AdminApp({ initial }: { initial: AdminData }) {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("Overview");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [editing, setEditing] = useState<ManagedProduct | null>(null);
  const [category, setCategory] = useState<StoreCategory | null>(null);
  const [order, setOrder] = useState<AdminOrder | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const { products, categories, orders, configured } = initial;
  const published = products.filter((p) => p.status === "published");
  const lowStock = products.filter((p) => p.status === "published" && (p.stock ?? 0) <= 5);
  const pending = orders.filter((o) => o.status === "requested");
  const visible = useMemo(() => products.filter((p) => (filter === "all" || (filter === "low" ? p.status === "published" && (p.stock ?? 0) <= 5 : p.status === filter)) && `${p.name} ${p.category} ${p.slug}`.toLowerCase().includes(query.toLowerCase())), [products, filter, query]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 5000); return () => clearTimeout(timer); }, [notice]);
  useEffect(() => {
    if (!configured || editing || category || order || busy) return;
    const timer = setInterval(() => { if (document.visibilityState === "visible") router.refresh(); }, 30000);
    return () => clearInterval(timer);
  }, [configured, editing, category, order, busy, router]);
  const logout = async () => { try { await adminFetch("session", "DELETE"); window.location.assign("/admin/login/"); } catch { setError("Could not sign out. Please try again."); } };
  const changeTab = (value: Tab) => { setTab(value); setQuery(""); setFilter("all"); setError(""); };
  const save = async (path: string, data: unknown, message: string, method = "POST") => {
    if (!configured) { setError("Database connection pending. This preview cannot save changes."); return false; }
    setBusy(true); setError("");
    try { await adminFetch(path, method, data); setNotice(message); router.refresh(); return true; }
    catch (e) { setError(e instanceof Error ? e.message : "Please try again."); return false; }
    finally { setBusy(false); }
  };
  const newProduct = () => setEditing({ slug: "", name: "", category: categories[0]?.name || "", price: 0, fabric: "", images: [], tone: "#F3DDD6", occasions: ["Everyday"], stock: 0, description: "", details: [], care: [], status: "draft", updatedAt: "", version: 0 });
  return <div className="admin-app">
    <aside className="admin-sidebar">
      <Link className="admin-brand" href="/admin/" aria-label="Ruaa admin home"><Brand /></Link>
      <span className="admin-workspace-label">STORE MANAGEMENT</span>
      <nav aria-label="Admin sections">{tabs.map((t) => <button key={t} onClick={() => changeTab(t)} aria-current={tab === t ? "page" : undefined}><NavIcon name={t} /><span>{t}</span>{t === "Orders" && pending.length > 0 && <small>{pending.length}</small>}</button>)}</nav>
      <div className="admin-sidebar-bottom"><Link href="/" target="_blank">Visit storefront <span aria-hidden="true">↗</span></Link><p>Ruaa Creation<br /><small>{configured ? initial.email : "Database setup pending"}</small></p>{configured && <button onClick={logout}>Sign out</button>}</div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar"><span>Ruaa Creation <span className="admin-breadcrumb">/ {tab}</span></span><div className="admin-topbar-actions"><Link href="/shop/" target="_blank">View shop <span aria-hidden="true">↗</span></Link>{configured && <button className="admin-text-button" onClick={logout}>Sign out</button>}</div></header>
      <div className="admin-content">
        {!configured && <div className="admin-setup" role="status"><strong>Preview · Database connection pending</strong><span>Explore the panel and product editor. Connect PostgreSQL and create an admin account to save products, upload photos and receive orders.</span></div>}
        <div className="admin-page-heading"><div><h1>{tab === "Overview" ? "Your studio, at a glance." : tab === "Products" ? "Product catalogue" : tab === "Categories" ? "Shop categories" : tab === "Orders" ? "Order requests" : "Image library"}</h1><p>{tab === "Overview" ? "A little organisation. More room to create." : tab === "Products" ? "The pieces, prices and details your customers see." : tab === "Categories" ? "Keep your collection easy to explore." : tab === "Orders" ? "Review requests and confirm each order on WhatsApp." : "Upload once. Use across your catalogue."}</p></div>{["Overview", "Products"].includes(tab) && <button className="admin-button" onClick={newProduct}>+ Add product</button>}{tab === "Categories" && <button className="admin-button" onClick={() => setCategory({ id: "", name: "", description: "", image: "", position: categories.length })}>+ Add category</button>}</div>
        {error && <div role="alert" className="admin-alert">{error}<button aria-label="Dismiss error" onClick={() => setError("")}>×</button></div>}
        {tab === "Overview" && <>
          <div className="admin-stats"><Stat title="Published products" value={published.length} detail={`${products.filter((p) => p.status === "draft").length} drafts waiting`} /><Stat title="New order requests" value={pending.length} detail="Awaiting your confirmation" /><Stat title="Low stock pieces" value={lowStock.length} detail="5 or fewer available" /><Stat title="Recorded paid sales" value={formatINR(orders.filter((o) => o.paymentStatus === "paid" && o.status !== "cancelled").reduce((sum, o) => sum + o.total, 0))} detail="From recorded orders" /></div>
          <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Latest order requests</h2><p>Every request starts a conversation.</p></div><button className="admin-text-button" onClick={() => changeTab("Orders")}>View all orders →</button></div>{orders.length ? <OrderList orders={orders.slice(0, 5)} onSelect={setOrder} /> : <Empty title="Your next order starts here" text="New WhatsApp checkout requests will appear here once the database is connected. Orders are confirmed by you." />}</section>
          <section className="admin-panel"><div className="admin-panel-heading"><div><h2>Keep an eye on stock</h2><p>A few favourites are running low.</p></div><button className="admin-text-button" onClick={() => { changeTab("Products"); setFilter("low"); }}>Review stock →</button></div><ProductTable products={lowStock.slice(0, 4)} edit={setEditing} /></section>
        </>}
        {tab === "Products" && <section className="admin-panel"><div className="admin-list-tools"><div className="admin-tabs" role="group" aria-label="Product status">{[["all", "All products"], ["published", "Published"], ["draft", "Drafts"], ["archived", "Archived"], ["low", "Low stock"]].map(([id, name]) => <button key={id} aria-pressed={filter === id} onClick={() => setFilter(id)}>{name}</button>)}</div><label className="admin-search"><span className="sr-only">Search products</span><input type="search" placeholder="Search products…" value={query} onChange={(e) => setQuery(e.target.value)} /></label></div><ProductTable products={visible} edit={setEditing} /><div className="admin-list-footer">{visible.length} {visible.length === 1 ? "product" : "products"}</div></section>}
        {tab === "Categories" && <section className="admin-panel"><div className="admin-category-list">{categories.map((c) => <div className="admin-category-row" key={c.id}><img src={c.image || "/images/logo.jpg"} alt="" /><div><h2>{c.name}</h2><p>{c.description || "No description added"}</p><small>{products.filter((p) => p.category === c.name).length} products</small></div><button className="admin-button secondary" onClick={() => setCategory(c)}>Edit<span className="sr-only"> {c.name}</span></button></div>)}</div>{!categories.length && <Empty title="Make room for your first collection" text="Add a category before creating products." />}</section>}
        {tab === "Orders" && <section className="admin-panel"><div className="admin-list-tools"><label className="admin-search"><span className="sr-only">Search orders</span><input type="search" placeholder="Search by order, customer or phone…" value={query} onChange={(e) => setQuery(e.target.value)} /></label><label>Status <select value={filter} onChange={(e) => setFilter(e.target.value)}><option value="all">All requests</option>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select></label></div><OrderList orders={orders.filter((o) => (filter === "all" || o.status === filter) && `${o.id} ${o.customer.name} ${o.customer.phone}`.toLowerCase().includes(query.toLowerCase()))} onSelect={setOrder} /></section>}
        {tab === "Images" && <MediaLibrary configured={configured} onError={setError} />}
        <footer className="admin-footnote">Made for the everyday running of Ruaa Creation.</footer>
      </div>
    </div>
    {editing && <ProductEditor key={editing.slug || "new"} product={editing} categories={categories} configured={configured} busy={busy} onClose={() => { setEditing(null); setError(""); }} onSave={async (p) => { if (await save("products", p, "Product saved. Your shop is up to date.")) setEditing(null); }} onArchive={async () => { if (await save("products", { slug: editing.slug }, "Product archived.", "DELETE")) setEditing(null); }} />}
    {category && <CategoryEditor category={category} busy={busy} configured={configured} onClose={() => setCategory(null)} onSave={async (c) => { if (await save("categories", c, "Category saved.")) setCategory(null); }} onDelete={async () => { if (await save("categories", { id: category.id }, "Category deleted.", "DELETE")) setCategory(null); }} />}
    {order && <OrderEditor order={order} busy={busy} onClose={() => setOrder(null)} onSave={async (o) => { if (await save("orders", o, "Order updated.")) setOrder(null); }} />}
    {notice && <div className="admin-toast" role="status">{notice}</div>}
    {error && (editing || category || order) && <div className="admin-toast error" role="alert">{error}</div>}
  </div>;
}

function Stat({ title, value, detail }: { title: string; value: string | number; detail: string }) { return <div className="admin-stat"><span>{title}</span><strong>{value}</strong><small>{detail}</small></div>; }
function Empty({ title, text }: { title: string; text: string }) { return <div className="admin-empty"><span aria-hidden="true">◇</span><h3>{title}</h3><p>{text}</p></div>; }
function ProductTable({ products, edit }: { products: ManagedProduct[]; edit: (p: ManagedProduct) => void }) {
  if (!products.length) return <Empty title="No pieces here yet" text="Add a product or choose a different filter." />;
  return <div className="admin-table-wrap"><table className="admin-table product-table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th><span className="sr-only">Actions</span></th></tr></thead><tbody>{products.map((p) => <tr key={p.slug}><td><button className="admin-product-link" onClick={() => edit(p)}><img src={p.images[0]} alt="" style={{ background: p.tone }} /><span><strong>{p.name}</strong><small>{p.fabric}</small></span></button></td><td data-label="Category">{p.category}</td><td data-label="Price">{formatINR(p.price)}{p.mrp && <s>{formatINR(p.mrp)}</s>}</td><td data-label="Stock"><span className={(p.stock ?? 0) <= 5 ? "admin-stock-low" : ""}>{p.stock ?? 0} available</span></td><td data-label="Status"><span className={`admin-status ${p.status}`}>{p.status}</span></td><td><button className="admin-text-button" onClick={() => edit(p)}>Edit<span className="sr-only"> {p.name}</span></button></td></tr>)}</tbody></table></div>;
}
function OrderList({ orders, onSelect }: { orders: AdminOrder[]; onSelect: (o: AdminOrder) => void }) {
  if (!orders.length) return <Empty title="No matching order requests" text="Requests placed through checkout will appear here. Confirm availability with your customer on WhatsApp." />;
  return <div className="admin-table-wrap"><table className="admin-table order-table"><thead><tr><th>Order</th><th>Customer</th><th>Total</th><th>Status</th><th>Payment</th><th /></tr></thead><tbody>{orders.map((o) => <tr key={o.id}><td><button className="admin-text-button" onClick={() => onSelect(o)}>{o.id}</button><small>{new Date(o.createdAt).toLocaleDateString("en-IN")}</small></td><td>{o.customer.name}<small>{o.customer.city}</small></td><td>{formatINR(o.total)}</td><td><span className={`admin-status ${o.status}`}>{label(o.status)}</span></td><td>{o.paymentStatus}</td><td><button className="admin-text-button" onClick={() => onSelect(o)}>Review<span className="sr-only"> {o.id}</span></button></td></tr>)}</tbody></table></div>;
}

export function AdminDialog({ title, children, close, footer }: { title: string; children: React.ReactNode; close: () => void; footer: React.ReactNode }) {
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const dialog = document.querySelector<HTMLElement>(".admin-dialog");
    dialog?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "Tab" && dialog) {
        const controls = Array.from(dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex="0"]'));
        const first = controls[0]; const last = controls[controls.length - 1];
        if (e.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { e.preventDefault(); last?.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => { document.body.style.overflow = previousOverflow; document.removeEventListener("keydown", onKey); previous?.focus(); };
  }, [close]);
  return <div className="admin-dialog-backdrop"><section className="admin-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-dialog-title" tabIndex={-1}><header><div><span>RUAA CREATION</span><h2 id="admin-dialog-title">{title}</h2></div><button className="admin-close" aria-label="Close editor" onClick={close}>×</button></header><div className="admin-dialog-body">{children}</div><footer>{footer}</footer></section></div>;
}

function CategoryEditor({ category, configured, busy, onClose, onSave, onDelete }: { category: StoreCategory; configured: boolean; busy: boolean; onClose: () => void; onSave: (c: StoreCategory) => void; onDelete: () => void }) {
  const [value, setValue] = useState(category);
  return <AdminDialog title={category.id ? "Edit category" : "New category"} close={onClose} footer={<><button className="admin-button secondary" onClick={onClose}>Cancel</button><button className="admin-button" type="submit" form="category-form" disabled={busy || !configured}>{busy ? "Saving…" : "Save category"}</button></>}><form id="category-form" className="admin-form" onSubmit={(e) => { e.preventDefault(); onSave(value); }}><label>Category name<input required maxLength={80} value={value.name} onChange={(e) => setValue({ ...value, name: e.target.value, id: category.id || e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") })} /></label><label>Category URL<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" value={value.id} disabled={!!category.id} onChange={(e) => setValue({ ...value, id: e.target.value })} /></label><label>Description<textarea rows={3} maxLength={1000} value={value.description} onChange={(e) => setValue({ ...value, description: e.target.value })} /></label><label>Display order<input type="number" min={0} max={1000} value={value.position} onChange={(e) => setValue({ ...value, position: Number(e.target.value) })} /></label><label>Cover image path<input value={value.image} onChange={(e) => setValue({ ...value, image: e.target.value })} placeholder="Select an image from the library below" /></label><MediaLibrary configured={configured} compact onSelect={(image) => setValue({ ...value, image })} onError={() => {}} />{category.id && <button className="admin-text-button danger" type="button" disabled={busy || !configured} onClick={() => { if (window.confirm(`Delete ${category.name}? Only empty categories can be deleted.`)) onDelete(); }}>Delete category</button>}</form></AdminDialog>;
}
function OrderEditor({ order, busy, onClose, onSave }: { order: AdminOrder; busy: boolean; onClose: () => void; onSave: (o: unknown) => void }) {
  const [value, setValue] = useState({ id: order.id, status: order.status, paymentStatus: order.paymentStatus, tracking: order.tracking, notes: order.notes, version: order.version });
  return <AdminDialog title={order.id} close={onClose} footer={<><button className="admin-button secondary" onClick={onClose}>Close</button><button className="admin-button" disabled={busy} onClick={() => onSave(value)}>{busy ? "Saving…" : "Save order"}</button></>}><div className="admin-order-customer"><h3>{order.customer.name}</h3><p>{order.customer.address}<br />{order.customer.city}, {order.customer.state} {order.customer.pin}</p><p>{order.customer.phone}<br />{order.customer.email}</p><a className="admin-button secondary" href={`https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(`Hi ${order.customer.name}, about your Ruaa Creation order ${order.id}…`)}`} target="_blank" rel="noopener noreferrer">Contact on WhatsApp ↗</a>{order.customer.notes && <p>Customer notes: {order.customer.notes}</p>}</div><div className="admin-order-items">{order.lines.map((l, i) => <div key={i}><img src={l.image} alt="" /><span><strong>{l.name}</strong><small>{l.options} · Qty {l.qty}</small></span><b>{formatINR(l.qty * l.unitPrice)}</b></div>)}</div><dl className="admin-order-totals"><div><dt>Subtotal</dt><dd>{formatINR(order.subtotal)}</dd></div><div><dt>Discount</dt><dd>−{formatINR(order.discount)}</dd></div><div><dt>Shipping &amp; COD fee</dt><dd>{formatINR(order.shipping + order.codFee)}</dd></div><div><dt>Total</dt><dd>{formatINR(order.total)}</dd></div></dl><div className="admin-form"><label>Order status<select value={value.status} onChange={(e) => setValue({ ...value, status: e.target.value as AdminOrder["status"] })}>{ORDER_STATUSES.map((s) => <option key={s} value={s}>{label(s)}</option>)}</select><small>Stock is deducted when confirmed and restored if cancelled before delivery.</small></label><label>Payment status<select value={value.paymentStatus} onChange={(e) => setValue({ ...value, paymentStatus: e.target.value as "paid" | "unpaid" })}><option value="unpaid">Unpaid</option><option value="paid">Paid — received and verified</option></select><small>Record payment only after verifying it with your bank.</small></label><label>Courier / tracking reference<input maxLength={150} value={value.tracking} onChange={(e) => setValue({ ...value, tracking: e.target.value })} /></label><label>Internal notes<textarea rows={3} maxLength={3000} value={value.notes} onChange={(e) => setValue({ ...value, notes: e.target.value })} /></label></div></AdminDialog>;
}
