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
  '/offline.html'
];

// Instalando o Service Worker e armazenando arquivos no cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativando o novo Service Worker e limpando caches antigos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Limpando cache antigo:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Interceptando as requisições
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        return response; // Se conseguir buscar da internet, usa normalmente
      })
      .catch(() => {
        return caches.match(event.request)
          .then(response => {
            return response || caches.match('/offline.html'); // Se não tiver nada, mostra o offline.html
          });
      })
  );
});
