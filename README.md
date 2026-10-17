# Ruaa Creation — website

See [PRODUCTION-READINESS.md](PRODUCTION-READINESS.md) for launch blockers, operating limitations and release checks. This is a static storefront: host the generated `out` directory; `next start` is not supported for this export.

Next.js 16 (App Router, TypeScript) storefront for **Ruaa Creation — Woven in Elegance**.

- **Brand pages** (Home, Custom Orders, Hand Painting, Our Story, Contact, Policies): *Blush Atelier* design (Cormorant Garamond + Jost).
- **Store pages** (Shop, Product, Bag, Checkout): *Ready-to-Wear Shop* design (Fraunces + DM Sans) — search, filters, rounded product cards.
- Working bag (saved in the visitor's browser), coupon `RUAA10`, free-shipping threshold, COD fee/limit.
- Checkout, custom-order brief and contact form send a ready-made message to your **WhatsApp** — no backend or payment gateway needed to launch.

## Store features (October 2026 update)

- Mega menu, search overlay with live suggestions (`/search/?q=`), 11 collection pages (`/collections/<slug>/` — categories plus Festive, Wedding, New Arrivals, Under ₹3,000, Sale), filters (size, occasion, price, fabric) and sorting.
- Wishlist, slide-out mini bag, free-shipping progress bar, sale prices with % off, low-stock badges, size-guide pop-up, delivery-date estimate, recently viewed, "complete the look".
- Order confirmation page (`/checkout/success/`) and My account (`/account/`): orders placed from this device, re-order, WhatsApp tracking, saved measurements and addresses. Sign-in is by mobile number on this device only — there is no server account, OTP or sync.
- Collections live in `src/lib/products.ts` (`collections`); add an edit by adding one line with a `match` rule.

## 1. Edit your details (5 minutes)

| What | File |
|---|---|
| WhatsApp number, Instagram, shipping/COD rules and coupon | `src/lib/site.ts` |
| Products — names, prices, fabrics, sizes, descriptions, photos | `src/lib/products.ts` |
| Product photos | put them in `public/images/products/` and list them in each product's `images` |
| Brand story text | `src/app/about/page.tsx` |
| Colours & fonts | top of `src/app/globals.css` |

> The current product images are illustrations cut from your logo artwork. Replace them with real photos (portrait, 1200×1600 px, plain background works best) before launch.

## 2. Run it on your computer

```bash
npm install
npm run dev        # open http://localhost:3000
```

## 3. Publish

```bash
npm run build      # creates the ready-to-upload site in /out
```

- **Vercel (easiest, free):** push this folder to GitHub → import on vercel.com → Deploy. Connect your domain in Project → Domains.
- **Netlify:** drag the `/out` folder onto app.netlify.com/drop.
- **Hostinger / GoDaddy / cPanel:** upload the *contents* of `/out` to `public_html`.

## 4. When you're ready to grow

- **Online payments:** add Razorpay or Cashfree payment links in `src/app/checkout/page.tsx` (currently orders go to WhatsApp and you send a UPI/payment link).
- **Inventory & orders dashboard:** move products to Shopify (headless), Sanity or a Google Sheet, keeping these pages as the front end.
- **Newsletter:** currently links to Instagram. Add a connected subscription service before collecting email addresses.
- **Analytics:** add Google Analytics / Meta Pixel in `src/app/layout.tsx`.

## Pages

`/` · `/shop` · `/product/[slug]` · `/cart` · `/checkout` · `/custom` · `/hand-painting` · `/about` · `/contact` · `/policies?t=size|shipping|returns|privacy|terms`
