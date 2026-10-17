/**
 * ─────────────────────────────────────────────────────────────
 *  PRODUCT CATALOGUE — add, edit or remove items here.
 *  Put real photos in /public/images/products/ and list them in `images`.
 *  `mrp` (optional) shows a struck-through price and a "% off" badge.
 *  `stock` (optional) shows "Only N left" when 5 or fewer.
 * ─────────────────────────────────────────────────────────────
 */
export type Category = "Sarees" | "Blouses" | "Tassels" | "Western" | "Traditional" | "Hand Painted";
export type Occasion = "Festive" | "Wedding" | "Party" | "Everyday" | "Office";

export type Product = {
  slug: string;
  name: string;
  category: Category;
  price: number;
  mrp?: number;
  fabric: string;
  tag?: string;
  tone: string;
  images: string[];
  sizes?: string[];
  blouseOptions?: boolean;
  colours?: { name: string; hex: string }[];
  occasions: Occasion[];
  isNew?: boolean;
  stock?: number;
  description: string;
  details: string[];
  care: string[];
};

const IMG = {
  saree: "/images/saree.png",
  blouse: "/images/blouse.png",
  tassels: "/images/tassels.png",
  western: "/images/western.png",
  traditional: "/images/traditional.png",
  painting: "/images/painting.png",
  custom: "/images/custom.png",
  silkA: "/images/silk-a.jpg",
  silkB: "/images/silk-b.jpg",
  silkC: "/images/silk-c.jpg",
};

const SIZES = ["XS", "S", "M", "L", "XL", "XXL"];
const DRY = ["Dry clean only", "Store folded in muslin, away from direct sunlight"];
const HAND = ["Gentle hand wash in cold water", "Dry in shade; iron on low heat"];
const PINK = [{ name: "Gulabi pink", hex: "#E7A9A0" }, { name: "Ivory gold", hex: "#EFE0C6" }, { name: "Dusty mauve", hex: "#B88A92" }];

