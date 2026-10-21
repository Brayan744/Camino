"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, ShieldCheck, Check, X } from "lucide-react";

const TIERS = [
  { min: 100, a: "#f59e0b", b: "#fde047", name: "Llama dorada" },
  { min: 30, a: "#2563eb", b: "#22d3ee", name: "Fuego azul" },
  { min: 14, a: "#9333ea", b: "#ec4899", name: "Fuego violeta" },
  { min: 7, a: "#dc2626", b: "#f97316", name: "Gran llama" },
  { min: 3, a: "#f97316", b: "#fbbf24", name: "Fuego" },
  { min: 1, a: "#f59e0b", b: "#fcd34d", name: "Chispa" },
  { min: 0, a: "#9aa0b5", b: "#cfd3e0", name: "Apagada" },
];
const MILESTONES = [3, 7, 14, 30, 50, 100, 200, 365];
const SAVER = "#38bdf8";
const dias = (n) => (n === 1 ? "día" : "días");
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

export default function StreakCard({ count, best, todayDone, rescue, week, savers }) {
  const router = useRouter();
  const tier = TIERS.find((t) => count >= t.min);
  const next = MILESTONES.find((m) => m > count);
  const prev = [...MILESTONES].reverse().find((m) => m <= count) || 0;
  const pct = next ? Math.round(((count - prev) / (next - prev)) * 100) : 100;
  const me = savers.find((s) => s.mine);

  const [showNext, setShowNext] = useState(false);
  const [pop, setPop] = useState(false);
  const [selKey, setSelKey] = useState(null);
  const [party, setParty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!todayDone || !MILESTONES.includes(count)) return;
    try {
      if (localStorage.getItem("ms") === String(count)) return;
      localStorage.setItem("ms", String(count));
    } catch (e) {}
    setParty(true);
    const t = setTimeout(() => setParty(false), 3600);
    return () => clearTimeout(t);
  }, [count, todayDone]);

  const base = party
    ? `¡Llegaron a ${count} ${dias(count)} seguidos! 🎉`
    : todayDone
    ? "¡Hoy ya sumaron! Vuelvan mañana para seguir creciendo."
    : count > 0
    ? "Lean hoy un capítulo para mantener la llama viva."
    : "Lean un capítulo hoy y enciendan su racha.";
  const message = showNext && next ? `Faltan ${next - count} ${dias(next - count)} para llegar a ${next}.` : base;

  function poke() {
    setPop(true);
    setTimeout(() => setPop(false), 450);
    setShowNext((v) => !v);
  }

  async function rescueIt() {
    setBusy(true);
    setErr("");
    try {
      const r = await fetch("/api/streak/freeze", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "No se pudo usar el salvarracha.");
      router.refresh();
    } catch (e) {
      setErr(e.message);
    }
    setBusy(false);
  }

  const sel = week.find((d) => d.key === selKey);
  let detail = null;
  if (sel) {
    const f = cap(sel.full);
    if (sel.state === "read") detail = `${f}: ${sel.who.length === 1 ? "leyó " + sel.who[0] : "leyeron " + sel.who.join(" y ")}.`;
    else if (sel.state === "saved") detail = `${f}: salvado con el salvarracha de ${sel.savedBy} 🛡️`;
    else if (sel.state === "today") detail = "Hoy: aún no han leído.";
    else if (sel.state === "missed") detail = `${f}: ese día no hubo lectura.`;
    else detail = `${f}: todavía no habían empezado.`;
  }

  return (
    <div
      className="relative overflow-hidden rounded-xl2 border p-5 shadow-soft"
      style={{ borderColor: tier.a + "55", background: `linear-gradient(135deg, ${tier.a}22, var(--surface) 70%)` }}
    >
      <style>{`
        @keyframes flame { 0%,100% { transform: scale(1) rotate(-1.5deg) } 50% { transform: scale(1.06,1.12) rotate(1.5deg) } }
        @keyframes pop { 0% { transform: scale(1) } 40% { transform: scale(1.3) rotate(-6deg) } 100% { transform: scale(1) } }
        @keyframes floatUp { 0% { transform: translateY(0) scale(.6); opacity: 0 } 15% { opacity: 1 } 100% { transform: translateY(-190px) scale(1.2); opacity: 0 } }
        @keyframes pulseRing { 0%,100% { opacity: .55 } 50% { opacity: 1 } }
      `}</style>

      {party &&
        Array.from({ length: 16 }, (_, i) => (
          <span
            key={i}
            className="pointer-events-none absolute bottom-6 text-xl"
            style={{ left: `${(i * 13 + 4) % 92}%`, animation: `floatUp 2.6s ease-out ${i * 0.12}s both` }}
          >
            {["🔥", "✨", "🎉", "⭐"][i % 4]}
          </span>
        ))}

      <div className="flex items-center gap-4">
        <button onClick={poke} aria-label="Ver mensaje de la racha" className="shrink-0" style={{ animation: pop ? "pop .45s ease" : "none" }}>
          <svg
            width="84"
            height="84"
            viewBox="0 0 64 64"
            style={{
              animation: count > 0 ? "flame 1.7s ease-in-out infinite" : "none",
              transformOrigin: "50% 90%",
              filter: count > 0 ? `drop-shadow(0 0 14px ${tier.a}99)` : "none",
            }}
          >
            <defs>
              <linearGradient id="flameGrad" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={tier.a} />
                <stop offset="100%" stopColor={tier.b} />
              </linearGradient>
            </defs>
            <path d="M32 3c2 10 13 16 13 31a13 13 0 0 1-26 0c0-6 3-10 5-13 1 4 3 6 5 6 0-8-2-14 3-24z" fill="url(#flameGrad)" />
            <path d="M32 30c1 5 6 8 6 14a6 6 0 0 1-12 0c0-3 2-5 3-7 1 2 2 3 3 3 0-4-1-7 0-10z" fill="#fff" opacity=".55" />
          </svg>
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <span className="heading text-5xl font-semibold leading-none" style={{ color: tier.a }}>{count}</span>
            <span className="text-sm text-muted">{count === 1 ? "día seguido" : "días seguidos"}</span>
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className="rounded-full px-2.5 py-1 font-medium text-white" style={{ background: `linear-gradient(135deg, ${tier.a}, ${tier.b})` }}>{tier.name}</span>
            <span className="text-muted">Mejor: {best} {dias(best)}</span>
          </div>
        </div>
      </div>

      <p className="mt-4 rounded-xl px-3 py-2 text-sm" style={{ background: "var(--surface)", border: "1px solid var(--line)" }}>{message}</p>

      {next && (
        <div className="mt-3">
          <div className="mb-1 flex justify-between text-[11px] text-muted"><span>Próxima meta</span><span>{next} días</span></div>
          <div className="h-2 overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
            <div className="h-full rounded-full" style={{ width: pct + "%", background: `linear-gradient(90deg, ${tier.a}, ${tier.b})`, transition: "width .8s ease" }} />
          </div>
        </div>
      )}

      <div className="mt-5 flex justify-between">
        {week.map((d) => {
          const isSel = selKey === d.key;
          let style = {};
          let content = null;
          if (d.state === "read") { style = { background: `linear-gradient(135deg, ${tier.a}, ${tier.b})`, color: "#fff" }; content = <Check size={16} />; }
          else if (d.state === "saved") { style = { background: SAVER, color: "#fff" }; content = <ShieldCheck size={16} />; }
          else if (d.state === "today") { style = { border: `2px dashed ${tier.a}`, color: tier.a, animation: "pulseRing 1.8s ease-in-out infinite" }; content = <span className="text-[10px] font-semibold">HOY</span>; }
          else if (d.state === "missed") { style = { background: "var(--line)", color: "var(--muted)" }; content = <X size={14} />; }
          else { style = { border: "1px solid var(--line)" }; }
          return (
            <button key={d.key} onClick={() => setSelKey(isSel ? null : d.key)} className="flex flex-col items-center gap-1.5">
              <span className="text-[11px] font-medium uppercase text-muted">{d.label}</span>
              <span
                className="flex h-9 w-9 items-center justify-center rounded-full transition"
                style={{ ...style, ...(isSel ? { outline: `2px solid ${tier.a}`, outlineOffset: 2 } : {}) }}
              >
                {content}
              </span>
            </button>
          );
        })}
      </div>
      {detail && <p className="mt-3 text-center text-xs text-muted">{detail}</p>}

      {rescue && (
        <div className="mt-5 rounded-xl p-4" style={{ border: `1px solid ${SAVER}`, background: SAVER + "1a" }}>
          <p className="flex items-center gap-2 text-sm font-semibold"><ShieldCheck size={18} style={{ color: SAVER }} /> ¡Su racha está en peligro!</p>
          <p className="mt-1 text-sm text-muted">Ayer no leyeron. Pueden salvar su racha de {rescue.lost} {dias(rescue.lost)} con un salvarracha.</p>
          {me && me.left > 0 ? (
            <button onClick={rescueIt} disabled={busy} className="btn-primary mt-3 w-full">{busy ? "Un momento…" : "Usar mi salvarracha 🛡️"}</button>
          ) : (
            <p className="mt-2 text-xs text-muted">Ya usaste tus salvarrachas de este mes. Tu pareja todavía podría usar uno.</p>
          )}
          {err && <p className="mt-2 text-xs text-red-600">{err}</p>}
        </div>
      )}

      <div className="mt-5 border-t border-line pt-4">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted">Salvarrachas de este mes</p>
        <div className="space-y-1.5">
          {savers.map((s) => (
            <div key={s.id} className="flex items-center justify-between text-sm">
              <span>{s.mine ? "Tú" : s.name}</span>
              <span className="flex items-center gap-1">
                {[0, 1].map((i) =>
                  i < s.left ? <ShieldCheck key={i} size={20} style={{ color: SAVER }} /> : <Shield key={i} size={20} className="text-muted opacity-40" />
                )}
                <span className="ml-1 text-xs text-muted">{s.left}/2</span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}