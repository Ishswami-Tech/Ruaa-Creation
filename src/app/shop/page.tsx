import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import ShopClient from "./ShopClient";

export const metadata = pageMetadata('Shop sarees, designer blouses & festive wear', 'Explore Ruaa Creation ready-to-wear sarees, designer blouses, tassels, dresses and traditional sets. Choose your piece and request an order on WhatsApp.', '/shop/');

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Loading the collection…</div>}>
      <ShopClient />
    </Suspense>
  );
}
