"use client";

import { useState } from "react";
import { products, type Category } from "@/lib/products";
import ProductCard from "./ProductCard";

const TABS: (Category | "All")[] = ["All", "Sarees", "Blouses", "Western", "Traditional"];

export default function NewArrivals() {
  const [tab, setTab] = useState<Category | "All">("All");
  const fresh = [...products].sort((a, b) => Number(!!b.isNew) - Number(!!a.isNew));
  const list = (tab === "All" ? fresh : fresh.filter((p) => p.category === tab)).slice(0, 8);

  return (
    <div className="shop-ui" style={{ background: "transparent" }}>
      <div className="toolbar" style={{ marginBottom: 28 }}>
        <div className="stack" style={{ gap: 8 }}>
          <span className="eyebrow">New arrivals</span>
          <h2 className="h2">Ready to wear this season</h2>
        </div>
        <div className="chips" role="group" aria-label="Filter new arrivals">
          {TABS.map((t) => (
            <button key={t} className="chip" aria-pressed={tab === t} onClick={() => setTab(t)}>{t}</button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {list.map((p) => <ProductCard key={p.slug} p={p} />)}
      </div>
    </div>
  );
}
