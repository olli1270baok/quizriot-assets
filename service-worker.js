// QuizRiot Arena - Service Worker for PWA
const CACHE_NAME = 'quizriot-v2.2.0-PUBLIC-SYNC'; // Bumped version
const RUNTIME_CACHE = 'quizriot-runtime-v3';

// 🚨 EMERGENCY MODE: DO NOT CACHE APP SHELL
// This ensures index.html is always fresh
const ESSENTIAL_CACHE = [
  '/manifest.json',
  '/icon.svg' 
];

// Install event - Force activation
self.addEventListener('install', (event) => {
  self.skipWaiting(); // 🚨 Force new SW to take control immediately
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ESSENTIAL_CACHE))
      .catch(err => console.error('[SW] Cache error:', err))
  );
});

// Activate event - NUCLEAR CACHE CLEAR
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .map((name) => {
               console.log('🚨 Deleting old cache:', name);
               return caches.delete(name);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control of all clients
  );
});

// Fetch event - NETWORK ONLY for HTML
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Always fetch HTML from network (bypass cache)
  if (request.headers.get('accept')?.includes('text/html')) {
     event.respondWith(
       fetch(request)
         .catch(() => caches.match('/offline.html'))
     );
     return;
  }
  
  // Standard Stale-While-Revalidate for others
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      const fetchPromise = fetch(request).then((networkResponse) => {
        caches.open(RUNTIME_CACHE).then((cache) => {
          try {
            cache.put(request, networkResponse.clone());
          } catch(e) {}
        });
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );
});
