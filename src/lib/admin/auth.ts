import "server-only";
import { cookies } from "next/headers";
import { db, databaseConfigured } from "../db";
import { tokenHash } from "./security";

export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-ruaa-admin" : "ruaa-admin";
export async function currentAdmin() {
  if (!databaseConfigured()) return null;
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token || !/^[a-f0-9]{64}$/.test(token)) return null;
  const session = await db().ruaaSession.findUnique({ where: { tokenHash: tokenHash(token) }, include: { admin: true } });
  return session && session.expiresAt > new Date() && session.admin.active ? session.admin : null;
}

// A database counter works across Vercel instances. Never trust spoofable IP headers for login limits.
export async function rateLimit(key: string, max: number, seconds: number) {
  const now = new Date();
  const window = Math.floor(now.getTime() / (seconds * 1000));
  const entry = await db().ruaaRateLimit.upsert({ where: { key: `${tokenHash(key)}:${window}` }, create: { key: `${tokenHash(key)}:${window}`, count: 1, expiresAt: new Date(now.getTime() + seconds * 1000) }, update: { count: { increment: 1 } } });
  await db().ruaaRateLimit.deleteMany({ where: { expiresAt: { lt: now } } });
  return entry.count <= max;
}
