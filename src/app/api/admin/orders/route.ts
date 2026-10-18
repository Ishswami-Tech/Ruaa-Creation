import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orderUpdateSchema } from "@/lib/admin/validation";
import { adminRequest, failure, HttpError, readJson } from "@/lib/admin/http";
import { stockEffect } from "@/lib/admin/order-state";
import type { AdminOrder, OrderStatus } from "@/lib/admin/types";

export async function POST(request: Request) {
  try {
    const admin = await adminRequest(request);
    const { id, version, ...changes } = orderUpdateSchema.parse(await readJson(request));
    await db().$transaction(async (tx) => {
      const previous = await tx.ruaaOrder.findUnique({ where: { id } });
      if (!previous || previous.version !== version) throw new HttpError(409, "This order changed in another session. Refresh before saving.");
      let effect: number;
      try { effect = stockEffect(previous.status as OrderStatus, changes.status); } catch (error) { throw new HttpError(400, (error as Error).message); }
      const result = await tx.ruaaOrder.updateMany({ where: { id, version }, data: { ...changes, version: { increment: 1 } } });
      if (!result.count) throw new HttpError(409, "This order changed in another session. Refresh before saving.");
      if (effect) {
        const requested = new Map<string, number>();
        for (const line of (previous.data as unknown as AdminOrder).lines) requested.set(line.slug, (requested.get(line.slug) || 0) + line.qty);
        for (const [slug, qty] of [...requested].sort(([a], [b]) => a.localeCompare(b))) {
          const changed = await tx.ruaaProduct.updateMany({ where: { slug, ...(effect < 0 ? { stock: { gte: qty }, status: "published" } : {}) }, data: { stock: { increment: effect * qty }, version: { increment: 1 } } });
          if (!changed.count) throw new HttpError(409, `Not enough stock to confirm ${slug}. Update inventory or contact the customer.`);
        }
      }
      await tx.ruaaAudit.create({ data: { adminId: admin.id, action: "order.update", target: id } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
