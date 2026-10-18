# SEO verification

Implemented locally on 18 October 2026: unique public page titles, descriptions, canonical URLs, Open Graph/Twitter previews, product offers, breadcrumbs, collection structured data, a dynamic sitemap, private-page noindex directives, a branded sharing image and browser manifest.

Run `npm run build` then `npm run test:seo`. The production-server crawl checks 41 public pages, private-page directives, real 404 responses, robots, sitemap, images and sharing assets.

Canonical URLs default to https://ruaa-creation.vercel.app. Set `NEXT_PUBLIC_SITE_URL` to the final owned domain before rebuilding when it changes. Configure that preferred domain in Vercel.

Optional `GOOGLE_SITE_VERIFICATION` and `BING_SITE_VERIFICATION` variables support ownership verification. Verify ownership in the webmaster accounts and submit `/sitemap.xml` after deployment. Account verification, submission and indexing have not been performed; search engines determine indexing and rankings.

Connect PostgreSQL and create the administrator using ADMIN-SETUP.md before enabling catalogue saves and shared order recording. Replace illustrative product photos and verify actual prices and inventory before launch. WhatsApp checks did not send test messages.

Google guidance: https://developers.google.com/search/docs/specialty/ecommerce
Indexing directives: https://developers.google.com/search/docs/crawling-indexing/block-indexing
