import { site } from "@/lib/site";

export default function Brand({ light = false }: { light?: boolean }) {
  return (
    <span className={`brand${light ? " light" : ""}`}>
      <img src="/images/logo.jpg" alt="" width={68} height={68} />
      <span className="brand-wordmark" aria-label={site.name}>
        <span className="brand-name">Ruaa</span>
        <span className="brand-caption">Creation</span>
      </span>
    </span>
  );
}
