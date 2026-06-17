/* Code Mentor — Service Worker v4
   Full offline support: app shell, Pyodide CDN, fonts, local wheels */

const APP_CACHE     = 'code-mentor-app-v5';
const PYODIDE_CACHE = 'pyodide-cdn-v3';
const FONT_CACHE    = 'fonts-v2';

const PYODIDE_ORIGINS = [
  'cdn.jsdelivr.net',
  'files.pythonhosted.org',
  'pypi.org',
  'pyodide.org',
];

const APP_SHELL = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/wheels/flask-3.0.3-py3-none-any.whl',
  '/wheels/werkzeug-3.0.3-py3-none-any.whl',
  '/wheels/jinja2-3.1.4-py3-none-any.whl',
  '/wheels/click-8.1.7-py3-none-any.whl',
  '/wheels/itsdangerous-2.2.0-py3-none-any.whl',
  '/wheels/blinker-1.8.2-py3-none-any.whl',
];

// ── Install ─────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(APP_CACHE).then((cache) =>
      // Try to cache app shell; ignore individual failures (wheels may be large)
      Promise.allSettled(APP_SHELL.map((url) =>
        cache.add(url).catch(() => {})
      ))
    )
  );
});

// ── Activate: purge old caches ───────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const KEEP = new Set([APP_CACHE, PYODIDE_CACHE, FONT_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys.filter((k) => !KEEP.has(k)).map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: route by origin ───────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET') return;
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return;
  // Don't intercept HMR / websockets
  if (request.headers.get('upgrade') === 'websocket') return;
  // Don't intercept Vite HMR
  if (url.pathname.startsWith('/@') || url.pathname.startsWith('/node_modules')) return;

  // Pyodide CDN → cache-first (large binaries, immutable for a version)
  if (PYODIDE_ORIGINS.some((o) => url.hostname.includes(o))) {
    event.respondWith(cacheFirst(request, PYODIDE_CACHE));
    return;
  }

  // Fonts → cache-first
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(cacheFirst(request, FONT_CACHE));
    return;
  }

  // Same-origin app assets → stale-while-revalidate
  if (url.origin === self.location.origin) {
    // Navigation requests: always try network, fall back to cached /index.html (SPA)
    if (request.mode === 'navigate') {
      event.respondWith(
        fetch(request)
          .catch(() => caches.match('/index.html').then((r) => r || offlineResponse()))
      );
      return;
    }
    event.respondWith(staleWhileRevalidate(request, APP_CACHE));
    return;
  }
});

// ── Messages from UI ─────────────────────────────────────────────────────────
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (event.data.type === 'GET_CACHE_SIZE') {
    countCachedResources().then((info) => event.ports[0]?.postMessage(info));
    return;
  }

  if (event.data.type === 'CACHE_URLS') {
    const urls = (event.data.urls || []).filter(Boolean);
    caches.open(PYODIDE_CACHE).then((cache) =>
      Promise.allSettled(
        urls.map((url) =>
          fetch(url, { mode: 'cors', credentials: 'omit' })
            .then((r) => { if (r && r.ok) cache.put(url, r); })
            .catch(() => {})
        )
      )
    ).then(() => event.ports[0]?.postMessage({ done: true }));
    return;
  }
});

// ── Strategies ───────────────────────────────────────────────────────────────
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  try {
    const fresh = await fetch(request, { credentials: 'omit' });
    if (fresh && fresh.ok && fresh.status !== 206) {
      cache.put(request, fresh.clone()).catch(() => {});
    }
    return fresh;
  } catch {
    return offlineResponse();
  }
}

async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((fresh) => {
      if (fresh && fresh.ok) cache.put(request, fresh.clone()).catch(() => {});
      return fresh;
    })
    .catch(() => null);
  return cached || (await networkPromise) || offlineResponse();
}

function offlineResponse() {
  return new Response(
    '{"error":"offline","message":"Ресурс недоступен офлайн. Подключитесь к интернету и обновите страницу."}',
    { status: 503, headers: { 'Content-Type': 'application/json; charset=utf-8' } }
  );
}

async function countCachedResources() {
  const [app, pyodide, fonts] = await Promise.all([
    caches.open(APP_CACHE).then((c) => c.keys().then((k) => k.length)),
    caches.open(PYODIDE_CACHE).then((c) => c.keys().then((k) => k.length)),
    caches.open(FONT_CACHE).then((c) => c.keys().then((k) => k.length)),
  ]);
  return { app, pyodide, fonts, total: app + pyodide + fonts };
}
