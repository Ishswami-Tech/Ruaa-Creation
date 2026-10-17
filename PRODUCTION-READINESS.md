# Production readiness

## Verification on 17 October 2026

- Production compilation, TypeScript checks and static page export passed.
- Four commerce regression tests passed.
- Production dependency audit reported zero known vulnerabilities for the locked dependencies.
- The launch configuration check intentionally fails for the 12 illustrative primary product images. Replace these with actual product photos before release.
- Browser interaction, receipt of WhatsApp messages, deployed response headers, domain ownership and mobile device checks remain manual release checks.

The app is a static catalogue with a browser bag and a WhatsApp order request flow. It has no order database, live inventory, payment processing, delivery serviceability API or email delivery. A WhatsApp draft is not a received or confirmed order. Staff must verify prices, availability, delivery and payment before confirming any request.

## Launch blockers

- WhatsApp is configured as +91 79726 57888. Test receiving checkout, contact and custom brief messages on this business account.
- The business name is Ruaa Creation. Address, founder identity, email, hours and registration fields have been removed from the public configuration at the owner’s request. WhatsApp links necessarily expose the ordering phone number. Confirm ownership of the domain and Instagram account. The domain is provisionally the existing `www.ruaacreation.com`; the owner is considering `.com` or `.in`. Confirm any required seller disclosures before launch.
- Replace illustrative catalogue images with real product photographs. Confirm every price, size, colour, blouse surcharge, availability and product claim.
- Have the business approve shipping, COD, exchange, tax and privacy information. The current content is sample copy; payment partner and fulfilment claims need to match actual operations.

## Release checks

1. Install with `npm ci`, then run `npm run release`. This checks launch configuration, types, commerce tests and the export build. `npm run build` alone remains available for preview builds with sample content.
2. Upload the newly generated `out` directory to static hosting. Do not use `next start` for this static export. Configure HTTPS and your domain.
3. Vercel headers are configured in `vercel.json`; Netlify-compatible headers are in `public/_headers`. Other hosts need equivalent response headers configured separately.
4. Check every route, product image and unknown URL on the deployed host. Confirm a missing page returns HTTP 404.
5. Test on mobile and desktop: filters, required sizes, quantity changes, reload persistence, coupon and discounted shipping, COD limits, empty bag, and WhatsApp handoff. Cancel WhatsApp and verify the bag remains available; retry the request link if a popup is blocked.
6. Confirm `/robots.txt` and `/sitemap.xml` use the live domain. Verify actual deployed headers and HTTPS. Keep a copy of the previous release for rollback.

## Account, wishlist and orders

- "My account", wishlist, recently viewed, saved measurements and addresses are stored only in the visitor's browser (localStorage). Sign-in asks for a mobile number but does not verify it; it only personalises this device. Say so in the privacy copy before launch.
- "My orders" lists order requests sent from this device with the original WhatsApp link, so a customer can resend one. It does not show real order status; "Track on WhatsApp" opens a status question for staff to answer.
- Account data is validated on load (unknown products and malformed entries are dropped) and capped in size.

## Operating scope

Customer addresses are included in the WhatsApp draft URL; no checkout details are saved to a server by this app. Review that data flow in the privacy copy. The bag remains in this browser until the customer removes it. The newsletter form was replaced with an Instagram link because subscriptions were not stored.

For automated checkout, scope a server-side order store, inventory checks, verified payment webhooks, notifications and an authenticated administration interface. These require service selection and credentials; they are not provided by the current static architecture.
