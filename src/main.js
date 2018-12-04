import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueHammer } from 'vue2-hammer';
import VueAnalytics from 'vue-analytics';

import store from 'src/store/index.js';
import App from 'src/App.vue';
import Home from 'src/components/Home/Home.vue';

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of bundle.js)
const BellSchedules = () => import(/* webpackChunkName: "bellschedules" */ 'src/components/Bell Schedules/BellSchedules.vue');
const Calendar = () => import(/* webpackChunkName: "calendar" */ 'src/components/Calendar/Calendar.vue');
const Links = () => import(/* webpackChunkName: "links" */ 'src/components/Links/Links.vue');
const Colors = () => import(/* webpackChunkName: "colors" */ 'src/components/Colors/Colors.vue');

// Register service worker to enable offline viewing
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

function parseUrlDateTime(route) {
  // If date and/or time is specified in URL, return that date
  // Otherwise, return current date
  let { date='', time='' } = route.query;
  time = time.replace(/\./g, ':'); // lets you use "." (url safe) instead of ":" (not url safe)
  date = date.replace(/-/g, '/'); // lets you use "-" instead of "/"

  const today = new Date();
  const todayDate = today.toLocaleDateString();
  const todayTime = today.toLocaleTimeString();
  
  return new Date(`${date || todayDate} ${time || todayTime}`);
}

const routes = [
  {
    path: '/',
    component: Home,
    props: route => ({ initialDate: parseUrlDateTime(route).getTime() })
  },
  {
    path: '/bellschedules',
    component: BellSchedules
  },
  {
    path: '/calendar',
    component: Calendar,
    props: route => ({ today: parseUrlDateTime(route) })
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