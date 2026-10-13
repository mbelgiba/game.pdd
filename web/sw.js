// Service worker: оболочка игры кэшируется для офлайн-запуска; API всегда идёт в сеть.
const V = 'pdd-v1', SHELL = ['./', 'index.html', 'style.css', 'config.js', 'data/events.js', 'data/models.js', 'src/game.js', 'src/handbook.js', 'src/cloud.js', 'manifest.webmanifest'];
self.addEventListener('install', e => e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())));
self.addEventListener('activate', e => e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== V).map(x => caches.delete(x)))).then(() => self.clients.claim())));
self.addEventListener('fetch', e => { const u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.pathname.startsWith('/api')) return;
  e.respondWith(caches.match(e.request).then(hit => { const net = fetch(e.request).then(r => { if (r.ok) caches.open(V).then(c => c.put(e.request, r.clone())); return r; }).catch(() => hit); return hit || net; })); });
