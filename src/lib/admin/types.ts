import type { Product } from "../products";

export type ManagedProduct = Product & { status: "draft" | "published" | "archived"; updatedAt: string; version: number };
export type StoreCategory = { id: string; name: string; description: string; image: string; position: number };
export const ORDER_STATUSES = ["requested", "confirmed", "in_progress", "shipped", "delivered", "cancelled"] as const;
export type OrderStatus = typeof ORDER_STATUSES[number];
export type AdminOrder = {
  id: string; createdAt: string; status: OrderStatus; paymentStatus: "unpaid" | "paid";
  customer: { name: string; phone: string; email: string; address: string; city: string; state: string; pin: string; notes: string };
  lines: { slug: string; name: string; options: string; qty: number; unitPrice: number; image: string }[];
  subtotal: number; discount: number; shipping: number; codFee: number; total: number; payment: string; tracking: string; notes: string; version: number;
};
export type AdminData = { products: ManagedProduct[]; categories: StoreCategory[]; orders: AdminOrder[]; email: string; configured: boolean };
