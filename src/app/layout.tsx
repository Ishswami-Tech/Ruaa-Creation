import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Jost, Fraunces, DM_Sans } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartProvider";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";
import { site } from "@/lib/site";

const atelierSerif = Cormorant_Garamond({ subsets: ["latin"], weight: ["400", "500", "600"], style: ["normal", "italic"], variable: "--font-atelier-serif", display: "swap" });
const atelierSans = Jost({ subsets: ["latin"], weight: ["300", "400", "500", "700"], variable: "--font-atelier-sans", display: "swap" });
const shopSerif = Fraunces({ subsets: ["latin"], weight: ["400", "500", "600"], variable: "--font-shop-serif", display: "swap" });
const shopSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-shop-sans", display: "swap" });

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
    <html lang="en" className={`${atelierSerif.variable} ${atelierSans.variable} ${shopSerif.variable} ${shopSans.variable}`}>
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
