self.addEventListener('install', () => {
  self.skipWaiting();
});

// Handle notification clicks (using a service worker because android requires use of service workers for notifications)
// Modified from https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
self.addEventListener('notificationclick', function(event) {
  if (event.notification.tag == 'timer') {
    event.notification.close();

    // This looks to see if the current is already open and focuses if it is
    event.waitUntil(clients.matchAll({ type: "window" }).then(function(clientList) {
      for (var i = 0; i < clientList.length; i++) {
        var client = clientList[i];
        if (new URL(client.url).pathname == '/tools' && 'focus' in client) {
          client.postMessage('stop-timer-done-audio');
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow('/tools');
    }));
  }
});