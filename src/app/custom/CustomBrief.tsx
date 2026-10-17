"use client";

import { useState } from "react";
import { waLink } from "@/lib/site";

export default function CustomBrief() {
  const [step, setStep] = useState(1);
  const [f, setF] = useState({ item: "Designer blouse", occasion: "", date: "", idea: "", budget: "₹5,000 – ₹10,000", measure: "Studio visit", name: "", phone: "" });
  const [err, setErr] = useState("");
  const [link, setLink] = useState("");
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setF({ ...f, [k]: e.target.value });

  const next = () => {
    if (step === 3) {
      if (!f.name.trim() || f.phone.replace(/\D/g, "").length < 10) { setErr("Please add your name and a 10-digit WhatsApp number."); return; }
      const msg = `Custom order brief — Ruaa Creation\n\nWhat: ${f.item}\nOccasion: ${f.occasion || "-"}\nNeeded by: ${f.date || "-"}\nIdea: ${f.idea || "-"}\nBudget: ${f.budget}\nMeasurements: ${f.measure}\n\nName: ${f.name}\nWhatsApp: ${f.phone}\n\n(I'll attach reference photos here.)`;
      const destination = waLink(msg);
      setLink(destination);
      window.open(destination, "_blank", "noopener");
    }
    setErr("");
    setStep(step + 1);
  };

  return (
    <div className="stack" style={{ gap: 24 }}>
      <div className="center stack" style={{ gap: 6 }}>
        <h2 className="h2">Your design brief</h2>
        <p className="lead">Takes about two minutes. {step <= 3 ? `Step ${step} of 3.` : ""}</p>
      </div>
      <div className="progress" aria-hidden="true">{[1, 2, 3].map((n) => <span key={n} data-on={n <= Math.min(step, 3) ? "1" : "0"} />)}</div>

      {step === 4 ? (
        <div className="form center" style={{ display: "block", padding: 48 }}>
          <h3 className="h3">Your brief is ready to send</h3>
          <a className="btn" href={link} target="_blank" rel="noopener noreferrer">Open brief in WhatsApp</a>
          <p className="lead" style={{ marginTop: 10 }}>Your brief has opened in WhatsApp. Press send and attach any reference photos. Our designer will reply within 24 hours with questions and a first sketch.</p>
          <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={() => setStep(1)}>Start another brief</button>
        </div>
      ) : (
        <form className="form" onSubmit={(e) => { e.preventDefault(); next(); }}>
          {step === 1 && (
            <>
              <label className="field full">What would you like made?
                <select value={f.item} onChange={set("item")}>
                  <option>Designer blouse</option><option>Saree with blouse</option><option>Lehenga / festive set</option><option>Western outfit</option><option>Hand-painted piece</option><option>Something else</option>
                </select>
              </label>
              <label className="field">Occasion<input value={f.occasion} onChange={set("occasion")} placeholder="e.g. Sister's sangeet" /></label>
              <label className="field">Date you need it by<input type="date" value={f.date} onChange={set("date")} /></label>
            </>
          )}
          {step === 2 && (
            <>
              <label className="field full">Describe your idea<textarea rows={4} value={f.idea} onChange={set("idea")} placeholder="Colours, neckline, sleeves, work you like…" /></label>
              <label className="field full">Budget
                <select value={f.budget} onChange={set("budget")}><option>Under ₹5,000</option><option>₹5,000 – ₹10,000</option><option>₹10,000 – ₹25,000</option><option>Above ₹25,000</option></select>
              </label>
              <p className="full" style={{ margin: 0, fontSize: 14, color: "var(--ink-3)" }}>You&apos;ll attach reference photos in WhatsApp at the last step.</p>
            </>
          )}
          {step === 3 && (
            <>
              <fieldset className="full" style={{ border: 0, padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                <legend style={{ fontSize: 14, fontWeight: 500, marginBottom: 8 }}>How should we take your measurements?</legend>
                {["Studio visit", "Guided video call", "I'll send a well-fitting garment"].map((m) => (
                  <label key={m} className="radio"><input type="radio" name="measure" checked={f.measure === m} onChange={() => setF({ ...f, measure: m })} /> {m}</label>
                ))}
              </fieldset>
              <label className="field">Your name<input autoComplete="name" value={f.name} onChange={set("name")} /></label>
              <label className="field">WhatsApp number<input type="tel" autoComplete="tel" value={f.phone} onChange={set("phone")} /></label>
              {err && <p role="alert" className="full" style={{ margin: 0, color: "var(--rose)" }}>{err}</p>}
            </>
          )}
          <div className="full row" style={{ justifyContent: "space-between" }}>
            <button type="button" className="btn btn-outline" onClick={() => setStep(Math.max(1, step - 1))} disabled={step === 1}>Back</button>
            <button type="submit" className="btn">{step === 3 ? "Send my brief on WhatsApp" : "Next"}</button>
          </div>
        </form>
      )}
    </div>
  );
}
