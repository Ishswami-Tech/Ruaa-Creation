import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { db, databaseConfigured } from "@/lib/db";
import { SESSION_COOKIE, rateLimit } from "@/lib/admin/auth";
import { sameOrigin, tokenHash, verifyPassword, hashPassword } from "@/lib/admin/security";
import { failure, HttpError, readJson } from "@/lib/admin/http";

export const runtime = "nodejs";
let dummyHash: string;
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request)) throw new HttpError(403, "Invalid origin.");
    if (!databaseConfigured()) throw new HttpError(503, "The database is not connected yet.");
    const input = await readJson(request, 4000);
    if (typeof input.email !== "string" || typeof input.password !== "string" || input.password.length > 256 || input.email.length > 120) throw new HttpError(400, "Enter your email and password.");
    const email = input.email.trim().toLowerCase();
    if (!await rateLimit(`login:${email}`, 8, 900) || !await rateLimit("login:global", 100, 900)) throw new HttpError(429, "Too many sign-in attempts. Try again in 15 minutes.");
    const admin = await db().ruaaAdmin.findUnique({ where: { email } });
    dummyHash ||= hashPassword(randomBytes(32).toString("hex"));
    const valid = verifyPassword(input.password, admin?.passwordHash || dummyHash);
    if (!admin || !admin.active || !valid) throw new HttpError(401, "Email or password is incorrect.");
    const token = randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000);
    await db().ruaaSession.deleteMany({ where: { expiresAt: { lt: new Date() } } });
    await db().ruaaSession.create({ data: { tokenHash: tokenHash(token), adminId: admin.id, expiresAt } });
    (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", expires: expiresAt });
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) { return failure(error); }
}
export async function DELETE(request: Request) {
  try {
    if (!sameOrigin(request)) throw new HttpError(403, "Invalid origin.");
    const jar = await cookies();
    const token = jar.get(SESSION_COOKIE)?.value;
    if (token && databaseConfigured()) await db().ruaaSession.deleteMany({ where: { tokenHash: tokenHash(token) } });
    jar.delete(SESSION_COOKIE);
    return NextResponse.json({ ok: true });
  } catch (error) { return failure(error); }
}
