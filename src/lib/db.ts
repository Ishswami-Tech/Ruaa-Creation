import "server-only";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalDb = globalThis as unknown as { ruaaDb?: PrismaClient };
export const databaseConfigured = () => Boolean(process.env.DATABASE_URL);
export function db() {
  if (!process.env.DATABASE_URL) throw new Error("Database connection is not configured.");
  if (!globalDb.ruaaDb) globalDb.ruaaDb = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL, max: 3, connectionTimeoutMillis: 10000, idleTimeoutMillis: 20000 }) });
  return globalDb.ruaaDb;
}