export const products: Product[] = [
  // ── Sarees
  { slug: "gulabi-organza-saree", name: "Gulabi Organza Saree", category: "Sarees", price: 6450, fabric: "Organza", tag: "New", isNew: true, tone: "#F3DDD6",
    images: [IMG.saree, IMG.silkA, IMG.silkB, IMG.tassels], blouseOptions: true, colours: PINK, occasions: ["Festive", "Party"], stock: 8,
    description: "A soft rose organza drape with a hand-finished gold tissue border and silk tassels on the pallu. Light enough for a day function, rich enough for the evening.",
    details: ["Organza saree, 5.5 m with 0.8 m blouse piece", "Gold tissue border, hand-finished", "Silk latkan tassels on the pallu", "Fall and pico done — ready to drape"], care: DRY },
  { slug: "rose-gold-tissue-saree", name: "Rose Gold Tissue Saree", category: "Sarees", price: 8900, mrp: 9900, fabric: "Tissue", tag: "Festive", tone: "#F1E3D2",
    images: [IMG.saree, IMG.silkB], blouseOptions: true, occasions: ["Festive", "Wedding"], stock: 4,
    description: "Shimmering rose-gold tissue with a zari border — made for festive evenings.",
    details: ["Tissue saree, 5.5 m with blouse piece", "Woven zari border", "Fall and pico done"], care: DRY },
  { slug: "laal-paar-tissue-saree", name: "Laal Paar Tissue Saree", category: "Sarees", price: 7900, fabric: "Tissue", tag: "Pujo special", tone: "#F7E9E0",
    images: [IMG.saree, IMG.silkC], blouseOptions: true, occasions: ["Festive"], stock: 6,
    description: "Ivory tissue with a bold red border and gold zari — the Ashtami anjali essential.",
    details: ["Tissue saree, 5.5 m with blouse piece", "Red border with gold zari", "Fall and pico done"], care: DRY },
  { slug: "marigold-mul-cotton-saree", name: "Marigold Mul Cotton Saree", category: "Sarees", price: 3950, fabric: "Mul cotton", isNew: true, tone: "#F6E7C9",
    images: [IMG.saree], blouseOptions: true, occasions: ["Everyday", "Festive"],
    description: "Feather-light mul cotton in a warm marigold — perfect for haldi mornings and long summer days.",
    details: ["Mul cotton, 5.5 m with blouse piece", "Woven border", "Fall and pico done"], care: HAND },
  { slug: "red-border-cotton-silk-saree", name: "Red-border Cotton Silk Saree", category: "Sarees", price: 4200, fabric: "Cotton silk", tone: "#F8EDE6",
    images: [IMG.saree], blouseOptions: true, occasions: ["Festive", "Office"],
    description: "Classic white with a red border — easy to drape and easy to care for.",
    details: ["Cotton silk, 5.5 m with blouse piece", "Contrast red border", "Fall and pico done"], care: HAND },

  // ── Blouses
  { slug: "zari-sweetheart-blouse", name: "Zari Sweetheart Blouse", category: "Blouses", price: 2850, fabric: "Raw silk", tag: "Bestseller", tone: "#F2E4D6",
    images: [IMG.blouse, IMG.silkB], sizes: SIZES, occasions: ["Festive", "Wedding", "Party"], stock: 12,
    description: "A sweetheart neckline traced in fine gold zari, padded and lined, with back hooks.",
    details: ["Raw silk, fully lined", "Padded cups", "1-inch margin on side seams for alteration"], care: DRY },
  { slug: "mirror-work-princess-blouse", name: "Mirror-work Princess Blouse", category: "Blouses", price: 3200, fabric: "Cotton silk", isNew: true, tag: "New", tone: "#F4DFD8",
    images: [IMG.blouse], sizes: SIZES, occasions: ["Festive", "Party"], stock: 3,
    description: "Princess-cut blouse with hand-stitched mirror work on the sleeves.",
    details: ["Cotton silk, lined", "Hand mirror work", "Front hooks"], care: DRY },
  { slug: "high-neck-brocade-blouse", name: "High-neck Brocade Blouse", category: "Blouses", price: 3450, fabric: "Brocade", tone: "#EFE2D3",
    images: [IMG.blouse], sizes: SIZES, occasions: ["Wedding", "Festive"],
    description: "A regal high neck in gold brocade with a keyhole back and tassel tie.",
    details: ["Brocade, lined", "Keyhole back with tassel tie", "Elbow sleeves"], care: DRY },
  { slug: "everyday-cotton-blouse", name: "Everyday Cotton Blouse", category: "Blouses", price: 1290, mrp: 1590, fabric: "Cotton", tone: "#F3E8E1",
    images: [IMG.blouse], sizes: SIZES, occasions: ["Everyday", "Office"],
    description: "A comfortable, breathable cotton blouse that goes with every saree.",
    details: ["Pure cotton, lined", "Round neck, short sleeves", "Front hooks"], care: HAND },

  // ── Tassels
  { slug: "silk-latkan-tassel-pair", name: "Silk Latkan Tassel Pair", category: "Tassels", price: 450, fabric: "Silk thread", tag: "Handmade", tone: "#F5E2DC",
    images: [IMG.tassels], occasions: ["Festive", "Wedding", "Everyday"],
    description: "Hand-tied silk tassels with a brass bead — finish any saree or blouse.",
    details: ["Pair of 2", "Silk thread, brass bead", "Approx. 3.5 inches"], care: ["Keep dry", "Comb gently to untangle"] },
  { slug: "pearl-drop-tassels-set-of-4", name: "Pearl-drop Tassels, Set of 4", category: "Tassels", price: 690, fabric: "Silk & pearl", tag: "Handmade", tone: "#F2E6DC",
    images: [IMG.tassels], occasions: ["Wedding", "Party"],
    description: "Silk tassels finished with faux-pearl drops.",
    details: ["Set of 4", "Silk thread, faux pearl"], care: ["Keep dry"] },
  { slug: "ghungroo-tassel-pair", name: "Ghungroo Tassel Pair", category: "Tassels", price: 520, fabric: "Silk thread", isNew: true, tone: "#F6E3D7",
    images: [IMG.tassels], occasions: ["Festive"],
    description: "Tassels with tiny ghungroo bells that chime softly as you move.",
    details: ["Pair of 2", "Silk thread, brass ghungroo"], care: ["Keep dry"] },

  // ── Western
  { slug: "blush-tiered-midi-dress", name: "Blush Tiered Midi Dress", category: "Western", price: 3450, fabric: "Georgette", tag: "Ready to ship", tone: "#F6E4DE",
    images: [IMG.western], sizes: SIZES, occasions: ["Party", "Everyday"], stock: 9,
    description: "An easy, flowy tiered midi in blush — for brunches, receptions and trips.",
    details: ["Georgette, lined", "46-inch length", "Concealed back zip"], care: HAND },
  { slug: "peony-fit-flare-dress", name: "Peony Fit & Flare Dress", category: "Western", price: 2990, fabric: "Crepe", isNew: true, tag: "New", tone: "#EFE3D7",
    images: [IMG.western], sizes: SIZES, occasions: ["Party", "Office"],
    description: "A clean fit-and-flare silhouette in soft peony pink.",
    details: ["Crepe, lined", "Knee length", "Side pockets"], care: HAND },
  { slug: "pastel-co-ord-set", name: "Pastel Co-ord Set", category: "Western", price: 3790, mrp: 4290, fabric: "Linen blend", tone: "#F1E8E2",
    images: [IMG.western], sizes: SIZES, occasions: ["Everyday", "Office"], stock: 5,
    description: "Relaxed shirt and wide pants in a breathable pastel linen blend.",
    details: ["Shirt and pants", "Linen blend", "Elasticated back waist"], care: HAND },

  // ── Traditional
  { slug: "ivory-chikankari-anarkali-set", name: "Ivory Chikankari Anarkali Set", category: "Traditional", price: 7800, fabric: "Mul cotton", tag: "Festive", tone: "#F1E6D9",
    images: [IMG.traditional], sizes: SIZES, occasions: ["Festive", "Office"],
    description: "Hand chikankari on breathable mul, with matching dupatta and pants.",
    details: ["Anarkali, pants and dupatta", "Hand chikankari", "Lined"], care: DRY },
  { slug: "gota-patti-lehenga-set", name: "Gota Patti Lehenga Set", category: "Traditional", price: 18500, fabric: "Silk", tag: "Bridal", tone: "#F3DCD3",
    images: [IMG.traditional, IMG.silkC], sizes: SIZES, occasions: ["Wedding"], stock: 2,
    description: "A twirling lehenga with hand-applied gota patti, blouse and dupatta.",
    details: ["Lehenga, blouse and dupatta", "Hand-applied gota patti", "Can-can lining"], care: DRY },
  { slug: "gota-patti-sharara-set", name: "Gota Patti Sharara Set", category: "Traditional", price: 8400, fabric: "Georgette", isNew: true, tone: "#EDE6D8",
    images: [IMG.traditional], sizes: SIZES, occasions: ["Wedding", "Festive"],
    description: "Short kurta, flared sharara and dupatta with gota patti borders — made for mehndi.",
    details: ["Kurta, sharara and dupatta", "Gota patti borders", "Lined"], care: DRY },
  { slug: "rose-silk-kurta-set", name: "Rose Silk Kurta Set", category: "Traditional", price: 5600, mrp: 6400, fabric: "Art silk", tone: "#F4E0DA",
    images: [IMG.traditional], sizes: SIZES, occasions: ["Festive", "Office"],
    description: "Straight kurta with pants and an organza dupatta in rose.",
    details: ["Kurta, pants and dupatta", "Art silk with organza dupatta"], care: DRY },

  // ── Hand painted
  { slug: "hand-painted-lotus-silk-saree", name: "Hand-painted Lotus Silk Saree", category: "Hand Painted", price: 14500, fabric: "Pure silk", tag: "One of a kind", tone: "#F6E6DF",
    images: [IMG.painting, IMG.silkA, IMG.silkC], blouseOptions: true, occasions: ["Wedding", "Festive"], stock: 1,
    description: "Lotus buds painted by hand across the pallu over three days. No two are the same.",
    details: ["Pure silk, 5.5 m with blouse piece", "Freehand fabric painting, heat-set", "Signed and numbered"], care: ["Dry clean only for the first three washes", "Iron on the reverse, low heat"] },
  { slug: "painted-peony-dupatta", name: "Painted Peony Dupatta", category: "Hand Painted", price: 3600, fabric: "Chanderi", tag: "One of a kind", tone: "#F4E3DA",
    images: [IMG.painting, IMG.silkA], occasions: ["Festive", "Party"], stock: 1,
    description: "Full peony blooms painted by hand on soft chanderi.",
    details: ["Chanderi, 2.4 m", "Freehand fabric painting", "Tassels on both ends"], care: ["Dry clean only for the first three washes"] },
  { slug: "painted-bud-blouse", name: "Painted Bud Blouse", category: "Hand Painted", price: 3950, fabric: "Raw silk", isNew: true, tone: "#F2E4D6",
    images: [IMG.painting, IMG.blouse], sizes: SIZES, occasions: ["Festive", "Party"], stock: 3,
    description: "Tiny lotus buds painted by hand across the sleeves and back.",
    details: ["Raw silk, lined", "Freehand fabric painting", "Back hooks"], care: ["Dry clean only"] },
  { slug: "gold-vine-painted-mul-saree", name: "Gold-vine Painted Mul Saree", category: "Hand Painted", price: 5800, fabric: "Mul cotton", tone: "#F5EBDD",
    images: [IMG.painting, IMG.silkB], blouseOptions: true, occasions: ["Everyday", "Festive"], stock: 2,
    description: "A breezy mul saree with a fine gold vine painted along the border.",
    details: ["Mul cotton, 5.5 m with blouse piece", "Hand-painted metallic border"], care: ["Dry clean only for the first three washes"] },
];

