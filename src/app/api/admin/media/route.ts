import { NextResponse } from "next/server";
import sharp from "sharp";
import { db } from "@/lib/db";
import { adminRequest, failure, HttpError, readJson } from "@/lib/admin/http";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    await adminRequest(request);
    const media = await db().ruaaMedia.findMany({ select: { id: true, name: true, width: true, height: true, createdAt: true }, orderBy: { createdAt: "desc" }, take: 200 });
    return NextResponse.json(media, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}
export async function POST(request: Request) {
  try {
    const admin = await adminRequest(request);
    if (Number(request.headers.get("content-length")) > 4 * 1024 * 1024) throw new HttpError(413, "Choose an image smaller than 3 MB.");
    const form = await request.formData();
    const file = form.get("image");
    if (!(file instanceof File) || file.size > 3 * 1024 * 1024 || file.size === 0) throw new HttpError(400, "Choose a JPG, PNG or WebP image smaller than 3 MB.");
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new HttpError(400, "Only JPG, PNG and WebP photos are supported.");
    let image;
    try { image = await sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000, animated: false }).rotate().resize({ width: 1800, height: 2400, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer({ resolveWithObject: true }); }
    catch { throw new HttpError(400, "This image cannot be read. Try another JPG, PNG or WebP file."); }
    const name = file.name.replace(/[^a-zA-Z0-9 ._-]/g, "").slice(0, 100) || "Product image";
    const media = await db().ruaaMedia.create({ data: { name, bytes: new Uint8Array(image.data), width: image.info.width, height: image.info.height }, select: { id: true, name: true } });
    await db().ruaaAudit.create({ data: { adminId: admin.id, action: "media.upload", target: media.id } });
    return NextResponse.json({ ...media, url: `/api/media/${media.id}/` });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    const admin = await adminRequest(request);
    const { id } = await readJson(request);
    if (typeof id !== "string" || !/^[a-f0-9-]{36}$/.test(id)) throw new HttpError(400, "Invalid image.");
    const url = `/api/media/${id}/`;
    await db().$transaction(async (tx) => {
      // Check all statuses so a draft or archived product cannot lose its photos.
      const products = await tx.ruaaProduct.findMany({ select: { data: true } });
      const categories = await tx.ruaaCategory.count({ where: { image: url } });
      if (categories || products.some((p) => JSON.stringify(p.data).includes(url))) throw new HttpError(409, "This image is used by a product or category. Remove it there first.");
      const orders = await tx.ruaaOrder.findMany({ select: { data: true } });
      if (orders.some((o) => JSON.stringify(o.data).includes(url))) throw new HttpError(409, "This image belongs to an order and is kept for your records.");
      await tx.ruaaMedia.delete({ where: { id } });
      await tx.ruaaAudit.create({ data: { adminId: admin.id, action: "media.delete", target: id } });
    });
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
