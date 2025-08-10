const CACHE = 'bb-cache-v1';
const CORE = [
  '/', '/index.html', '/style.css', '/app.js', '/i18n.js',
  '/manifest.webmanifest', '/quiz.html', '/cognitief.html', '/taal.html', '/voortgang.html',
  '/flashcards.html', '/simulation.html', '/wrongs.html', '/content-admin.html', '/analytics.html'
];
const DATA = [
  '/data/languages.json', '/data/quiz_questions.json', '/data/woorden.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE.concat(DATA))));
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  if (url.origin === location.origin) {
    e.respondWith(
      caches.match(e.request).then(r => r || fetch(e.request).then(resp => {
        const copy = resp.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return resp;
      }))
    );
  }
});