const CACHE_PREFIX = 'english-quest-';
const CACHE_NAME = CACHE_PREFIX + 'v2';

self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))
    );
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  if (request.method !== 'GET' || request.mode !== 'navigate' ||
      url.origin !== self.location.origin ||
      !url.href.startsWith(self.registration.scope)) return;

  // Always obtain current HTML online. Hashed JavaScript/CSS assets are
  // handled by the browser, never by an HTML fallback.
  event.respondWith((async () => {
    try {
      const response = await fetch(request, { cache: 'no-cache' });
      if (response.ok && response.headers.get('content-type')?.includes('text/html')) {
        try {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        } catch {
          // A cache quota or storage error must not prevent online startup.
        }
      }
      return response;
    } catch {
      try {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match(request);
        if (cached) return cached;
      } catch {
        // Storage may be unavailable.
      }
      return new Response('English Quest is offline. Reconnect and reload.', {
        status: 503,
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    }
  })());
});
