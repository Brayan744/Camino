"use client";
import { useEffect, useState } from "react";
import { Bell, BellRing } from "lucide-react";

function b64(s) {
  const pad = "=".repeat((4 - (s.length % 4)) % 4);
  const raw = atob((s + pad).replace(/-/g, "+").replace(/_/g, "/"));
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

async function subscribe() {
  const reg = await navigator.serviceWorker.ready;
  let sub = await reg.pushManager.getSubscription();
  if (!sub) {
    const r = await fetch("/api/push/key");
    const { key } = await r.json();
    if (!key) throw new Error("Las notificaciones aún no están configuradas en el servidor.");
    sub = await reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: b64(key) });
  }
  const r = await fetch("/api/push/subscribe", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sub),
  });
  if (!r.ok) throw new Error("No se pudo guardar la suscripción.");
}

export default function PushPrompt() {
  const [state, setState] = useState("loading");
  const [msg, setMsg] = useState("");
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
      subscribe().catch(() => {});
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
      setMsg(e.message);
    }
    setBusy(false);
  }

  async function test() {
    setBusy(true);
    setMsg("");
    try {
      const r = await fetch("/api/push/test", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      setMsg(r.ok ? "Enviada. Debería llegarte en unos segundos." : d.error || "No se pudo enviar.");
    } catch (e) {
      setMsg("No se pudo enviar.");
    }
    setBusy(false);
  }

  if (state === "loading" || state === "none") return null;

  if (state === "granted") {
    return (
      <div className="flex items-center justify-between rounded-xl2 border border-line px-4 py-2.5 text-sm">
        <span className="flex items-center gap-2 text-muted"><BellRing size={16} className="text-accent" /> Notificaciones activas</span>
        <button onClick={test} disabled={busy} className="text-xs font-medium text-brand underline">Enviar prueba</button>
        {msg && <span className="sr-only">{msg}</span>}
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
              <p className="mt-1 text-sm text-muted">Para saber cuando tu pareja escribe, y para que no se les pase la racha.</p>
              <button onClick={enable} disabled={busy} className="btn-primary mt-3">Activar</button>
            </>
          )}
          {msg && <p className="mt-2 text-xs text-red-600">{msg}</p>}
        </div>
      </div>
    </div>
  );
}