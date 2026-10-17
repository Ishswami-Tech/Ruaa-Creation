import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section center">
      <div className="wrap stack" style={{ alignItems: "center" }}>
        <img src="/images/logo.jpg" alt="" width={120} height={120} style={{ borderRadius: "50%" }} />
        <h1 className="h2">This page has wandered off.</h1>
        <p className="lead">Let&apos;s get you back to the collection.</p>
        <div className="row" style={{ justifyContent: "center" }}><Link href="/" className="btn">Home</Link><Link href="/shop/" className="btn btn-outline">Shop</Link></div>
      </div>
    </section>
  );
}
