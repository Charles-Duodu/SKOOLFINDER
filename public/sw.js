/**
 * SkoolFinder Ghana - Progressive Web App (PWA) Service Worker
 * Strategy: Stale-While-Revalidate for Static Assets, Network-First for Navigation & APIs
 */
const CACHE_NAME = 'skoolfinder-cache-v28';

// Critical core assets to precache during install for instant shell loading
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/style.css?v=28',
  '/css/components.css?v=28',
  '/js/api.js?v=28',
  '/js/state.js?v=28',
  '/js/components/navbar.js?v=28',
  '/js/components/footer.js?v=28',
  '/js/components/modals.js?v=28',
  '/js/components/chatbot.js?v=28',
  '/js/views/homeView.js?v=28',
  '/js/views/directoryView.js?v=28',
  '/js/app.js?v=28',
  '/assets/images/campus_hero.webp',
  '/assets/images/icon-192.png',
  '/assets/images/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('SW: Precache partial warning (continuing):', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('SW: Purging old cache version:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);

  // Skip non-GET requests (e.g. POST /api/leads, PUT, DELETE)
  if (request.method !== 'GET') {
    return;
  }

  // Skip backend API requests and non-HTTP protocols (e.g. chrome-extension://)
  if (url.pathname.startsWith('/api/') || !url.protocol.startsWith('http')) {
    return;
  }

  // For HTML navigation requests: Network-first, fall back to cached shell if offline
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => {
          return caches.match(request).then((cached) => cached || caches.match('/'));
        })
    );
    return;
  }

  // For static assets (CSS, JS, Fonts, Images, Leaflet CDN): Stale-While-Revalidate
  const isStaticAsset =
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.webp') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.woff2') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('unpkg.com');

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        }).catch(() => {
          // Offline fallback
        });

        // Return cached version immediately if present; fetch in background to refresh
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Default network-first with cache fallback
  event.respondWith(
    fetch(request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
        }
        return networkResponse;
      })
      .catch(() => caches.match(request))
  );
});
