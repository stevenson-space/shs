import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueHammer } from 'vue2-hammer';
import VueAnalytics from 'vue-analytics';

import store from 'src/store/index.js';
import App from 'src/App.vue';
import Home from 'src/components/Home/Home.vue';

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of build.js)
const BellSchedules = () => import(/* webpackChunkName: "bellschedules" */ 'src/components/Bell Schedules/BellSchedules.vue');
const Calendar = () => import(/* webpackChunkName: "calendar" */ 'src/components/Calendar/Calendar.vue');
const Links = () => import(/* webpackChunkName: "links" */ 'src/components/Links/Links.vue');
const Colors = () => import(/* webpackChunkName: "colors" */ 'src/components/Colors/Colors.vue');

// Unregister all service workers
if(window.navigator && navigator.serviceWorker) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}

const routes = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/bellschedules',
    component: BellSchedules
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/links',
    component: Links,
  },
  {
    path: '/colors',
    component: Colors,
  }
];

// 'history' mode requires all urls to redirect to index.html so that Vue can handle them
const router = new VueRouter({
  mode: 'history',
  routes,
  // If savedPosition exists from previous visit to that page, then scroll to that position
  // Otherwise, scroll to top (basically how modern browsers normally handle scrolling)
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
});

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