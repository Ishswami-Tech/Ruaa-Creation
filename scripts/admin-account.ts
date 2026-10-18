import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/admin/security";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";

function passwordPrompt(label: string): Promise<string> {
  if (!stdin.isTTY) throw new Error("Run account setup in an interactive terminal. Password input is hidden.");
  stdout.write(label); stdin.setRawMode(true); stdin.resume(); stdin.setEncoding("utf8");
  return new Promise((resolve, reject) => {
    let value = "";
    const finish = () => { stdin.off("data", onData); stdin.setRawMode(false); stdin.pause(); stdout.write("\n"); };
    const onData = (chunk: string) => {
      for (const c of chunk) {
        if (c === "\u0003") { finish(); reject(new Error("Cancelled.")); return; }
        if (c === "\r" || c === "\n") { finish(); resolve(value); return; }
        if (c === "\u007f" || c === "\b") value = value.slice(0, -1);
        else if (c >= " ") value += c;
      }
    };
    stdin.on("data", onData);
  });
}
async function main() {
  if (!process.env.DATABASE_URL) throw new Error("Set DATABASE_URL in .env before creating an administrator.");
  const reader = createInterface({ input: stdin, output: stdout });
  const email = (await reader.question("Administrator email: ")).trim().toLowerCase(); reader.close();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Enter a valid email address.");
  const password = await passwordPrompt("New password (at least 14 characters, hidden): ");
  if (password.length < 14 || password.length > 256) throw new Error("Use 14–256 characters.");
  const confirmation = await passwordPrompt("Repeat password (hidden): ");
  if (password !== confirmation) throw new Error("Passwords do not match.");
  const client = new PrismaClient({ adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }) });
  try {
    await client.$transaction(async (tx) => {
      const account = await tx.ruaaAdmin.upsert({ where: { email }, create: { email, passwordHash: hashPassword(password) }, update: { passwordHash: hashPassword(password), active: true } });
      await tx.ruaaSession.deleteMany({ where: { adminId: account.id } });
    });
    console.log("Administrator saved. Previous sessions have been signed out.");
  } finally { await client.$disconnect(); }
}
main().catch((error) => { console.error(error instanceof Error && !error.message.includes("postgres") ? error.message : "Account setup failed. Check the database connection and migration."); process.exitCode = 1; });
