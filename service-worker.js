const CACHE_NAME = 'barbearia-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/about.html',
  '/menu.html',
  '/book.html',
  '/style.css',
  '/responsive.css',
  '/custom.js',
  '/bootstrap.css',
  '/font-awesome.min.css',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Instalação do Service Worker e cache dos arquivos
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Arquivos cacheados com sucesso!');
        return cache.addAll(urlsToCache);
      })
  );
});

// Ativação do Service Worker e atualização do cache
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Cache antigo removido:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Interceptação das requisições (modo offline)
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Se encontrar no cache, retorna do cache
        if (response) {
          return response;
        }
        // Senão, busca da internet
        return fetch(event.request);
      })
  );
});
