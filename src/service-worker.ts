/// <reference lib="webworker" />
/* eslint-disable no-restricted-globals */

import { precacheAndRoute, cleanupOutdatedCaches, matchPrecache } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { CacheFirst, NetworkFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// navigation goes NetworkFirst so users see content updates as soon as cloudflare pages pushes a new build.
// if offline and the html-shell cache is empty, fall back to the precached index.html
const navigationStrategy = new NetworkFirst({
  cacheName: 'html-shell',
  networkTimeoutSeconds: 3,
  plugins: [
    new CacheableResponsePlugin({ statuses: [0, 200] }),
    {
      handlerDidError: async () => (await matchPrecache('/index.html')) || Response.error(),
    },
  ],
});

registerRoute(
  new NavigationRoute(navigationStrategy, {
    denylist: [/\.[a-zA-Z0-9]+$/, /^\/forms\.html/],
  }),
);

registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com'
    || url.origin === 'https://fonts.gstatic.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts' }),
);

// using CacheFirst so repeat plays don't invoke the Worker
registerRoute(
  ({ url, request }) => url.hostname === 'music-backend.stevenson-space.workers.dev'
    && request.method === 'GET',
  new CacheFirst({
    cacheName: 'jukebox-media',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200, 206] }),
      new ExpirationPlugin({
        maxEntries: 60,
        maxAgeSeconds: 15 * 24 * 60 * 60,
        purgeOnQuotaError: true,
      }),
    ],
  }),
);

registerRoute(
  ({ url }) => url.hostname === 'api.open-meteo.com',
  new StaleWhileRevalidate({ cacheName: 'weather' }),
);

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Handle notification clicks (using a service worker because android requires use of service workers for notifications)
// Modified from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
self.addEventListener('notificationclick', (event) => {
  if (event.notification.tag === 'timer') {
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(self.clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i += 1) {
        const client = clientList[i];
        if (new URL(client.url).pathname === '/tools' && 'focus' in client) {
          client.postMessage('stop-timer-done-audio');
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow('/tools');
      return undefined;
    }));
  }
});
