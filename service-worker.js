const CACHE_NAME = 'zero-time-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Installazione - cachea i file
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Attivazione - pulisce cache vecchie
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch - serve da cache o network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - ritorna risposta
        if (response) {
          return response;
        }
        // Altrimenti fetch da network
        return fetch(event.request);
      }
    )
  );
});
