// Caches the app (and the icons folder) so it opens with no internet after the first visit.
// Change CACHE (e.g. v5) whenever you upload a new index.html or new icons.
const CACHE = 'street-counter-v4';
const FILES = ['./', './index.html', './manifest.json', ]
self.addEventListener('install', e => {
  // add files one by one so a missing icon never blocks the install
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request, {ignoreSearch: true}).then(hit => hit || fetch(e.request).then(res => {
    if (res.ok && new URL(e.request.url).origin === location.origin){ const copy = res.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); }
    return res;
  })));
});
