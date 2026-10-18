import { NextResponse } from "next/server";
import { getCatalogue, getCategories } from "@/lib/catalogue";
import { databaseConfigured } from "@/lib/db";
export const dynamic = "force-dynamic";
export async function GET() {
  const [products, categories] = await Promise.all([getCatalogue(), getCategories()]);
  return NextResponse.json({ products, categories, connected: databaseConfigured() }, { headers: { "Cache-Control": "no-store" } });
}
