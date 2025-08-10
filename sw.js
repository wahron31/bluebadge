const CACHE = 'bb-cache-v2';
const CORE = [
  '/', '/index.html', '/style.css', '/app.js', '/i18n.js',
  '/manifest.webmanifest', '/quiz.html', '/cognitief.html', '/taal.html', '/voortgang.html',
  '/flashcards.html', '/simulation.html', '/wrongs.html', '/content-admin.html', '/analytics.html', '/cases.html', '/scenarios.html', '/gesprek.html'
];
const DATA = [
  '/data/languages.json', '/data/quiz_questions.json', '/data/woorden.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k=>k!==CACHE).map(k=> caches.delete(k)))).then(()=> self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin){
    // Data: network-first
    if (DATA.some(p=> url.pathname.endsWith(p))){
      e.respondWith(
        fetch(e.request).then(resp=>{ const copy=resp.clone(); caches.open(CACHE).then(c=> c.put(e.request, copy)); return resp; }).catch(()=> caches.match(e.request))
      );
      return;
    }
    // Core: cache-first
    e.respondWith(
      caches.match(e.request).then(r=> r || fetch(e.request).then(resp=>{ const copy=resp.clone(); caches.open(CACHE).then(c=> c.put(e.request, copy)); return resp; }))
    );
  }
});