/* ─────────── Collections (category & curated pages) ─────────── */
export type Collection = {
  slug: string;
  name: string;
  blurb: string;
  image: string;
  tone: string;
  match: (p: Product) => boolean;
};

export const collections: Collection[] = [
  { slug: "sarees", name: "Sarees", blurb: "Organza, tissue, mul and silk — fall and pico done, ready to drape.", image: IMG.saree, tone: "#F3DDD6", match: (p) => p.category === "Sarees" },
  { slug: "blouses", name: "Designer Blouses", blurb: "Ready blouses in XS–XXL with 1\" margin for easy alteration.", image: IMG.blouse, tone: "#F2E4D6", match: (p) => p.category === "Blouses" },
  { slug: "tassels", name: "Tassels & Latkans", blurb: "Hand-tied finishing touches for sarees, blouses and dupattas.", image: IMG.tassels, tone: "#F5E2DC", match: (p) => p.category === "Tassels" },
  { slug: "western", name: "Western Wear", blurb: "Dresses and co-ords in soft colours, for brunch to reception.", image: IMG.western, tone: "#F6E4DE", match: (p) => p.category === "Western" },
  { slug: "traditional", name: "Traditional Wear", blurb: "Anarkalis, lehengas, shararas and kurta sets.", image: IMG.traditional, tone: "#F3DCD3", match: (p) => p.category === "Traditional" },
  { slug: "hand-painted", name: "Hand Painted", blurb: "Painted by hand, stroke by stroke — every piece is one of one.", image: IMG.painting, tone: "#F6E6DF", match: (p) => p.category === "Hand Painted" },
  { slug: "new-arrivals", name: "New Arrivals", blurb: "Just in from the studio.", image: IMG.silkA, tone: "#F4E6DA", match: (p) => !!p.isNew },
  { slug: "festive-edit", name: "The Festive Edit", blurb: "Pujo, Diwali and celebration dressing, sorted.", image: IMG.silkC, tone: "#F1E3D2", match: (p) => p.occasions.includes("Festive") },
  { slug: "wedding-edit", name: "The Wedding Edit", blurb: "For brides, bridesmaids and every function in between.", image: IMG.silkB, tone: "#F3DCD3", match: (p) => p.occasions.includes("Wedding") },
  { slug: "under-3000", name: "Under ₹3,000", blurb: "Pretty pieces at easy prices.", image: IMG.tassels, tone: "#F5E2DC", match: (p) => p.price < 3000 },
  { slug: "sale", name: "Sale", blurb: "Limited-time prices on selected pieces.", image: IMG.western, tone: "#F6E4DE", match: (p) => !!p.mrp },
];

