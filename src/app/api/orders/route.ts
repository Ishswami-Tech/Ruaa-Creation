import { NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { db, databaseConfigured } from "@/lib/db";
import { checkoutSchema } from "@/lib/admin/validation";
import { rateLimit } from "@/lib/admin/auth";
import { sameOrigin } from "@/lib/admin/security";
import { failure, HttpError, readJson } from "@/lib/admin/http";
import { restoreCart } from "@/lib/cart";
import { totals } from "@/lib/pricing";
import { site, waLink, formatINR } from "@/lib/site";
import type { Product } from "@/lib/products";
import type { AdminOrder } from "@/lib/admin/types";

export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new HttpError(403, "Invalid origin.");
    if (!databaseConfigured()) throw new HttpError(503, "Online order recording is not available yet. Please contact us on WhatsApp.");
    const input = checkoutSchema.parse(await readJson(request, 30000));
    // The request key makes retries safe. A customer can retrieve only their own unguessable request.
    const existing = await db().ruaaOrder.findUnique({ where: { requestKey: input.requestKey } });
    if (existing) return NextResponse.json(existing.data, { headers: { "Cache-Control": "no-store" } });
    if (!await rateLimit(`order:${input.customer.phone}`, 5, 3600) || !await rateLimit("orders:global", 150, 3600)) throw new HttpError(429, "Too many order requests. Please contact us on WhatsApp.");
    const rows = await db().ruaaProduct.findMany({ where: { slug: { in: input.lines.map((l) => l.slug) }, status: "published" }, include: { category: true } });
    const catalogue = rows.map((r) => ({ ...(r.data as unknown as Product), slug: r.slug, category: r.category.name, stock: r.stock }));
    const lines = restoreCart(input.lines, catalogue);
    const requestedQuantity = input.lines.reduce((n, l) => n + l.qty, 0);
    if (!lines.length || lines.reduce((n, l) => n + l.qty, 0) !== requestedQuantity) throw new HttpError(409, "Some pieces or sizes are unavailable. Refresh your bag and try again.");
    for (const product of catalogue) {
      if (lines.filter((l) => l.slug === product.slug).reduce((n, l) => n + l.qty, 0) > (product.stock ?? 0)) throw new HttpError(409, `${product.name} does not have enough stock.`);
    }
    const subtotal = lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
    const calculation = totals(subtotal, input.coupon, input.payment === "cod");
    if (calculation.total !== input.expectedTotal) throw new HttpError(409, "Prices have changed. Refresh your bag to review the current total.");
    if (input.payment === "cod" && calculation.total > site.codMax) throw new HttpError(400, "This order exceeds the cash-on-delivery limit.");
    const id = `RC-${randomUUID().replaceAll("-", "").slice(0, 12).toUpperCase()}`;
    const date = new Date().toISOString();
    const message = [`Order request ${id} — ${site.name}`, ...lines.map((l) => `${l.name} — ${l.options} × ${l.qty}: ${formatINR(l.unitPrice * l.qty)}`), `Total: ${formatINR(calculation.total)}`, `Payment: ${input.payment.toUpperCase()}`, `Name: ${input.customer.name}`, `Phone: ${input.customer.phone}`, `Address: ${input.customer.address}, ${input.customer.city}, ${input.customer.state} ${input.customer.pin}`, input.customer.notes, "Please confirm availability and payment instructions."].filter(Boolean).join("\n");
    const data = { id, date, lines, subtotal, ...calculation, customer: input.customer, payment: input.payment, name: input.customer.name, city: input.customer.city, link: waLink(message), createdAt: date };
    try { await db().ruaaOrder.create({ data: { id, requestKey: input.requestKey, data } }); }
    catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === "P2002") {
        const retry = await db().ruaaOrder.findUnique({ where: { requestKey: input.requestKey } });
        if (retry) return NextResponse.json(retry.data, { headers: { "Cache-Control": "no-store" } });
      }
      throw error;
    }
    return NextResponse.json(data, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}
