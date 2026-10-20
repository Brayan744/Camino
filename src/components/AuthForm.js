"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const TABS = [
  ["create", "Crear pareja"],
  ["join", "Unirme"],
  ["login", "Ya tengo cuenta"],
];

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState("create");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [pin, setPin] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode, name, pin, code }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Algo salió mal.");
      if (mode === "create") setCreated(d.code);
      else {
        router.push("/inicio");
        router.refresh();
      }
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  }

  if (created) {
    return (
      <div className="card p-6 text-center">
        <p className="eyebrow">Su código de pareja</p>
        <p className="heading my-3 text-5xl font-semibold tracking-widest">{created}</p>
        <p className="text-sm text-muted">
          Compártelo con tu pareja. Con este código y un nombre propio podrá unirse. Guárdalo también para volver a entrar.
        </p>
        <button className="btn-primary mt-6" onClick={() => { router.push("/inicio"); router.refresh(); }}>
          Continuar
        </button>
      </div>
    );
  }

  return (
    <div className="card p-6">
      <div className="mb-5 flex gap-1 rounded-full border border-line p-1 text-sm">
        {TABS.map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => { setMode(k); setErr(""); }}
            className={`flex-1 rounded-full px-3 py-2 transition ${mode === k ? "bg-brand text-bg" : "text-muted"}`}
          >
            {label}
          </button>
        ))}
      </div>
      <form onSubmit={submit} className="space-y-3">
        <input className="input" placeholder="Tu nombre" value={name} onChange={(e) => setName(e.target.value)} maxLength={30} />
        {mode !== "create" && (
          <input
            className="input uppercase tracking-widest"
            placeholder="Código de pareja"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
          />
        )}
        <input
          className="input"
          type="password"
          inputMode="numeric"
          placeholder="PIN (4 a 8 números)"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          maxLength={8}
        />
        {err && <p className="text-sm text-red-600">{err}</p>}
        <button className="btn-primary w-full" disabled={busy}>
          {busy ? "Un momento…" : mode === "create" ? "Crear pareja" : mode === "join" ? "Unirme" : "Entrar"}
        </button>
      </form>
    </div>
  );
}