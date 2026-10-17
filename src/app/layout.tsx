import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s · ${site.name}` },
  description: site.description,
  icons: { icon: "/images/favicon.png", apple: "/images/apple-touch-icon.png" },
  openGraph: { title: site.name, description: site.description, images: ["/images/banner.jpg"], type: "website", locale: "en_IN" },
};

export const viewport: Viewport = { themeColor: "#3B2A1E" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Jost:wght@300;400;500&family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=DM+Sans:wght@400;500;700&display=swap"
        />
      </head>
      <body>
        <a className="skip-link" href="#main">Skip to content</a>
        <CartProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
          <BottomNav />
        </CartProvider>
      </body>
    </html>
  );
}
