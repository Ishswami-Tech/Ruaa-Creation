import { Suspense } from "react";
import type { Metadata } from "next";
import ShopClient from "./ShopClient";

export const metadata: Metadata = {
  title: "Shop ready-to-wear",
  description: "Shop ready-to-wear sarees, designer blouses, tassels, western and traditional wear — finished by hand.",
};

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Loading the collection…</div>}>
      <ShopClient />
    </Suspense>
  );
}
