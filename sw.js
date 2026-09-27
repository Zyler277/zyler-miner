const CACHE_NAME = "zyler-miner-v5";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",
  "./icon.png",
  "./icon-192.png"
];

// Kurulum
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_FILES);
    })
  );

  self.skipWaiting();
});

// Eski cache'leri temizle
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );

  self.clients.claim();
});

// İstekleri güvenli şekilde yönet
self.addEventListener("fetch", event => {

  // Sadece GET istekleri
  if (event.request.method !== "GET") {
    return;
  }

  // Sayfa/navigasyon isteği:
  // Önce internetten al, internet yoksa cache kullan.
  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          return response;
        })
        .catch(() => {
          return caches.match("./index.html");
        })
    );

    return;
  }

  // Diğer dosyalar
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request);
    })
  );
});
