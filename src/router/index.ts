import { createRouter, createWebHistory, RouteRecordRaw, RouteComponent, RouteLocationNormalized, NavigationGuardNext } from 'vue-router';
import Home from '@/views/Home/Home.vue';
import store from '@/store';

const GpaCalculator:RouteComponent = () => import(/* webpackChunkName: "gpacalculator" */'@/views/GpaCalculator/GpaCalculator.vue');
const BellSchedules:RouteComponent = () => import(/* webpackChunkName: "bellschedules" */'@/views/Bell Schedules/BellSchedules.vue');
const Calendar:RouteComponent = () => import(/* webpackChunkName: "calendar" */'@/views/Calendar/Calendar.vue');
const Links:RouteComponent = () => import(/* webpackChunkName: "links" */'@/views/Links/Links.vue');
const Colors:RouteComponent = () => import(/* webpackChunkName: "colors" */'@/views/Colors/Colors.vue');
const Settings:RouteComponent = () => import(/* webpackChunkName: "settings" */'@/views/Settings/Settings.vue');
const Tools:RouteComponent = () => import(/* webpackChunkName: "tools" */'@/views/Tools/Tools.vue');
const Documents:RouteComponent = () => import(/* webpackChunkName: "documents" */'@/views/Documents/Documents.vue');
const AddSchedule:RouteComponent = () => import(/* webpackChunkName: "addschedule" */'@/views/Settings/Add Schedule/AddSchedule.vue');
const Login:RouteComponent = () => import(/* webpackChunkName: "login" */'@/views/Login/Login.vue');

type EditScheduleProps = {
  scheduleToEdit: string;
  mode: 'all' | 'edit';
};

type Position = { left: number; top: number };

const routes: Array<RouteRecordRaw> = [
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
    props: (route): EditScheduleProps => ({
      scheduleToEdit: typeof route.params.scheduleToEdit === 'string' ? route.params.scheduleToEdit : route.params.scheduleToEdit[0],
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

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition): Position {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0, left: 0 };
  },
});

// ensure any page with requiresAuth set to true will redirect through the login proxy component
router.beforeEach((to:RouteLocationNormalized, from:RouteLocationNormalized, next:NavigationGuardNext) => {
  // check if to requires auth
  if (to.matched.some((record) => record.meta && record.meta.requiresAuth)) {
    // check if we are already authenticated, and continue ahead if we are
    // if (store.getters.isAuthenticated) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      // if not, proxy this route through the login component
      // inform the login component where to go next
      next({ name: 'login', query: { to: to.path.replace('/', '') } });
    }
  } else {
    // otherwise, just continue through
    next();
  }
});

export default router;
