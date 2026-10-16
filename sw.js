// CCL Service Worker — Offline Resilience & Rural Network Acceleration
const CACHE_NAME = 'ccl-v1-shell';
const PRECACHE_URLS = [
  './',
  './index.html',
  './assets/logos/british-council.svg',
  './assets/logos/british-council.png',
  './assets/logos/hsbc.svg',
  './assets/logos/hsbc.png',
  './assets/logos/university-of-bristol.svg',
  './assets/logos/university-of-bristol.png',
  './assets/logos/university-of-mumbai.svg',
  './assets/logos/university-of-mumbai.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('CCL SW: Partial precache failure', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // Exclude audio files from caching to save user data on mobile
  if (req.destination === 'audio' || url.pathname.endsWith('.m4a')) {
    return;
  }

  // Navigation requests (HTML pages): Network-first with immediate offline cache fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).catch(() => {
        return caches.match('./index.html') || caches.match('./');
      })
    );
    return;
  }

  // Static assets (logos, images, fonts): Cache-first with network fallback
  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && req.method === 'GET' && url.origin === self.location.origin) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return res;
      }).catch(() => {
        return cached;
      });
    })
  );
});
