import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

// Nur GET requests für API cachen
const apiRoute = new Route(
  ({ url, request }) => {
    return url.pathname.startsWith('/api/eintraege') && request.method === 'GET';
  },
  new NetworkFirst({
    cacheName: 'oeztuerk-api-cache',
    plugins: [
      new CacheableResponsePlugin({
        statuses: [200],
      }),
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 5, // 5 Minuten
        maxEntries: 50,
      }),
    ],
  }),
);

// Bilder cachen
const imageLogRoute = new Route(
  ({ url }) => /\/assets\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i.test(url.pathname),
  new CacheFirst({
    cacheName: 'eintraege-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 Tage
        maxEntries: 100,
      }),
      new CacheableResponsePlugin({
        statuses: [200],
      }),
    ],
  }),
);

registerRoute(apiRoute);
registerRoute(imageLogRoute);

// Cache löschen bei mutations
self.addEventListener('message', async (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data?.type === 'CLEAR_API_CACHE') {
    const cache = await caches.open('oeztuerk-api-cache');
    const keys = await cache.keys();
    await Promise.all(keys.map((key) => cache.delete(key)));
    console.debug('API cache cleared');
  }
});

self.addEventListener('install', async () => {
  console.debug('SW install event');
  await caches.delete('oeztuerk-Eintraege');
  await caches.delete('oeztuerk-api-cache');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.debug('SW activate event, claiming control');
  event.waitUntil(self.clients.claim());
});

console.debug('SW loaded');
