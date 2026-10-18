import { randomBytes, scryptSync, timingSafeEqual, createHash } from "node:crypto";

export function hashPassword(password: string) {
  const salt = randomBytes(32).toString("hex");
  return `scrypt:${salt}:${scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 }).toString("hex")}`;
}
export function verifyPassword(password: string, stored: string) {
  const [algorithm, salt, key] = stored.split(":");
  if (algorithm !== "scrypt" || !/^[a-f0-9]{64}$/.test(salt || "") || !/^[a-f0-9]{128}$/.test(key || "")) return false;
  const actual = scryptSync(password, salt, 64, { N: 32768, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return timingSafeEqual(actual, Buffer.from(key, "hex"));
}
export const tokenHash = (token: string) => createHash("sha256").update(token).digest("hex");
export function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  if (!origin || origin === "null") return false;
  try {
    const source = new URL(origin);
    const target = new URL(request.url);
    // Next's internal request URL can use localhost behind its server. The Host
    // header is the browser's target; never accept X-Forwarded-Host as authority.
    return source.host === (request.headers.get("host") || target.host) && source.protocol === target.protocol && origin === source.origin;
  } catch { return false; }
}
