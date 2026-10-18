"use client";
import Link from "next/link";
export default function AdminError({ reset }: { reset: () => void }) { return <div className="admin-error-page"><h1>The studio couldn’t connect.</h1><p>Check that PostgreSQL is available and the Ruaa database migration has been applied. Your changes haven’t been saved.</p><button className="admin-button" onClick={reset}>Try again</button><Link href="/">Return to shop</Link></div>; }
