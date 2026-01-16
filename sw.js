const CACHE_NAME = 'millionaire-math-v3';
const ASSETS = [
    './',
    './index.html',
    './style.css',
    './script.js',
    './images/logo.png',
    './images/icon-192.png',
    './sounds/intro.mp3',
    './sounds/correct.mp3',
    './sounds/wrong.mp3',
    './sounds/wait.mp3'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request))
    );
});
