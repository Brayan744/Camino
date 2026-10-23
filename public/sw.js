const CACHE = "camino-v4";

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const r = e.request;
  if (r.method !== "GET") return;
  const u = new URL(r.url);
  if (u.origin !== location.origin || !u.pathname.startsWith("/_next/static/")) return;
  e.respondWith(
    caches.match(r).then(
      (c) =>
        c ||
        fetch(r).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((ca) => ca.put(r, copy));
          return res;
        })
    )
  );
});

self.addEventListener("push", (e) => {
  let d = {};
  try { d = e.data.json(); } catch (err) {}
  e.waitUntil(
    (async () => {
      const list = await clients.matchAll({ type: "window", includeUncontrolled: true });
      const viewing = list.some((c) => {
        try { return c.visibilityState === "visible" && new URL(c.url).pathname === d.url; } catch (err) { return false; }
      });
      if (viewing && d.kind === "chat") return;
      await self.registration.showNotification(d.title || "Camino de la Palabra", {
        body: d.body || "",
        icon: "/icons/192",
        badge: "/icons/badge",
        tag: d.tag || undefined,
        renotify: !!d.tag,
        data: { url: (d.url || "/inicio") + (d.kind === "chat" ? "?tab=chat" : "") },
      });
    })()
  );
});

self.addEventListener("notificationclick", (e) => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || "/inicio";
  e.waitUntil(
    (async () => {
      const list = await clients.matchAll({ type: "window", includeUncontrolled: true });
      for (const c of list) {
        if ("focus" in c) {
          await c.focus();
          if ("navigate" in c) await c.navigate(url).catch(() => {});
          return;
        }
      }
      await clients.openWindow(url);
    })()
  );
});