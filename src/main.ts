import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import { BrowserTracing } from '@sentry/tracing';
import * as Sentry from '@sentry/vue';
import VueGtag from 'vue-gtag';
import App from './App.vue';
import router from './router';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-workers/service-worker.js');
}

const app = createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-0MXBH7W5L0' },
  })
  .use(createPinia());

Sentry.init({
  app,
  dsn: 'https://c669e2d7bb9c48c3a3ec84abce8830f0@o1226632.ingest.sentry.io/6372249',
  integrations: [
    new BrowserTracing({
      routingInstrumentation: Sentry.vueRouterInstrumentation(router),
      tracingOrigins: ['stevenson.space', /^\//],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
});

app.mount('#app');
