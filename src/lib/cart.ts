import { getProduct } from "./products";
import type { CartLine } from "@/components/CartProvider";

export const quantity = (value: number) => Number.isFinite(value) ? Math.min(20, Math.max(1, Math.trunc(value))) : 1;

// Rebuild persisted product details and prices from the current catalogue.
export function restoreCart(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartLine>();
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== "object" || typeof raw.slug !== "string" || typeof raw.options !== "string" || raw.options.length > 250 || !Number.isInteger(raw.qty) || raw.qty < 1) continue;
    const p = getProduct(raw.slug);
    if (!p) continue;
    let extra = 0;
    const parts: string[] = [];
    const saved = raw.options.split(" · ");
    if (p.colours) {
      const colour = p.colours.find((c) => saved.includes(`Colour: ${c.name}`));
      if (!colour) continue;
      parts.push(`Colour: ${colour.name}`);
    }
    if (p.blouseOptions) {
      if (saved.includes("Blouse: unstitched piece")) parts.push("Blouse: unstitched piece");
      else if (saved.includes("Blouse: custom-stitched")) { parts.push("Blouse: custom-stitched"); extra = 1450; }
      else {
        const size = ["XS", "S", "M", "L", "XL", "XXL"].find((s) => saved.includes(`Blouse: ready, size ${s}`));
        if (!size) continue;
        parts.push(`Blouse: ready, size ${size}`);
        extra = 950;
      }
    }
    if (p.sizes) {
      const size = p.sizes.find((s) => saved.includes(`Size ${s}`));
      if (!size) continue;
      parts.push(`Size ${size}`);
    }
    const options = parts.join(" · ") || "Free size";
    const key = `${p.slug}|${options}`;
    lines.set(key, { key, slug: p.slug, name: p.name, image: p.images[0], tone: p.tone, options, unitPrice: p.price + extra, qty: quantity((lines.get(key)?.qty ?? 0) + raw.qty) });
  }
  return [...lines.values()];
}
