import { products, type Product } from "./products";
import type { CartLine } from "@/components/CartProvider";

export const quantity = (value: number) => Number.isFinite(value) ? Math.min(20, Math.max(1, Math.trunc(value))) : 1;

// Preserve order snapshots when products are later repriced or archived.
export function restoreOrderLines(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];
  return value.slice(0, 100).filter((line) => line && typeof line === "object" &&
    typeof line.slug === "string" && typeof line.name === "string" && typeof line.options === "string" &&
    typeof line.image === "string" && /^\/(?:images\/|api\/media\/)/.test(line.image) && !line.image.includes("..") &&
    Number.isInteger(line.qty) && line.qty > 0 && line.qty <= 20 && Number.isInteger(line.unitPrice) && line.unitPrice > 0 && line.unitPrice <= 10010000)
    .map((line) => ({ key: `${line.slug}|${line.options}`.slice(0, 400), slug: line.slug.slice(0, 100), name: line.name.slice(0, 150), options: line.options.slice(0, 250), image: line.image.slice(0, 250), tone: typeof line.tone === "string" && /^#[a-f0-9]{6}$/i.test(line.tone) ? line.tone : "#F3DDD6", unitPrice: line.unitPrice, qty: line.qty }));
}

// Rebuild persisted product details and prices from the current catalogue.
export function restoreCart(value: unknown, catalogue: Product[] = products): CartLine[] {
  if (!Array.isArray(value)) return [];
  const lines = new Map<string, CartLine>();
  for (const raw of value.slice(0, 100)) {
    if (!raw || typeof raw !== "object" || typeof raw.slug !== "string" || typeof raw.options !== "string" || raw.options.length > 250 || !Number.isInteger(raw.qty) || raw.qty < 1) continue;
    const p = catalogue.find((p) => p.slug === raw.slug);
    if (!p || p.stock === 0) continue;
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
    lines.set(key, { key, slug: p.slug, name: p.name, image: p.images[0], tone: p.tone, options, unitPrice: p.price + extra, qty: Math.min(p.stock ?? 20, quantity((lines.get(key)?.qty ?? 0) + raw.qty)) });
  }
  return [...lines.values()];
}
