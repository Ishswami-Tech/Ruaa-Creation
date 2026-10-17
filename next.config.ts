import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Builds a fully static site into /out — host it anywhere (Vercel, Netlify, Hostinger, cPanel, S3).
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
