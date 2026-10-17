"use client";

import Link from "next/link";
import type { Product } from "@/lib/products";
import { useCart } from "./CartProvider";
import { Price, WishButton } from "./bits";

export default function ProductCard({ p }: { p: Product }) {
  const { add } = useCart();
  const href = `/product/${p.slug}/`;
  const needsChoice = !!p.sizes || !!p.blouseOptions;
  const low = p.stock !== undefined && p.stock <= 5;

  return (
    <article className="pcard">
      <Link href={href} className="pcard-img" style={{ background: p.tone }}>
        <img src={p.images[0]} alt={p.name} loading="lazy" />
        {p.images[1] && <img className="alt" src={p.images[1]} alt="" loading="lazy" aria-hidden="true" />}
        {p.tag && <span className="pill">{p.tag}</span>}
        {p.mrp && <span className="pill sale">Sale</span>}
      </Link>
      <WishButton slug={p.slug} name={p.name} />
      <div className="pcard-meta">{p.category} · {p.fabric}</div>
      <Link href={href} className="pcard-name">{p.name}</Link>
      {low && <span className="low">Only {p.stock} left</span>}
      <div className="pcard-row">
        <Price p={p} />
        {needsChoice ? (
          <Link href={href} className="btn-sm">Choose size</Link>
        ) : (
          <button className="btn-sm" onClick={() => add({ slug: p.slug, name: p.name, image: p.images[0], tone: p.tone, options: "Free size", unitPrice: p.price })}>
            Add to bag
          </button>
        )}
      </div>
    </article>
  );
}
