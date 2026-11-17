/* Currículo Studio — PWA cache v1.
   Mantém a navegação online-first e um fallback offline para arquivos já visitados. */
const CACHE_NAME = "curriculo-studio-v1";
const APP_FILES = [
  "./", "./index.html", "./manifest.json",
  "./assets/css/styles.css", "./assets/js/app.js",
  "./assets/js/pwa-register.js",
  "./assets/icons/icon-192.png", "./assets/icons/icon-512.png",
  "./assets/icons/icon-maskable-512.png"
];
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Arquivos ausentes não impedem a instalação do worker.
      await Promise.all(APP_FILES.map(async (path) => {
        try {
          const response = await fetch(new Request(path, { cache: "reload" }));
          if (response.ok && response.type === "basic") await cache.put(path, response);
        } catch (error) { console.warn("PWA: arquivo indisponível", path, error); }
      }));
    })
  );
  self.skipWaiting();
});
self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter((key) => key.startsWith("curriculo-studio-") && key !== CACHE_NAME).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    try {
      const response = await fetch(request);
      if (response.ok && response.type === "basic") {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      const cached = await caches.match(request, { ignoreSearch: request.mode === "navigate" });
      if (cached) return cached;
      if (request.mode === "navigate") {
        const index = await caches.match(new URL("./index.html", self.registration.scope));
        if (index) return index;
      }
      return Response.error();
    }
  })());
});
