import { site } from "@/lib/site";

export default function Newsletter() {
  return (
    <div className="newsletter">
      <p>Use code <strong>{site.launchCode}</strong> for {site.launchDiscountPct}% off. Follow our latest collections on Instagram.</p>
      <a className="btn" href={`https://www.instagram.com/${site.instagram}/`} target="_blank" rel="noopener noreferrer">Follow Ruaa Creation</a>
    </div>
  );
}
