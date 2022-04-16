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
    config: { id: 'UA-83979451-1' },
  })
  .mount('#app');
