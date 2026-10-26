/**
 * SchoolDirect - Progressive Web App (PWA) Service Worker
 */
const CACHE_NAME = 'schooldirect-v12';

self.addEventListener('install', (e) => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => caches.delete(k))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Always network-first: fetch freshest code from server, fallback to cache if offline
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
