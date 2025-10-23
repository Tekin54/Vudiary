import { precacheAndRoute, createHandlerBoundToURL } from 'workbox-precaching';
import { registerRoute, NavigationRoute, Route } from 'workbox-routing';
import { NetworkFirst, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

precacheAndRoute(self.__WB_MANIFEST);

registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')));

const eintraegeLogRoute = new Route(
  ({ url }) => url.pathname === '/eintraege',
  new NetworkFirst({
    cacheName: 'oeztuerk-Eintraege',

    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);
const imageLogRoute = new Route(
  () => /\*\/assets\/.*\.*$/,
  new CacheFirst({
    cacheName: 'eintraege-images',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 60 * 24 * 1,
      }),
    ],
    cacheableResponse: {
      statuses: [0, 200],
    },
  }),
);

registerRoute(eintraegeLogRoute);
registerRoute(imageLogRoute);

self.addEventListener('message', (event) => {
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
});

console.debug('SW loaded');

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('install', () => {
  console.debug('SW install event');
  caches.delete('oeztuerk-Eintraege');
});

self.addEventListener('activate', () => {
  console.debug('SW activate event, claiming control');
  return self.clients.claim();
});
