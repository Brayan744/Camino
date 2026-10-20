const CACHE = "camino-v1";
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