const CACHE_NAME = 'yoombal-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/og-image.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

self.addEventListener('fetch', (event) => {
    // Offline-first strategy for defined assets
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Fallback or handle offline
            });
        })
    );
});
