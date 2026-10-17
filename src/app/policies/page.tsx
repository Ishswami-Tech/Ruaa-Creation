import { Suspense } from "react";
import type { Metadata } from "next";
import PoliciesClient from "./PoliciesClient";

export const metadata: Metadata = {
  title: "Size guide & policies",
  description: "Size guide, shipping, returns & exchanges, privacy policy and terms of sale.",
};

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Loading…</div>}>
      <PoliciesClient />
    </Suspense>
  );
}
