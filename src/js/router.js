import VueRouter from 'vue-router';

import Home from 'src/components/Home/Home.vue';

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of build.js)
const BellSchedules = () => import(/* webpackChunkName: "bellschedules" */ 'src/components/Bell Schedules/BellSchedules.vue');
const Calendar = () => import(/* webpackChunkName: "calendar" */ 'src/components/Calendar/Calendar.vue');
const Links = () => import(/* webpackChunkName: "links" */ 'src/components/Links/Links.vue');
const Colors = () => import(/* webpackChunkName: "colors" */ 'src/components/Colors/Colors.vue');
const Settings = () => import(/* webpackChunkName: "settings" */ 'src/components/Settings/Settings.vue');

const AddSchedule = () => import(/* webpackChunkName: "addSchedule" */ 'src/components/Settings/AddSchedule.vue');

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
  },
  {
    path: '/settings',
    component: Settings,
  },
  {
    path: '/add-schedule',
    component: AddSchedule,
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

export default router;