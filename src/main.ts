import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import * as Sentry from '@sentry/vue';
import VueGtag from 'vue-gtag';
import App from './App.vue';
import router from './router';

if (navigator.serviceWorker) {
  try {
    navigator.serviceWorker.register('/service-worker.js', {
      scope: '/',
      type: 'module',
    });
    // reload once a newly installed SW takes control
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
    // check for update what PWA returns to foreground
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        navigator.serviceWorker.getRegistration().then((reg) => reg?.update());
      }
    });
  } catch (e) {
    console.log(e);
  }
}

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(VueGtag, {
    config: { id: import.meta.env.PROD ? 'G-0MXBH7W5L0' : '' }, // disable GA during development
  })
  .use(createPinia());

Sentry.init({
  app,
  dsn: 'https://c669e2d7bb9c48c3a3ec84abce8830f0@o1226632.ingest.sentry.io/6372249',
  integrations: [
    Sentry.browserTracingIntegration({ router })
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.mount('#app');
