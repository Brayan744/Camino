"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Mic, Square, Image as ImageIcon, Check, CheckCheck, ArrowDown } from "lucide-react";
import AudioPlayer from "./AudioPlayer";
import Flame from "./Flame";

const CSS = `
:root{--mine-bg:#d9fdd3;--mine-ink:#1f2937;--mine-accent:#128c7e;--tick:#2b9be6}
[data-theme="dark"]{--mine-bg:#1d4a3a;--mine-ink:#eaf3ee;--mine-accent:#6ee7b7;--tick:#53bdeb}
`;

const dayOf = (d) => new Date(d).toLocaleDateString("en-CA", { timeZone: "America/Bogota" });
function dayLabel(d) {
  const k = dayOf(d);
  const now = new Date();
  if (k === dayOf(now)) return "Hoy";
  if (k === dayOf(new Date(now.getTime() - 864e5))) return "Ayer";
  return new Date(d).toLocaleDateString("es", { day: "numeric", month: "long", timeZone: "America/Bogota" });
}

export default function Chat({ book, chapter }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState("");
  const [readUpTo, setReadUpTo] = useState(0);
  const [party, setParty] = useState(null);
  const [down, setDown] = useState(false);
  const lastId = useRef(0);
  const first = useRef(true);
  const stick = useRef(true);
  const box = useRef(null);
  const ta = useRef(null);
  const recorder = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);
  const startedAt = useRef(0);
  const fileInput = useRef(null);

  async function load() {
    try {
      const vis = document.visibilityState === "visible" ? 1 : 0;
      const r = await fetch(
        `/api/messages?book=${book}&chapter=${chapter}&after=${lastId.current}&visible=${vis}`,
        { cache: "no-store" }
      );
      if (!r.ok) return;
      const d = await r.json();
      setReadUpTo(d.readUpTo || 0);
      if (d.messages.length) {
        lastId.current = d.messages[d.messages.length - 1].id;
        if (!first.current) {
          const s = d.messages.find((x) => x.kind === "streak");
          if (s) {
            setParty(s.body.replace("🔥 ¡Racha encendida! ", ""));
            setTimeout(() => setParty(null), 4200);
          }
        }
        setMsgs((m) => {
          const ids = new Set(m.map((x) => x.id));
          return [...m, ...d.messages.filter((x) => !ids.has(x.id))];
        });
      }
      first.current = false;
    } catch (e) {}
  }

  useEffect(() => {
    load();
    const t = setInterval(load, 4000);
    const onVis = () => document.visibilityState === "visible" && load();
    document.addEventListener("visibilitychange", onVis);
    return () => {
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  useEffect(() => {
    if (stick.current) box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "auto" });
  }, [msgs.length]);

  useEffect(() => {
    const el = ta.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 128) + "px";
  }, [text, rec]);

  function onScroll(e) {
    const el = e.currentTarget;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    stick.current = near;
    setDown((d) => (d === !near ? d : !near));
  }

  function goDown() {
    stick.current = true;
    setDown(false);
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }

  function onKey(e) {
    if (e.key !== "Enter" || e.shiftKey) return;
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    if (coarse) return;
    e.preventDefault();
    send();
  }

  async function send(file, ignoreText, dur) {
    const t = ignoreText ? "" : text.trim();
    if (!t && !file) return;
    setBusy(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("book", book);
      fd.append("chapter", String(chapter));
      if (t) fd.append("text", t);
      if (file) fd.append("file", file);
      if (dur) fd.append("dur", String(dur));
      const r = await fetch("/api/messages", { method: "POST", body: fd });
      if (!r.ok) {
        const d = await r.json().catch(() => ({}));
        throw new Error(d.error || "No se pudo enviar.");
      }
      if (!ignoreText) setText("");
      stick.current = true;
      await load();
    } catch (e) {
      setError(e.message);
    }
    setBusy(false);
  }

  async function startRec() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream);
      chunks.current = [];
      mr.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      mr.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        const dur = Math.round((Date.now() - startedAt.current) / 1000);
        const type = (mr.mimeType || "audio/webm").split(";")[0];
        const blob = new Blob(chunks.current, { type });
        if (blob.size > 0 && dur >= 1) send(new File([blob], "audio", { type }), true, dur);
      };
      mr.start();
      startedAt.current = Date.now();
      recorder.current = mr;
      setRec(true);
      setSecs(0);
      timer.current = setInterval(() => setSecs((s) => s + 1), 1000);
    } catch (e) {
      setError("No pude acceder al micrófono. Revisa los permisos del navegador.");
    }
  }

  function stopRec() {
    recorder.current?.stop();
    clearInterval(timer.current);
    setRec(false);
  }

  const time = (d) => new Date(d).toLocaleTimeString("es", { hour: "2-digit", minute: "2-digit" });
  const mmss = `${Math.floor(secs / 60)}:${String(secs % 60).padStart(2, "0")}`;

  return (
    <div className="card relative flex h-full flex-col overflow-hidden">
      <style>{CSS}</style>

      {party && (
        <div
          onClick={() => setParty(null)}
          className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
          style={{ background: "color-mix(in srgb, var(--bg) 85%, transparent)", backdropFilter: "blur(3px)" }}
        >
          {Array.from({ length: 14 }, (_, i) => (
            <span
              key={i}
              className="pointer-events-none absolute bottom-10 text-2xl"
              style={{ left: `${(i * 15 + 5) % 92}%`, animation: `floatUp 2.8s ease-out ${i * 0.1}s both` }}
            >
              {["🔥", "✨", "🎉", "⭐"][i % 4]}
            </span>
          ))}
          <div style={{ animation: "celebrate .8s ease both" }}>
            <Flame size={130} a="#f97316" b="#fde047" id="flameParty" />
          </div>
          <p className="heading mt-3 text-3xl font-semibold" style={{ animation: "riseIn .6s ease .3s both" }}>¡Racha encendida!</p>
          <p className="mt-1 text-sm text-muted" style={{ animation: "riseIn .6s ease .5s both" }}>Llevan {party}</p>
        </div>
      )}

      <div className="relative min-h-0 flex-1" style={{ background: "color-mix(in srgb, var(--line) 25%, transparent)" }}>
        <div ref={box} onScroll={onScroll} className="h-full space-y-2.5 overflow-y-auto overscroll-contain p-4">
          {msgs.length === 0 && (
            <p className="pt-16 text-center text-sm text-muted">Aún no hay mensajes. Escribe lo primero que te llamó la atención.</p>
          )}
          {msgs.map((m, i) => {
            const showDay = i === 0 || dayOf(m.created_at) !== dayOf(msgs[i - 1].created_at);
            return (
              <div key={m.id}>
                {showDay && (
                  <div className="my-2 text-center">
                    <span className="rounded-full bg-surface px-3 py-1 text-[11px] font-medium text-muted shadow-sm">{dayLabel(m.created_at)}</span>
                  </div>
                )}
                {m.kind === "system" ? (
                  <div className="text-center">
                    <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">{m.body}</span>
                  </div>
                ) : m.kind === "streak" ? (
                  <div className="flex justify-center py-1" style={{ animation: "riseIn .6s ease both" }}>
                    <div
                      className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-soft"
                      style={{ background: "linear-gradient(135deg,#f97316,#ec4899)" }}
                    >
                      <Flame size={36} a="#ffffff" b="#fde68a" id={`fs${m.id}`} />
                      <span>{m.body.replace("🔥 ", "")}</span>
                    </div>
                  </div>
                ) : (
                  <div className={`flex ${m.mine ? "justify-end" : "justify-start"}`} style={{ animation: "riseIn .25s ease both" }}>
                    <div
                      className={`max-w-[82%] min-w-0 rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                        m.mine ? "rounded-br-md" : "rounded-bl-md border border-line bg-surface text-ink"
                      }`}
                      style={m.mine ? { background: "var(--mine-bg)", color: "var(--mine-ink)" } : undefined}
                    >
                      {!m.mine && <p className="mb-0.5 text-xs font-semibold text-accent">{m.name}</p>}
                      {m.kind === "image" && (
                        <a href={`/api/files/${m.file}`} target="_blank" rel="noreferrer">
                          <img src={`/api/files/${m.file}`} alt="Foto" className="mb-1 max-h-64 max-w-full rounded-xl" />
                        </a>
                      )}
                      {m.kind === "audio" && <AudioPlayer src={`/api/files/${m.file}`} seed={m.id} dur={m.dur || 0} mine={m.mine} />}
                      {m.body && <p className="whitespace-pre-wrap [overflow-wrap:anywhere]">{m.body}</p>}
                      <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] opacity-70">
                        <span>{time(m.created_at)}</span>
                        {m.mine &&
                          (m.id <= readUpTo ? (
                            <span key="r" style={{ color: "var(--tick)", opacity: 1, animation: "pop .35s ease" }}>
                              <CheckCheck size={15} />
                            </span>
                          ) : (
                            <Check size={15} style={{ opacity: 0.6 }} />
                          ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        {down && (
          <button
            onClick={goDown}
            aria-label="Ir al final"
            className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-surface text-muted shadow-soft"
            style={{ animation: "pop .25s ease" }}
          >
            <ArrowDown size={18} />
          </button>
        )}
      </div>

      {error && <p className="px-4 pb-2 pt-2 text-xs text-red-600">{error}</p>}

      <div className="flex shrink-0 items-end gap-2 border-t border-line bg-surface p-3">
        {rec ? (
          <>
            <span className="flex-1 pl-2 text-sm text-red-600">● Grabando {mmss}</span>
            <button onClick={stopRec} className="btn-primary" aria-label="Detener y enviar">
              <Square size={16} /> Enviar
            </button>
          </>
        ) : (
          <>
            <input
              ref={fileInput}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) send(f);
                e.target.value = "";
              }}
            />
            <button onClick={() => fileInput.current?.click()} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-line" aria-label="Enviar foto">
              <ImageIcon size={20} />
            </button>
            <textarea
              ref={ta}
              rows={1}
              className="input max-h-32 min-h-[2.75rem] min-w-0 flex-1 resize-none !rounded-2xl !py-2.5 leading-snug"
              placeholder="Escribe un mensaje…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={onKey}
            />
            {text.trim() ? (
              <button onClick={() => send()} disabled={busy} className="btn-primary !h-11 !w-11 shrink-0 !p-0" aria-label="Enviar">
                <Send size={18} />
              </button>
            ) : (
              <button onClick={startRec} disabled={busy} className="btn-primary !h-11 !w-11 shrink-0 !p-0" aria-label="Grabar audio">
                <Mic size={18} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}