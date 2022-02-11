import Vue, { VNode } from 'vue';
import { VueHammer } from 'vue2-hammer';
import VueAnalytics, { InstallOptions } from 'vue-analytics';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.filter('capitalize', (str = ' ') => str.charAt(0).toUpperCase() + str.slice(1));

Vue.config.productionTip = false;

if (Date.now() < (new Date(2020, 11, 1)).getTime()) { // if before december 1, 2020
  // add the falling leaves animation
  import('./utils/leaves'); // eslint-disable-line no-unused-expressions
}

// smooth scroll behavior polyfill (for safari)
if (!('scrollBehavior' in document.documentElement.style)) {
  import('scroll-behavior-polyfill'); // eslint-disable-line no-unused-expressions
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js');
}

Vue.use(VueHammer);
Vue.use(VueAnalytics, {
  id: 'UA-83979451-1',
  router,
  autoTracking: {
    pageviewTemplate($route) {
      // filter out any query strings before sending path to Google Analytics
      // ($route.path doesn't include query strings or hashes, $route.fullPath does)
      return {
        page: $route.path,
      };
    },
  },
} as InstallOptions);

// Any element can add the directive 'v-focus' to automatically gain focus when created
Vue.directive('focus', {
  // When the the element is inserted into the DOM
  inserted(el) {
    el.focus();
  },
});

new Vue({
  router,
  store,
  render: (h): VNode => h(App),
}).$mount('#app');
