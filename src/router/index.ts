import { createRouter, createWebHistory, RouteRecordRaw, RouteComponent } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const GpaCalculator:RouteComponent = () => import(/* webpackChunkName: "gpacalculator" */'@/views/GpaCalculator/GpaCalculator.vue');
// const OldGpaCalculator = () => import(/* webpackChunkName: "gpacalculator" */'@/views/GpaCalculator/OldGpaCalculator.vue');
// const BellSchedules = () => import(/* webpackChunkName: "bellschedules" */'@/views/Bell Schedules/BellSchedules.vue');
// const Calendar = () => import(/* webpackChunkName: "calendar" */'@/views/Calendar/Calendar.vue');
const Links:RouteComponent = () => import(/* webpackChunkName: "links" */'@/views/Links/Links.vue');
// const Colors = () => import(/* webpackChunkName: "colors" */'@/views/Colors/Colors.vue');
// const Settings = () => import(/* webpackChunkName: "settings" */'@/views/Settings/Settings.vue');
const Tools:RouteComponent = () => import(/* webpackChunkName: "tools" */'@/views/Tools/Tools.vue');
// const Documents = () => import(/* webpackChunkName: "documents" */'@/views/Documents/Documents.vue');
// const AddSchedule = () => import(/* webpackChunkName: "addschedule" */'@/views/Settings/Add Schedule/AddSchedule.vue');
// const Login = () => import(/* webpackChunkName: "login" */'@/views/Login/Login.vue');

type EditScheduleProps = {
  scheduleToEdit: string;
  mode: 'all' | 'edit';
};

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: 'about' */ '../views/AboutView.vue'),
  },
  // {
  //   path: '/',
  //   component: Home,
  // },
  // {
  //   path: '/bellschedules',
  //   component: BellSchedules,
  // },
  // {
  //   path: '/calendar',
  //   component: Calendar,
  // },
  {
    path: '/GpaCalculator',
    component: GpaCalculator,
  },
  // { //remove - FIX
  //   path: '/OldGpaCalculator',
  //   component: OldGpaCalculator,
  // },
  {
    path: '/links',
    component: Links,
  },
  // {
  //   path: '/colors',
  //   component: Colors,
  // },
  // {
  //   path: '/settings',
  //   component: Settings,
  // },
  // {
  //   path: '/add-schedule',
  //   component: AddSchedule,
  // },
  // {
  //   name: 'editSchedules',
  //   path: '/edit-schedule/:scheduleToEdit',
  //   component: AddSchedule,
  //   props: (route): EditScheduleProps => ({
  //     scheduleToEdit: route.params.scheduleToEdit,
  //     mode: 'edit',
  //   }),
  // },
  {
    name: 'tools',
    path: '/tools',
    component: Tools,
  },
  // {
  //   name: 'documents',
  //   path: '/documents',
  //   component: Documents,
  //   meta: { requiresAuth: true },
  // },
  // {
  //   name: 'login',
  //   path: '/login',
  //   component: Login,
  // },

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
