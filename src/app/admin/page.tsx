import { redirect } from "next/navigation";
import { db, databaseConfigured } from "@/lib/db";
import { currentAdmin } from "@/lib/admin/auth";
import { getManagedProducts, getCategories, seedCategories } from "@/lib/catalogue";
import { products } from "@/lib/products";
import type { AdminData, AdminOrder } from "@/lib/admin/types";
import AdminApp from "@/components/admin/AdminApp";

export default async function AdminPage() {
  if (!databaseConfigured()) {
    const preview: AdminData = { products: products.map((p) => ({ ...p, status: "published", updatedAt: "", version: 1 })), categories: seedCategories, orders: [], email: "", configured: false };
    return <AdminApp initial={preview} />;
  }
  const admin = await currentAdmin();
  if (!admin) redirect("/admin/login/");
  const [catalogue, categories, records] = await Promise.all([getManagedProducts(), getCategories(), db().ruaaOrder.findMany({ orderBy: { createdAt: "desc" }, take: 500 })]);
  const orders = records.map((row) => ({ ...(row.data as unknown as AdminOrder), id: row.id, createdAt: row.createdAt.toISOString(), status: row.status, paymentStatus: row.paymentStatus, tracking: row.tracking, notes: row.notes, version: row.version })) as AdminOrder[];
  return <AdminApp initial={{ products: catalogue, categories, orders, email: admin.email, configured: true }} />;
}
