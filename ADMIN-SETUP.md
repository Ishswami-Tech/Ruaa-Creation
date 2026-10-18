# Ruaa studio admin

The panel is at `/admin/`; sign in at `/admin/login/`. It uses PostgreSQL, Prisma, secure HTTP-only sessions and server-side authorization. No default password or public sign-up is provided.

## Connect the existing database

1. Copy `.env.example` to `.env` locally. Set `DATABASE_URL` to your PostgreSQL connection. Use the provider's pooler URL for Vercel and optional `DIRECT_URL` for migrations. Keep TLS verification enabled. Add those same variables to the project's Vercel Production environment. Never commit them or put them in browser-visible variables.
2. Inspect the existing database/Prisma history before applying this migration. This project adds only `Ruaa*` tables; it does not alter existing business tables. If the database has another Prisma migration history, merge the new models/migration into that history or use a dedicated PostgreSQL schema before deploying. Do not reset or force-push an existing database.
3. Run `npm run db:generate`, then `npm run db:deploy` against the intended database after reviewing the migration. Migrations are intentionally not applied automatically by a Vercel build.
4. Run `npm run db:seed` once to import the current catalogue. It preserves existing products rather than overwriting their edits. Some existing photos are illustrations; replace these in the panel before launch.
5. Run `npm run admin:account` in an interactive terminal. Enter the owner's email and a strong password of at least 14 characters. Password input is hidden; only a salted scrypt hash is stored. Running this again resets that account's password and revokes its sessions. To revoke an account, set its `active` field to false in the database.
6. Deploy on Vercel, sign in, and verify product/image edits from a second browser. `DATABASE_URL` is needed at runtime; CI can build without it. Until connected, the existing catalogue still works and `/admin/` is an explicit read-only setup preview. No preview credentials grant access.

## Capabilities

- Products: create, edit, publish, save drafts, archive, change prices/MRP, photos and cover order, sizes, colours, occasions, fabric, details, care, badges and shared stock.
- Categories: create/edit/reorder, cover photo and description, delete only empty categories. The shop filters, category tiles and category URLs read shared data.
- Images: authenticated upload, verified image decoding, metadata removal, rotation/resizing and WebP conversion. Photos are stored in PostgreSQL, served by immutable image URLs, and reusable from the library. JPEG/PNG/WebP input, 3 MB maximum, up to 12 images per product. Used photos cannot be deleted. Back up image rows with the database. For a large catalogue, move the media adapter to object storage rather than growing PostgreSQL indefinitely.
- Orders: checkout records a server-priced request, then opens WhatsApp. Admin confirms availability/payment manually and updates fulfilment, payment state, tracking and internal notes. Inventory is deducted atomically on confirmation, restored on cancellation before delivery. No online payment gateway is enabled. Request keys prevent duplicate submissions; request and login limits are shared across server instances.
- A session lasts 8 hours. Every admin API checks the session and request origin. Stock and product/order updates use transactions and version checks; stale forms are rejected. Audit events record admin operations without passwords or customer details.

## Release checks

Run `npm run lint`, `npm test`, `npm run build`. With a disposable PostgreSQL database, run `npm run test:integration` after setting `TEST_DATABASE_URL`; this does not use production `DATABASE_URL`. Test unauthorized access, login/logout, product create/edit/publish/archive, actual photo upload, category changes, checkout retry/price tampering, stock confirmation and cancellation. Verify desktop and 360 px mobile. Keep PostgreSQL backups and recovery settings with the database provider.

Only the latest 500 orders and 200 uploaded images are loaded in this first version. Payment state is a manual record; it does not verify a transfer or issue a refund. Stock is per product, shared across sizes/colours. Customer account history remains on their device; the admin inbox is the shared order record. Business identity/address details are not added publicly.
