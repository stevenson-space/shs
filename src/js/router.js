import VueRouter from 'vue-router';

import Home from 'src/components/Home/Home.vue';
import store from '../store';

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of build.js)
const BellSchedules = () => import(
	  /* webpackChunkName: "bellschedules" */ 'src/components/Bell Schedules/BellSchedules.vue',
); // eslint-disable-line max-len
const Calendar = () => import(
	  /* webpackChunkName: "calendar" */ 'src/components/Calendar/Calendar.vue',
);
const Links = () => import(/* webpackChunkName: "links" */ 'src/components/Links/Links.vue');
const Colors = () => import(/* webpackChunkName: "colors" */ 'src/components/Colors/Colors.vue');
const Settings = () => import(
	  /* webpackChunkName: "settings" */ 'src/components/Settings/Settings.vue',
);
const Tools = () => import(/* webpackChunkName: "tools" */ 'src/components/Tools/Tools.vue');
const Documents = () => import(
	  /* webpackChunkName: "tools" */ 'src/components/Documents/Documents.vue',
);
const AddSchedule = () => import(
	  /* webpackChunkName: "addSchedule" */ 'src/components/Settings/Add Schedule/AddSchedule.vue',
); // eslint-disable-line max-len
const Login = () => import(/* webpackChunkName: "tools" */ 'src/components/Login/Login.vue');
const routes = [
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
    props: route => ({
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
  if (to.matched.some(record => record.meta && record.meta.requiresAuth)) {
    // check if we are already authenticated, and continue ahead if we are
    if (store.getters.isAuthenticated) {
      next();
    }
    // if not, proxy this route through the login component
    // inform the login component where to go next
    else next({ name: 'login', query: { to: to.name, from: from.name } });
  }
  // otherwise, just continue through
  else next();
});

export default router;
