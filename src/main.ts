import { createApp } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueGtag from 'vue-gtag';
import App from './App.vue';
import router from './router';
import store from './store';

createApp(App).component('font-awesome-icon', FontAwesomeIcon)
  .use(store)
  .use(router)
  .use(VueGtag, {
    config: { id: 'G-0MXBH7W5L0' },
  })
  .mount('#app');
