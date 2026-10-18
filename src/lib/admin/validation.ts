import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
export const slugSchema = z.string().min(1).max(100).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
export const imageSchema = z.string().max(250).regex(/^\/(?:images\/[a-zA-Z0-9_./-]+\.(?:jpg|jpeg|png|webp)|api\/media\/[a-f0-9-]{36}\/)$/).refine((s) => !s.includes(".."), "Invalid image path");
export const productSchema = z.object({
  slug: slugSchema, name: text(150).min(2), category: text(80).min(1), price: z.number().int().min(1).max(10000000), mrp: z.number().int().min(1).max(10000000).optional(),
  fabric: text(100).min(1), tag: text(40).optional(), tone: z.string().regex(/^#[a-f0-9]{6}$/i), images: z.array(imageSchema).min(1).max(12),
  sizes: z.array(text(30).min(1)).min(1).max(15).optional(), blouseOptions: z.boolean().optional(), colours: z.array(z.object({ name: text(40).min(1), hex: z.string().regex(/^#[a-f0-9]{6}$/i) })).min(1).max(20).optional(),
  occasions: z.array(z.enum(["Festive", "Wedding", "Party", "Everyday", "Office"])).min(1).max(5), isNew: z.boolean().optional(), stock: z.number().int().min(0).max(1000000),
  description: text(5000).min(10), details: z.array(text(300).min(1)).min(1).max(30), care: z.array(text(300).min(1)).min(1).max(20),
  status: z.enum(["draft", "published", "archived"]), version: z.number().int().min(0),
}).refine((p) => !p.mrp || p.mrp > p.price, { message: "MRP must be higher than selling price", path: ["mrp"] });
export const categorySchema = z.object({ id: slugSchema, name: text(80).min(2), description: text(1000), image: imageSchema.or(z.literal("")), position: z.number().int().min(0).max(1000) });
export const orderUpdateSchema = z.object({ id: text(60).min(1), status: z.enum(["requested", "confirmed", "in_progress", "shipped", "delivered", "cancelled"]), paymentStatus: z.enum(["unpaid", "paid"]), tracking: text(150), notes: text(3000), version: z.number().int().positive() });
export const checkoutSchema = z.object({
  requestKey: z.string().uuid(), lines: z.array(z.object({ slug: slugSchema, options: text(250), qty: z.number().int().min(1).max(20) })).min(1).max(50),
  customer: z.object({ name: text(80).min(2), phone: z.string().regex(/^[6-9]\d{9}$/), email: z.email().max(120).or(z.literal("")), address: text(500).min(5), city: text(80).min(2), state: text(80).min(2), pin: z.string().regex(/^[1-9]\d{5}$/), notes: text(2000) }),
  payment: z.enum(["upi", "card", "cod"]), coupon: text(30).nullable(), expectedTotal: z.number().int().positive(),
});
