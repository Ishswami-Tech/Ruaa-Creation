"use client";

import { useSearchParams } from "next/navigation";
import { products, type Category } from "@/lib/products";
import Catalog from "@/components/Catalog";

const VALID: Category[] = ["Sarees", "Blouses", "Tassels", "Western", "Traditional", "Hand Painted"];

export default function ShopClient() {
  const params = useSearchParams();
  const c = params.get("c") as Category | null;
  return (
    <Catalog
      base={products}
      eyebrow="Ready-to-wear · Ships in 2–3 days"
      title="Festive looks, ready the moment they arrive."
      blurb="Pre-stitched sarees, matching blouses and sets — in your size, finished by hand."
      heroImage="/images/saree.png"
      initialCategory={c && VALID.includes(c) ? c : "All"}
    />
  );
}
