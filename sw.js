/* OP MCZ — funciona sem internet depois da primeira visita.
   Ao publicar uma versão nova, troque o número de VERSAO para o celular baixar os arquivos novos. */
var VERSAO = 'opmcz-2026-10-20l';
var ARQUIVOS = ['./', 'index.html', 'style.css', 'script.js', 'glossario.js', 'montserrat.woff2',
  'logo-op-mcz.svg', 'favicon.svg', 'apple-touch-icon.png', 'icone-192.png', 'icone-512.png'];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSAO).then(function (c) { return c.addAll(ARQUIVOS); }).then(function () { return self.skipWaiting(); }));
});
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (nomes) {
    return Promise.all(nomes.filter(function (n) { return n !== VERSAO; }).map(function (n) { return caches.delete(n); }));
  }).then(function () { return self.clients.claim(); }));
});
/* Página: tenta a internet primeiro (para pegar a versão mais nova); sem internet, usa a cópia guardada. */
self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(function (r) {
      var copia = r.clone(); caches.open(VERSAO).then(function (c) { c.put('index.html', copia); }); return r;
    }).catch(function () { return caches.match('index.html'); }));
    return;
  }
  /* Arquivos com ?v=... na frente: cada versão tem endereço próprio, então a cópia guardada vale até a próxima versão */
  e.respondWith(caches.match(req).then(function (guardado) {
    if (guardado) return guardado;
    return fetch(req).then(function (r) {
      if (r.ok) { var copia = r.clone(); caches.open(VERSAO).then(function (c) { c.put(req, copia); }); }
      return r;
    }).catch(function () { return caches.match(req, { ignoreSearch: true }); });
  }));
});
