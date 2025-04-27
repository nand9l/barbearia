
const CACHE_NAME = 'barbearia-cache-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/menu.html',
  '/book.html',
  '/css/style.css',
  '/css/bootstrap.css',
  '/css/responsive.css',
  '/css/font-awesome.min.css',
  '/js/custom.js',
  '/js/bootstrap.js',
  '/js/jquery-3.4.1.min.js',
  '/icons/106.png',
  '/icons/512.png',
  '/offline.html'  // nova página para quando estiver offline
];

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cacheando arquivos');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Ativando e limpando caches antigos...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Deletando cache antigo:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptando requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Responde com o cache
        }
        return fetch(event.request)
          .catch(() => caches.match('/offline.html')); // Se der erro (offline), mostra página offline
      })
  );
});
