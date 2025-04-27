const CACHE_NAME = "barbearia360-cache-v2";

const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/menu.html',
  '/book.html',
  '/css/style.css',
  '/css/bootstrap.css',
  '/css/font-awesome.min.css',
  '/css/responsive.css',
  '/js/bootstrap.js',
  '/js/custom.js',
  '/js/jquery-3.4.1.min.js',
  '/icons/196.png',
  '/icons/512.png',
  
];

// Instala o service worker e faz cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Abrindo cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativa o novo service worker e limpa caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: limpando cache antigo');
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Intercepta requisições e responde com cache ou faz o fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => caches.match('/offline.html'))
  );
});
