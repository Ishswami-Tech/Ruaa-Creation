"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { products as seed, type Product } from "@/lib/products";
import type { StoreCategory } from "@/lib/admin/types";

const Catalogue = createContext<Product[]>(seed);
const Connected = createContext(false);
const Categories = createContext<StoreCategory[]>([]);
export function CatalogueProvider({ products, categories, connected = false, children }: { products: Product[]; categories: StoreCategory[]; connected?: boolean; children: React.ReactNode }) {
  const [current, setCurrent] = useState({ products, categories });
  const pathname = usePathname();
  useEffect(() => { setCurrent({ products, categories }); }, [products, categories]);
  useEffect(() => {
    if (!connected || pathname.startsWith("/admin")) return;
    const abort = new AbortController();
    const refresh = async () => {
      try {
        const response = await fetch("/api/catalogue/", { cache: "no-store", signal: abort.signal });
        if (response.ok) setCurrent(await response.json());
      } catch { /* Keep the last valid catalogue if the connection is interrupted. */ }
    };
    void refresh();
    window.addEventListener("focus", refresh);
    return () => { abort.abort(); window.removeEventListener("focus", refresh); };
  }, [connected, pathname]);
  return <Connected.Provider value={connected}><Categories.Provider value={current.categories}><Catalogue.Provider value={current.products}>{children}</Catalogue.Provider></Categories.Provider></Connected.Provider>;
}
export const useCatalogue = () => useContext(Catalogue);
export const useStoreConnected = () => useContext(Connected);
export const useCategories = () => useContext(Categories);
