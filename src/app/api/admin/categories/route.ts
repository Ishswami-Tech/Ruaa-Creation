import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { categorySchema, slugSchema } from "@/lib/admin/validation";
import { adminRequest, failure, readJson } from "@/lib/admin/http";

export async function POST(request: Request) {
  try {
    const admin = await adminRequest(request);
    const category = categorySchema.parse(await readJson(request));
    await db().$transaction([db().ruaaCategory.upsert({ where: { id: category.id }, create: category, update: category }), db().ruaaAudit.create({ data: { adminId: admin.id, action: "category.save", target: category.id } })]);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    const admin = await adminRequest(request);
    const id = slugSchema.parse((await readJson(request)).id);
    await db().$transaction([db().ruaaCategory.delete({ where: { id } }), db().ruaaAudit.create({ data: { adminId: admin.id, action: "category.delete", target: id } })]);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
