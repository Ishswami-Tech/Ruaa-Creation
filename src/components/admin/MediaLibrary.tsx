"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminFetch } from "./AdminApp";

type Media = { id: string; name: string; width: number; height: number };
export default function MediaLibrary({ configured, compact = false, onSelect, onError }: { configured: boolean; compact?: boolean; onSelect?: (url: string) => void; onError: (message: string) => void }) {
  const [media, setMedia] = useState<Media[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(configured);
  const input = useRef<HTMLInputElement>(null);
  const load = useCallback(async () => { if (!configured) return; try { setMedia(await adminFetch("media")); } catch (e) { setError(e instanceof Error ? e.message : "Could not load images."); } finally { setLoading(false); } }, [configured]);
  useEffect(() => { void load(); }, [load]);
  const upload = async (files: FileList | null) => {
    if (!files || !configured) return;
    setBusy(true); setError("");
    try {
      for (const file of Array.from(files).slice(0, 12)) {
        if (file.size > 3 * 1024 * 1024) throw new Error(`${file.name} is larger than 3 MB. Please resize it first.`);
        const data = new FormData(); data.set("image", file);
        const uploaded = await adminFetch("media", "POST", data);
        onSelect?.(uploaded.url);
      }
      await load();
    } catch (e) { const message = e instanceof Error ? e.message : "Upload failed."; setError(message); onError(message); }
    finally { setBusy(false); if (input.current) input.current.value = ""; }
  };
  return <div className={`admin-media ${compact ? "compact" : ""}`}>
    <div className="admin-upload-area"><svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true"><path d="M12 16V3m-5 5 5-5 5 5M4 15v6h16v-6" /></svg><div><strong>{busy ? "Uploading your photos…" : "A closer look at every piece."}</strong><p>JPG, PNG or WebP · Up to 3 MB each</p></div><button type="button" className="admin-button secondary" disabled={!configured || busy} onClick={() => input.current?.click()}>{busy ? "Uploading…" : "Upload images"}</button><input ref={input} className="sr-only" type="file" multiple accept="image/jpeg,image/png,image/webp" aria-label="Choose product images" onChange={(e) => { void upload(e.target.files); }} /></div>
    {error && <p role="alert" className="admin-inline-error">{error} <button type="button" className="admin-text-button" onClick={() => { void load(); }}>Retry</button></p>}
    {loading ? <p role="status">Loading images…</p> : media.length ? <div className="admin-media-grid">{media.map((m) => <div key={m.id} className="admin-media-item"><button type="button" className="admin-image-select" disabled={!onSelect} onClick={() => onSelect?.(`/api/media/${m.id}/`)} aria-label={`Use ${m.name}`}><img src={`/api/media/${m.id}/`} alt={m.name} /></button><strong>{m.name}</strong><small>{m.width} × {m.height}</small>{onSelect ? <button className="admin-text-button" type="button" onClick={() => onSelect(`/api/media/${m.id}/`)}>Use image</button> : <button className="admin-text-button danger" type="button" disabled={busy} onClick={async () => { if (!window.confirm(`Delete ${m.name}? Images used by products or orders cannot be deleted.`)) return; try { await adminFetch("media", "DELETE", { id: m.id }); await load(); } catch (e) { setError(e instanceof Error ? e.message : "Could not delete image."); } }}>Delete</button>}</div>)}</div> : <p className="admin-media-empty">{configured ? "Your uploaded product photos will appear here." : "Image uploads become available after the database is connected."}</p>}
  </div>;
}
