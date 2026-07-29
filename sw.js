const CACHE_NAME = 'detona-ralph-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/src/styles/reset.css',
    '/src/styles/main.css',
    '/src/scripts/main.js',
    '/src/scripts/game.js',
    '/src/scripts/ui.js',
    '/src/scripts/audio.js',
    '/src/scripts/storage.js',
    '/src/scripts/state.js',
    '/src/images/wall.png',
    '/src/images/ralph.png',
    '/src/images/player.png',
    '/src/images/favicon.jpg',
    '/src/audios/hit-8bit.wav',
    '/src/audios/combo.wav',
    '/src/audios/game-over.wav',
    '/src/audios/time-up.wav',
    '/src/audios/ui-click.wav',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(ASSETS))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        ).then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request)
            .then((cached) => cached || fetch(event.request))
            .catch(() => caches.match('/index.html'))
    );
});
