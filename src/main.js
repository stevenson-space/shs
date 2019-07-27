import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueHammer } from 'vue2-hammer';
import VueAnalytics from 'vue-analytics';

import router from 'src/js/router';
import store from 'src/store/index';
import App from 'src/App.vue';

// smooth scroll behavior polyfill (for safari)
if (!('scrollBehavior' in document.documentElement.style)) {
  import(/* webpackChunkName: "scroll-behavior-polyfill" */'scroll-behavior-polyfill');
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js');
}

Vue.use(VueRouter);
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
});

// Any element can add the directive 'v-focus' to automatically gain focus when created
Vue.directive('focus', {
  // When the the element is inserted into the DOM
  inserted(el) {
    el.focus();
  },
});

/* eslint-disable-next-line no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});
