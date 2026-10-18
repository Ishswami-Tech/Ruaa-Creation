import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
export const runtime = "nodejs";
export const dynamic = "force-static";
export async function GET() {
  const logo = await readFile(join(process.cwd(), "public/images/logo.jpg"));
  return new ImageResponse(<div style={{ display: "flex", width: "100%", height: "100%", background: "#FBF5EE", padding: 52, color: "#3B2A1E" }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: "100%", border: "2px solid #D9B98F", gap: 20 }}><img src={`data:image/jpeg;base64,${logo.toString("base64")}`} width={132} height={132} style={{ borderRadius: "50%" }} alt="" /><div style={{ display: "flex", fontSize: 68, letterSpacing: 7 }}>RUAA CREATION</div><div style={{ display: "flex", fontSize: 27, color: "#9E4E48" }}>Woven in Elegance</div><div style={{ display: "flex", fontSize: 23, marginTop: 16 }}>Sarees · Designer blouses · Custom outfits</div></div></div>, { width: 1200, height: 630 });
}
