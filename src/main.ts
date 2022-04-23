import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { createPinia } from 'pinia';
import VueGtag from 'vue-gtag';
import App from './App.vue';
import router from './router';

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('/service-workers/service-worker.js');
}

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-0MXBH7W5L0' },
  })
  .use(createPinia())
  .mount('#app');
