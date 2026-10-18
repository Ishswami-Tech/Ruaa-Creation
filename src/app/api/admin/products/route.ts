import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getManagedProducts } from "@/lib/catalogue";
import { productSchema, slugSchema } from "@/lib/admin/validation";
import { adminRequest, failure, HttpError, readJson } from "@/lib/admin/http";

export async function GET(request: Request) {
  try { await adminRequest(request); return NextResponse.json(await getManagedProducts(), { headers: { "Cache-Control": "no-store" } }); } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    const admin = await adminRequest(request);
    const { version, status, stock, ...product } = productSchema.parse(await readJson(request));
    const category = await db().ruaaCategory.findUnique({ where: { name: product.category } });
    if (!category) throw new HttpError(400, "Choose an existing category.");
    await db().$transaction(async (tx) => {
      if (version === 0) await tx.ruaaProduct.create({ data: { slug: product.slug, categoryId: category.id, status, stock, data: product } });
      else {
        const result = await tx.ruaaProduct.updateMany({ where: { slug: product.slug, version }, data: { data: product, categoryId: category.id, status, stock, version: { increment: 1 } } });
        if (!result.count) throw new HttpError(409, "This product changed in another session. Refresh before saving.");
      }
      await tx.ruaaAudit.create({ data: { adminId: admin.id, action: version === 0 ? "product.create" : "product.update", target: product.slug } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    const admin = await adminRequest(request);
    const slug = slugSchema.parse((await readJson(request)).slug);
    // Archive rather than destroy a product referenced by an order.
    await db().$transaction([db().ruaaProduct.update({ where: { slug }, data: { status: "archived", version: { increment: 1 } } }), db().ruaaAudit.create({ data: { adminId: admin.id, action: "product.archive", target: slug } })]);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
