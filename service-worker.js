const CACHE = "chill-planet-v4";

const CORE_ASSETS = [
  "./",
  "./index.html",
  "./play.html",
  "./challenge.html",
  "./relax.html",
  "./results.html",
  "./create-card.html",
  "./sponsors.html",
  "./manifest.json",
  "./css/style.css",
  "./css/animations.css",
  "./js/storage.js",
  "./js/questions.js",
  "./js/navigation.js",
  "./js/play.js",
  "./js/relax.js",
  "./js/pwa.js",
  "./data/kamwenge-data.js",
  "./assets/icons/icon.svg"
];

self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(CORE_ASSETS))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys
          .filter(key => key !== CACHE)
          .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;

  if (request.method !== "GET") return;

  const url = new URL(request.url);

  // Never interfere with Firebase/CDN/API requests.
  if (url.origin !== self.location.origin) return;

  const destination = request.destination;
  const isFreshCodeOrPage =
    request.mode === "navigate" ||
    destination === "script" ||
    destination === "style" ||
    url.pathname.endsWith(".html") ||
    url.pathname.endsWith(".js") ||
    url.pathname.endsWith(".css");

  if (isFreshCodeOrPage) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(cacheFirst(request));
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE);

  try {
    const response = await fetch(request, { cache: "no-store" });

    if (response && response.ok) {
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;

    if (request.mode === "navigate") {
      return cache.match("./index.html");
    }

    throw error;
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);

  if (response && response.ok) {
    cache.put(request, response.clone());
  }

  return response;
}
