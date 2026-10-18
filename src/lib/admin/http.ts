import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { currentAdmin } from "./auth";
import { sameOrigin } from "./security";
import { databaseConfigured } from "../db";

export class HttpError extends Error { constructor(public status: number, message: string) { super(message); } }
export async function adminRequest(request: Request) {
  if (!databaseConfigured()) throw new HttpError(503, "Connect PostgreSQL and create an administrator before saving changes.");
  if (request.method !== "GET" && !sameOrigin(request)) throw new HttpError(403, "This request must come from your store.");
  const admin = await currentAdmin();
  if (!admin) throw new HttpError(401, "Your session has expired. Sign in again.");
  return admin;
}
export async function readJson(request: Request, limit = 100000) {
  if (!request.body) throw new HttpError(400, "Invalid request.");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = []; let bytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new HttpError(413, "Request is too large."); }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    const data = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!data || typeof data !== "object" || Array.isArray(data)) throw new Error("Invalid object");
    return data;
  } catch { throw new HttpError(400, "Invalid request."); }
}
export function failure(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: error.issues.map((i) => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
  if (error instanceof HttpError) return NextResponse.json({ error: error.message }, { status: error.status });
  const code = error && typeof error === "object" && "code" in error ? error.code : "";
  if (code === "P2002") return NextResponse.json({ error: "That name or URL already exists." }, { status: 409 });
  if (code === "P2003") return NextResponse.json({ error: "This category still contains products. Move them before deleting it." }, { status: 409 });
  console.error("Ruaa request failed", error instanceof Error ? error.name : "Unknown error");
  return NextResponse.json({ error: "The store could not complete this request. Check the database connection and try again." }, { status: 500 });
}
