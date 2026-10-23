"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle } from "lucide-react";

function Chip({ name, ok }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface p-2.5 text-sm">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold"
        style={ok ? { background: "#16a34a", color: "#fff" } : { border: "1.5px dashed var(--muted)", color: "var(--muted)" }}
      >
        {ok ? "✓" : ""}
      </span>
      <span className="min-w-0 leading-tight">
        <span className="block truncate font-medium">{name}</span>
        <span className="block text-[11px] text-muted">{ok ? "Ya leyó" : "Pendiente"}</span>
      </span>
    </div>
  );
}

export default function ReadButton({ book, chapter, done, meToday, partnerToday, partnerDone, lit }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [burst, setBurst] = useState(false);

  async function toggle() {
    setBusy(true);
    try {
      const r = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ book, chapter, done: !done }),
      });
      if (r.ok && !done) {
        setBurst(true);
        setTimeout(() => setBurst(false), 1700);
      }
      router.refresh();
    } catch (e) {}
    setBusy(false);
  }

  let hint = null;
  if (lit) hint = { icon: "🔥", text: "¡La racha de hoy ya está encendida!" };
  else if (meToday.marked && !meToday.wrote)
    hint = { icon: "💬", text: "Ahora escribe en el chat del capítulo que leíste. Para encender la racha, ambos deben leer y escribir.", action: true };
  else if (meToday.marked && meToday.wrote && partnerToday)
    hint = { icon: "⏳", text: `Ya cumpliste tu parte de hoy. Falta que ${partnerToday.name} ${!partnerToday.marked ? "lea y escriba" : "escriba en el chat"}.` };
  else if (!meToday.marked)
    hint = { icon: "📖", text: "Para la racha de hoy: lean un capítulo, márquenlo y escriban en su chat." };

  return (
    <div className="space-y-3">
      <div className="relative">
        {burst &&
          Array.from({ length: 12 }, (_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute text-xl"
              style={{ left: `${(i * 8 + 6) % 92}%`, bottom: 14, animation: `floatUp 1.5s ease-out ${i * 0.06}s both` }}
            >
              {["✨", "⭐", "🌟", "📖"][i % 4]}
            </span>
          ))}
        <button
          onClick={toggle}
          disabled={busy}
          className="w-full rounded-xl2 p-4 text-left shadow-soft transition active:scale-[.98]"
          style={
            done
              ? { background: "linear-gradient(135deg,#16a34a,#84cc16)", color: "#fff" }
              : { background: "linear-gradient(135deg,var(--brand),color-mix(in srgb, var(--brand) 55%, var(--accent)))", color: "var(--bg)" }
          }
        >
          <span className="flex items-center gap-4">
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
              style={{ background: "rgba(255,255,255,.2)", border: "2px solid rgba(255,255,255,.6)" }}
            >
              {done ? (
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="24" style={{ animation: "checkDraw .5s ease both" }} />
                </svg>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-current opacity-80" />
              )}
            </span>
            <span>
              <span className="heading block text-lg font-semibold">{done ? "¡Capítulo leído!" : "Marcar como leído"}</span>
              <span className="block text-xs opacity-85">{done ? "Toca para deshacer" : "Toca cuando termines de leerlo"}</span>
            </span>
          </span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Chip name="Tú" ok={done} />
        {partnerToday && <Chip name={partnerToday.name} ok={!!partnerDone} />}
      </div>

      {hint && (
        <div className="card flex items-start gap-3 p-3.5 text-sm">
          <span className="text-xl leading-none">{hint.icon}</span>
          <div className="flex-1">
            <p className="text-muted">{hint.text}</p>
            {hint.action && (
              <button onClick={() => window.dispatchEvent(new Event("open-chat"))} className="btn-primary mt-2 !px-4 !py-2">
                <MessageCircle size={16} /> Ir al chat
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}