"use client";
import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";

function b64(s) {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

const same = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i]);

async function subscribe() {
  const reg = await navigator.serviceWorker.ready;
  const r = await fetch("/api/push/key", { cache: "no-store" });
  const { key } = await r.json();
  if (!key) throw new Error("Las notificaciones aún no están configuradas en el servidor.");
  const want = b64(key);

  let sub = await reg.pushManager.getSubscription();
  // Si la suscripción existente se creó con otras claves (por ejemplo, antes de la mudanza), se rehace.
  if (sub) {
    const cur = sub.options && sub.options.applicationServerKey ? new Uint8Array(sub.options.applicationServerKey) : null;
    if (!same(cur, want)) {
      await sub.unsubscribe().catch(() => {});
      sub = null;
    }
  }
  if (!sub) sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: want });

  const res = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
  if (!res.ok) throw new Error("No se pudo guardar la suscripción.");
}

export default function PushPrompt() {
  const [state, setState] = useState("loading");
  const [msg, setMsg] = useState("");
  const [ok, setOk] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const supported = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
    if (!supported) {
      const ios = /iphone|ipad/i.test(navigator.userAgent);
      const standalone = window.matchMedia("(display-mode: standalone)").matches || navigator.standalone;
      setState(ios && !standalone ? "ios" : "none");
      return;
    }
    if (Notification.permission === "granted") {
      subscribe().catch((e) => { setOk(false); setMsg(e.message); });
      setState("granted");
    } else if (Notification.permission === "denied") setState("denied");
    else setState("default");
  }, []);

  async function enable() {
    setBusy(true);
    setMsg("");
    try {
      const perm = await Notification.requestPermission();
      if (perm !== "granted") {
        setState(perm === "denied" ? "denied" : "default");
      } else {
        await subscribe();
        setState("granted");
      }
    } catch (e) {
      setOk(false);
      setMsg(e.message);
    }
    setBusy(false);
  }

  async function test() {
    setBusy(true);
    setMsg("");
    try {
      await subscribe();
      const r = await fetch("/api/push/test", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      setOk(r.ok);
      if (r.ok) {
        const p = d.partner;
        const extra = p
          ? p.subs > 0
            ? ` ${p.name} tiene ${p.subs} dispositivo(s) con avisos activos.`
            : ` Ojo: ${p.name} todavía no activó los avisos en su celular.`
          : "";
        setMsg("Enviada, debería llegarte en unos segundos." + extra);
      } else {
        setMsg((d.error || "No se pudo enviar.") + (d.partner && d.partner.subs === 0 ? ` Además, ${d.partner.name} no tiene avisos activos.` : ""));
      }
    } catch (e) {
      setOk(false);
      setMsg(e.message || "No se pudo enviar.");
    }
    setBusy(false);
  }

  if (state === "loading" || state === "none") return null;

  if (state === "granted") {
    return (
      <div className="rounded-xl2 border border-line px-4 py-2.5 text-sm">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-2 text-muted"><BellRing size={16} className="text-accent" /> Notificaciones activas</span>
          <button onClick={test} disabled={busy} className="text-xs font-medium text-brand underline">{busy ? "Enviando…" : "Enviar prueba"}</button>
        </div>
        {msg && <p className={`mt-2 text-xs ${ok ? "text-muted" : "text-red-600"}`}>{msg}</p>}
      </div>
    );
  }

  return (
    <div className="card p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-full p-2" style={{ background: "var(--line)" }}><Bell size={20} className="text-accent" /></div>
        <div className="flex-1">
          <p className="heading text-lg font-semibold">Activa las notificaciones</p>
          {state === "ios" ? (
            <p className="mt-1 text-sm text-muted">En iPhone, primero toca Compartir, luego «Añadir a pantalla de inicio», y abre Camino desde ese icono.</p>
          ) : state === "denied" ? (
            <p className="mt-1 text-sm text-muted">Las bloqueaste. Actívalas desde los ajustes del navegador o de la app para este sitio.</p>
          ) : (
            <>
              <p className="mt-1 text-sm text-muted">Para saber cuando tu pareja escribe o lee un capítulo, y para que no se les pase la racha.</p>
              <button onClick={enable} disabled={busy} className="btn-primary mt-3">Activar</button>
            </>
          )}
          {msg && <p className="mt-2 text-xs text-red-600">{msg}</p>}
        </div>
      </div>
    </div>
  );
}
