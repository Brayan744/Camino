"use client";
import { useEffect, useRef, useState } from "react";
import { Send, Mic, Square, Image as ImageIcon, Check, CheckCheck } from "lucide-react";
import AudioPlayer from "./AudioPlayer";

export default function Chat({ book, chapter }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [rec, setRec] = useState(false);
  const [secs, setSecs] = useState(0);
  const [error, setError] = useState("");
  const [readUpTo, setReadUpTo] = useState(0);
  const lastId = useRef(0);
  const box = useRef(null);
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
        setMsgs((m) => {
          const ids = new Set(m.map((x) => x.id));
          return [...m, ...d.messages.filter((x) => !ids.has(x.id))];
        });
      }
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
    box.current?.scrollTo({ top: box.current.scrollHeight, behavior: "smooth" });
  }, [msgs.length]);

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
    <div className="card overflow-hidden">
      <div ref={box} className="h-[24rem] space-y-2.5 overflow-y-auto p-4" style={{ background: "color-mix(in srgb, var(--line) 25%, transparent)" }}>
        {msgs.length === 0 && (
          <p className="pt-16 text-center text-sm text-muted">Aún no hay mensajes. Escribe lo primero que te llamó la atención.</p>
        )}
        {msgs.map((m) =>
          m.kind === "system" ? (
            <div key={m.id} className="text-center">
              <span className="rounded-full border border-line bg-surface px-3 py-1 text-xs text-muted">{m.body}</span>
            </div>
          ) : (
            <div key={m.id} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-3.5 py-2 text-sm shadow-sm ${
                  m.mine ? "rounded-br-md bg-brand text-bg" : "rounded-bl-md border border-line bg-surface text-ink"
                }`}
              >
                {!m.mine && <p className="mb-0.5 text-xs font-semibold text-accent">{m.name}</p>}
                {m.kind === "image" && (
                  <a href={`/api/files/${m.file}`} target="_blank" rel="noreferrer">
                    <img src={`/api/files/${m.file}`} alt="Foto" className="mb-1 max-h-64 rounded-xl" />
                  </a>
                )}
                {m.kind === "audio" && <AudioPlayer src={`/api/files/${m.file}`} seed={m.id} dur={m.dur || 0} mine={m.mine} />}
                {m.body && <p className="whitespace-pre-wrap break-words">{m.body}</p>}
                <div className="mt-0.5 flex items-center justify-end gap-1 text-[10px] opacity-70">
                  <span>{time(m.created_at)}</span>
                  {m.mine && (m.id <= readUpTo ? <CheckCheck size={14} /> : <Check size={14} className="opacity-70" />)}
                </div>
              </div>
            </div>
          )
        )}
      </div>

      {error && <p className="px-4 pb-2 pt-2 text-xs text-red-600">{error}</p>}

      <div className="flex items-center gap-2 border-t border-line bg-surface p-3">
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
            <button onClick={() => fileInput.current?.click()} className="rounded-full p-2 text-muted hover:bg-line" aria-label="Enviar foto">
              <ImageIcon size={20} />
            </button>
            <input
              className="input !rounded-full !py-2.5"
              placeholder="Escribe un mensaje…"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), send())}
            />
            {text.trim() ? (
              <button onClick={() => send()} disabled={busy} className="btn-primary !px-3" aria-label="Enviar">
                <Send size={18} />
              </button>
            ) : (
              <button onClick={startRec} disabled={busy} className="btn-primary !px-3" aria-label="Grabar audio">
                <Mic size={18} />
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}