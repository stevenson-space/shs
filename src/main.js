import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueHammer } from 'vue2-hammer';
import VueAnalytics from 'vue-analytics';

import router from 'src/js/router.js'
import store from 'src/store/index.js';
import App from 'src/App.vue';

// smooth scroll behavior polyfill (for safari)
if (!("scrollBehavior" in document.documentElement.style)) {
  import(/* webpackChunkName: "scroll-behavior-polyfill" */"scroll-behavior-polyfill");
}

// Unregister all service workers
if(window.navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
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
      }
    }
  }
});

// Any element can add the directive 'v-focus' to automatically gain focus when created
Vue.directive('focus', {
  // When the the element is inserted into the DOM
  inserted: function (el) {
    el.focus()
  }
})

new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store,
});