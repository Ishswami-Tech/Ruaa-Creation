import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Server rendering lets catalogue changes appear without a deployment.
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
