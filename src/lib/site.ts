/**
 * ─────────────────────────────────────────────────────────────
 *  EDIT THIS FILE FIRST — your business details live here.
 *  Every page reads from it, so you only change things once.
 * ─────────────────────────────────────────────────────────────
 */
export const site = {
  name: "Ruaa Creation",
  tagline: "Woven in Elegance",
  description:
    "Ready-to-wear sarees, designer blouses, tassels, western & traditional wear, customised outfits and hand-painted pieces — finished by hand.",
  url: (process.env.NEXT_PUBLIC_SITE_URL || "https://ruaa-creation.vercel.app").replace(/\/$/, ""),

  // WhatsApp number in international format, digits only (91 = India). Orders and enquiries are sent here.
  whatsapp: "917972657888",
  whatsappDisplay: "+91 79726 57888",
  instagram: "ruaacreation",

  // Commerce rules (₹)
  freeShippingAbove: 2999,
  shippingFee: 99,
  codMax: 10000,
  codFee: 49,
  exchangeDays: 7,
  launchCode: "RUAA10",
  launchDiscountPct: 10,

};

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");

export const waLink = (message: string) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
