"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import BottomNav from "./BottomNav";

export default function StorefrontShell({ children }: { children: React.ReactNode }) {
  const admin = usePathname().startsWith("/admin");
  if (admin) return <main id="main">{children}</main>;
  return <><Header /><main id="main">{children}</main><Footer /><BottomNav /></>;
}
