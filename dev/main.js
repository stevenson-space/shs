import Vue from 'vue';
import VueRouter from 'vue-router';
import { VueHammer } from 'vue2-hammer';
import App from './App.vue';
import Home from './pages/Home.vue';
import BellSchedules from './pages/BellSchedules.vue';
import Calendar from './pages/Calendar.vue';

const routes = [
  { path: '/', component: Home },
  { path: '/bellschedules', component: BellSchedules },
  { path: '/calendar', component: Calendar },
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

new Vue({
  el: '#app',
  render: h => h(App),
  router,
});