export const getCollection = (slug: string) => collections.find((c) => c.slug === slug);
export const getProduct = (slug: string) => products.find((p) => p.slug === slug);
export const collectionForCategory = (c: Category) => collections.find((x) => x.match({ category: c } as Product) && x.slug !== "new-arrivals")!;

/** Homepage category tiles */
export const categories = [
  { name: "Sarees", image: IMG.saree, from: "From ₹3,950", href: "/collections/sarees/" },
  { name: "Designer Blouses", image: IMG.blouse, from: "From ₹1,290", href: "/collections/blouses/" },
  { name: "Tassels", image: IMG.tassels, from: "From ₹450", href: "/collections/tassels/" },
  { name: "Western Wear", image: IMG.western, from: "From ₹2,990", href: "/collections/western/" },
  { name: "Traditional Wear", image: IMG.traditional, from: "From ₹5,600", href: "/collections/traditional/" },
  { name: "Customised Outfits", image: IMG.custom, from: "Made to measure", href: "/custom/" },
  { name: "Hand Painting", image: IMG.painting, from: "One of a kind", href: "/collections/hand-painted/" },
];

export const discountPct = (p: Product) => (p.mrp ? Math.round(((p.mrp - p.price) / p.mrp) * 100) : 0);

export function searchProducts(q: string) {
  const s = q.trim().toLowerCase();
  if (!s) return [];
  const words = s.split(/\s+/);
  return products.filter((p) => {
    const hay = [p.name, p.category, p.fabric, p.description, p.tag ?? "", ...p.occasions].join(" ").toLowerCase();
    return words.every((w) => hay.includes(w));
  });
}
