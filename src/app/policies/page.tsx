import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import PoliciesClient from "./PoliciesClient";

export const metadata = pageMetadata('Size guide, shipping & exchange policies', 'Find Ruaa Creation sizing information, shipping and exchange policies, privacy information and terms for WhatsApp order requests.', '/policies/');

export default function PoliciesPage() {
  return (
    <Suspense fallback={<div className="wrap" style={{ padding: 80 }}>Loading…</div>}>
      <PoliciesClient />
    </Suspense>
  );
}
