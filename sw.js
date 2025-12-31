// 🚀 QuizRiot Arena - Service Worker
// Cache-First Strategy for optimal offline performance

const CACHE_NAME = 'quizriot-v1.0.99-FORCE-UPDATE';  // 🔥 EMERGENCY: FORCE CACHE CLEAR
const OFFLINE_PAGE = '/offline.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/offline.html',
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
  '/icon-512.png'
];

// Install event - pre-cache essential assets
self.addEventListener('install', event => {
  console.log('🔧 Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('📦 Service Worker: Pre-caching assets');
        return cache.addAll(PRECACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Activate immediately
  );
});

// Activate event - claim clients and cleanup old caches
self.addEventListener('activate', event => {
  console.log('✅ Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => {
              console.log('🗑️ Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => self.clients.claim()) // Take control immediately
  );
});

// Fetch event - Cache-First strategy with network fallback
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  // Skip chrome-extension and other non-http requests
  if (!event.request.url.startsWith('http')) return;
  
  // 🔥 EMERGENCY FIX: Network-First for HTML/JS to avoid cached old versions!
  const isHtmlOrJs = event.request.url.endsWith('.html') || 
                      event.request.url.endsWith('.js') || 
                      event.request.mode === 'navigate';
  
  if (isHtmlOrJs) {
    // NETWORK-FIRST for HTML/JS - always try to get fresh version
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Clone and cache the fresh response
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          return response;
        })
        .catch(() => {
          // Network failed - fallback to cache
          return caches.match(event.request)
            .then(cachedResponse => {
              return cachedResponse || caches.match(OFFLINE_PAGE);
            });
        })
    );
    return;
  }
  
  // CACHE-FIRST for images/assets (unchanged)
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          // Cache hit - return cached version
          return cachedResponse;
        }
        
        // Not in cache - fetch from network
        return fetch(event.request)
          .then(response => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response (can only be consumed once)
            const responseToCache = response.clone();
            
            // Cache successful responses
            caches.open(CACHE_NAME)
              .then(cache => {
                // Only cache same-origin requests
                if (event.request.url.startsWith(self.location.origin)) {
                  cache.put(event.request, responseToCache);
                }
              });
            
            return response;
          })
          .catch(() => {
            // Network failed - return offline page for navigation requests
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_PAGE);
            }
            
            // For other requests, just fail silently
            return new Response('Offline', { status: 503 });
          });
      })
  );
});

// Background sync (optional - for future features)
self.addEventListener('sync', event => {
  console.log('🔄 Service Worker: Background sync', event.tag);
  
  if (event.tag === 'sync-quiz-results') {
    event.waitUntil(syncQuizResults());
  }
});

async function syncQuizResults() {
  // Placeholder for future offline quiz sync
  console.log('📊 Syncing quiz results...');
}

// Push notification handler (optional - for future features)
self.addEventListener('push', event => {
  console.log('🔔 Service Worker: Push notification received');
  
  const options = {
    body: event.data ? event.data.text() : 'New quiz available!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('QuizRiot Arena', options)
  );
});

console.log('🎮 QuizRiot Arena Service Worker loaded!');
