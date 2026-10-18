# Production readiness

## Implemented and verified locally — 18 October 2026

- Responsive storefront and separate `/admin/` panel for products, categories, photos and manual WhatsApp orders.
- PostgreSQL/Prisma schema, additive migration, non-overwriting catalogue import, and administrator account provisioning.
- Server-priced checkout requests, safe retries, stock checks, atomic stock deduction on admin confirmation and restoration on cancellation before delivery.
- Protected admin endpoints, HTTP-only expiring sessions, salted password hashes, shared login limits, origin checks, validation, stale edit detection and audit events.
- Production build, TypeScript, commerce/security tests and integration checks against an isolated local PostgreSQL database. The CI workflow repeats these checks with an isolated PostgreSQL service.
- Brand fonts bundled with their licenses, so builds and browsers do not depend on Google Fonts downloads.

## Pending production connection

The owner will provide PostgreSQL connection details later. No production database has been connected or migrated for this change. Without `DATABASE_URL`, the starter shop and manual WhatsApp flow remain usable, and the admin page explicitly shows a read-only setup preview. Saving edits, uploads and server order recording require setup in `ADMIN-SETUP.md`.

Review existing Prisma migration history before applying new tables to an existing database. Do not reset the database. Configure provider backups and test recovery. Run the owner account setup locally; no default admin password exists.

## Remaining launch checks

- Replace illustrative product artwork with real photos; verify stock, prices, sizes, colours, stitching surcharges and product claims. Imported pieces with no known stock start at zero until staff set inventory.
- Test receiving checkout/contact/custom requests on the configured WhatsApp number, +91 79726 57888. A saved request is not a confirmed sale. Staff manually verify availability, delivery and payment.
- The business name is Ruaa Creation. The owner's private address, founder name and other public business fields remain omitted as requested. Confirm the intended domain and Instagram account. Canonical URLs default to `https://ruaa-creation.vercel.app`; configure an owned custom domain through `NEXT_PUBLIC_SITE_URL` before rebuilding. See `SEO-READINESS.md` for search verification steps.
- Have the owner approve shipping, COD, exchange, tax and privacy copy against actual operations. No payment gateway, verified payment webhook, courier integration or email delivery is implemented.
- Customer account history, saved measurements and addresses remain on the customer's device. The shared admin inbox records database-backed checkout requests; payment state is recorded manually. Stock is shared across sizes and colours.
- The admin currently loads the latest 500 orders and 200 media records. PostgreSQL image storage is suitable for a small catalogue; plan object storage/pagination for significant growth.

## Release

Run `npm ci`, `npm run lint`, `npm test`, `npm run build`, and `npm run test:integration` with an isolated `TEST_DATABASE_URL`. `npm run release` also runs the real-photo launch check, which intentionally fails while illustrative catalogue photos remain.

Deploy the Next.js application on Vercel. The GitHub workflow stages the production build, checks key URLs and promotes the same artifact. Static hosting by copying `out` is no longer supported. Check HTTPS, response headers, sitemap/domain settings, checkout handoff and second-device catalogue edits after the production database is connected.
