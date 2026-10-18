import { db, databaseConfigured } from "@/lib/db";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!databaseConfigured() || !/^[a-f0-9-]{36}$/.test(id)) return new Response("Not found", { status: 404 });
  const image = await db().ruaaMedia.findUnique({ where: { id } });
  if (!image) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(image.bytes), { headers: { "Content-Type": "image/webp", "Content-Length": String(image.bytes.length), "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
