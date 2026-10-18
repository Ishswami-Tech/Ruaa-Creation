import type { Metadata, Viewport } from "next";
import "./fonts.css";
import "./globals.css";
import "./responsive.css";
import "./ruaa.css";
import { CartProvider } from "@/components/CartProvider";
import StorefrontShell from "@/components/StorefrontShell";
import { CatalogueProvider } from "@/components/CatalogueProvider";
import { getCatalogue, getCategories } from "@/lib/catalogue";
import { connection } from "next/server";
import { databaseConfigured } from "@/lib/db";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  icons: { icon: "/images/favicon.png", apple: "/images/apple-touch-icon.png" },
  applicationName: site.name,
  formatDetection: { telephone: false },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION || undefined, other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined },
};

export const viewport: Viewport = { themeColor: "#3B2A1E" };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  await connection();
  const [products, categories] = await Promise.all([getCatalogue(), getCategories()]);
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <CatalogueProvider products={products} categories={categories} connected={databaseConfigured()}><CartProvider><StorefrontShell>{children}</StorefrontShell></CartProvider></CatalogueProvider>
      </body>
    </html>
  );
}
