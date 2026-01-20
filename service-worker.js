const CACHE_NAME = 'likra-app-cache-v2'; // altere de v1 para v2
const urlsToCache = [
  '/',
  '/index.html',
  '/emprestimos.html',
  '/fundoSoberano.html',
  '/style.css',
  '/script.js'
];

// INSTALAÇÃO DO SERVICE WORKER
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cache adicionado');
        return cache.addAll(urlsToCache);
      })
  );
});

// ATIVAÇÃO DO SERVICE WORKER
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Ativado');
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(
        keyList.map(key => {
          if(key !== CACHE_NAME){
            console.log('[ServiceWorker] Removendo cache antigo', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// INTERCEPTA REQUISIÇÕES
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se tiver no cache, retorna do cache, senão faz fetch
      return response || fetch(event.request);
    })
  );
});
