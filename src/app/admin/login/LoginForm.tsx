"use client";
import { useState } from "react";
import Link from "next/link";
import Brand from "@/components/Brand";
import { adminFetch } from "@/components/admin/AdminApp";

export default function LoginForm({ configured }: { configured: boolean }) {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [busy, setBusy] = useState(false); const [error, setError] = useState("");
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setBusy(true); setError(""); try { await adminFetch("session", "POST", { email, password }); window.location.assign("/admin/"); } catch (e) { setError(e instanceof Error ? e.message : "Please try again."); } finally { setBusy(false); } };
  return <div className="admin-login"><section className="admin-login-story"><Brand light /><div><h1>Behind every beautiful piece,<br />a well-run studio.</h1><p>Your catalogue, photos and orders.<br />All together, with a little room to create.</p></div><Link href="/">← Back to Ruaa Creation</Link></section><section className="admin-login-form"><div><h2>Welcome to your studio.</h2><p>Sign in to manage Ruaa Creation.</p>{!configured && <div className="admin-setup"><strong>Database connection pending</strong><span>Sign-in will be available after PostgreSQL is connected and your administrator account is created.</span><Link href="/admin/">Explore the admin preview →</Link></div>}{error && <div className="admin-alert" role="alert">{error}</div>}<form onSubmit={submit}><label>Email address<input type="email" autoComplete="username" required maxLength={120} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your admin email" /></label><label>Password<input type="password" autoComplete="current-password" required maxLength={256} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" /></label><button className="admin-button" disabled={!configured || busy}>{busy ? "Signing in…" : "Sign in to studio"}</button></form><small>Administrator access only. Contact your store owner if you need access or a password reset.</small></div></section></div>;
}
