"use client";

import { useSearchParams } from "next/navigation";
import { type Category } from "@/lib/products";
import Catalog from "@/components/Catalog";
import { useCatalogue } from "@/components/CatalogueProvider";



export default function ShopClient() {
  const products = useCatalogue();
  const params = useSearchParams();
  const c = params.get("c") as Category | null;
  return (
    <Catalog
      base={products}
      eyebrow="Ready-to-wear · Ships in 2–3 days"
      title="The collection"
      blurb="Sarees, blouses and everyday favourites. Find your next favourite piece."
      heroImage="/images/saree.png"
      initialCategory={c && products.some((p) => p.category === c) ? c : "All"}
    />
  );
}
