/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
/* eslint-disable consistent-return */

self.addEventListener('install', () => {
  self.skipWaiting();
});

// Handle notification clicks (using a service worker because android requires use of service workers for notifications)
// Modified from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
self.addEventListener('notificationclick', (event) => {
  if (event.notification.tag === 'timer') {
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({ type: 'window' }).then((clientList) => {
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (new URL(client.url).pathname === '/tools' && 'focus' in client) {
          client.postMessage('stop-timer-done-audio');
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/tools');
    }));
  }
});
