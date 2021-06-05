import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home/Home.vue';

import store from '@/store';

Vue.use(VueRouter);

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of build.js)

const GpaCalculator = () => import(/* webpackChunkName: "gpacalculator" */'@/views/GpaCalculator/GpaCalculator.vue');
const BellSchedules = () => import(/* webpackChunkName: "bellschedules" */'@/views/Bell Schedules/BellSchedules.vue');
const Calendar = () => import(/* webpackChunkName: "calendar" */'@/views/Calendar/Calendar.vue');
const Links = () => import(/* webpackChunkName: "links" */'@/views/Links/Links.vue');
const Colors = () => import(/* webpackChunkName: "colors" */'@/views/Colors/Colors.vue');
const Settings = () => import(/* webpackChunkName: "settings" */'@/views/Settings/Settings.vue');
const Tools = () => import(/* webpackChunkName: "tools" */'@/views/Tools/Tools.vue');
const Documents = () => import(/* webpackChunkName: "documents" */'@/views/Documents/Documents.vue');
const AddSchedule = () => import(/* webpackChunkName: "addschedule" */'@/views/Settings/Add Schedule/AddSchedule.vue');
const Login = () => import(/* webpackChunkName: "login" */'@/views/Login/Login.vue');

const routes: RouteConfig[] = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/bellschedules',
    component: BellSchedules,
  },
  {
    path: '/calendar',
    component: Calendar,
  },
  {
    path: '/GpaCalculator',
    component: GpaCalculator,
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
  },
  {
    name: 'editSchedules',
    path: '/edit-schedule/:scheduleToEdit',
    component: AddSchedule,
    props: (route) => ({
      scheduleToEdit: route.params.scheduleToEdit,
      mode: 'edit',
    }),
  },
  {
    name: 'tools',
    path: '/tools',
    component: Tools,
  },
  {
    name: 'documents',
    path: '/documents',
    component: Documents,
    meta: { requiresAuth: true },
  },
  {
    name: 'login',
    path: '/login',
    component: Login,
  },
];

// 'history' mode requires all urls to redirect to index.html so that Vue can handle them
const router = new VueRouter({
  mode: 'history',
  routes,
  // If savedPosition exists from previous visit to that page, then scroll to that position
  // Otherwise, scroll to top (basically how modern browsers normally handle scrolling)
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { x: 0, y: 0 };
  },
});

// ensure any page with requiresAuth set to true will redirect through the login proxy component
router.beforeEach((to, from, next) => {
  // check if to requires auth
  if (to.matched.some((record) => record.meta && record.meta.requiresAuth)) {
    // check if we are already authenticated, and continue ahead if we are
    if (store.getters.isAuthenticated) {
      next();
    } else {
      // if not, proxy this route through the login component
      // inform the login component where to go next
      next({ name: 'login', query: { to: to.name, from: from.name } });
    }
  } else {
    // otherwise, just continue through
    next();
  }
});

export default router;
