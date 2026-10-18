import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function manifest(): MetadataRoute.Manifest {
  return { name: site.name, short_name: "Ruaa", description: site.description, start_url: "/", display: "browser", background_color: "#FBF5EE", theme_color: "#3B2A1E", lang: "en-IN", icons: [{ src: "/images/favicon.png", sizes: "64x64", type: "image/png" }, { src: "/images/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] };
}
