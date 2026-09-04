const CACHE_NAME = "capacity-connect-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/login",
  "/manifest.json",
  "/globals.css",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Navigation / document requests: network first with cache fallback
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request) || caches.match("/");
      })
    );
    return;
  }

  // Static assets: cache first, then network
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).catch(() => {
        return new Response("Offline resource unavailable", { status: 503 });
      });
    })
  );
});
