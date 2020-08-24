"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _Home = _interopRequireDefault(require("src/components/Home/Home.vue"));

var _store = _interopRequireDefault(require("../store"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// Dynamically import the following components so that they are not included in the main build
// file and are instead asynchrounously loaded when the user goes to the page (to reduce file size of build.js)
var GpaCalculator = function GpaCalculator() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/GpaCalculator/GpaCalculator.vue"));
  });
};

var BellSchedules = function BellSchedules() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Bell Schedules/BellSchedules.vue"));
  });
}; // eslint-disable-line max-len


var Calendar = function Calendar() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Calendar/Calendar.vue"));
  });
};

var Links = function Links() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Links/Links.vue"));
  });
};

var Colors = function Colors() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Colors/Colors.vue"));
  });
};

var Settings = function Settings() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Settings/Settings.vue"));
  });
};

var Tools = function Tools() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Tools/Tools.vue"));
  });
};

var Documents = function Documents() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Documents/Documents.vue"));
  });
};

var AddSchedule = function AddSchedule() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Settings/Add Schedule/AddSchedule.vue"));
  });
}; // eslint-disable-line max-len


var Login = function Login() {
  return Promise.resolve().then(function () {
    return _interopRequireWildcard(require("src/components/Login/Login.vue"));
  });
};

var routes = [{
  path: "/",
  component: _Home["default"]
}, {
  path: "/bellschedules",
  component: BellSchedules
}, {
  path: "/calendar",
  component: Calendar
}, {
  path: "/GpaCalculator",
  component: GpaCalculator
}, {
  path: "/links",
  component: Links
}, {
  path: "/colors",
  component: Colors
}, {
  path: "/settings",
  component: Settings
}, {
  path: "/add-schedule",
  component: AddSchedule
}, {
  name: "editSchedules",
  path: "/edit-schedule/:scheduleToEdit",
  component: AddSchedule,
  props: function props(route) {
    return {
      scheduleToEdit: route.params.scheduleToEdit,
      mode: "edit"
    };
  }
}, {
  name: "tools",
  path: "/tools",
  component: Tools
}, {
  name: "documents",
  path: "/documents",
  component: Documents,
  meta: {
    requiresAuth: true
  }
}, {
  name: "login",
  path: "/login",
  component: Login
}]; // 'history' mode requires all urls to redirect to index.html so that Vue can handle them

var router = new _vueRouter["default"]({
  mode: "history",
  routes: routes,
  // If savedPosition exists from previous visit to that page, then scroll to that position
  // Otherwise, scroll to top (basically how modern browsers normally handle scrolling)
  scrollBehavior: function scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }

    return {
      x: 0,
      y: 0
    };
  }
}); // ensure any page with requiresAuth set to true will redirect through the login proxy component

router.beforeEach(function (to, from, next) {
  // check if to requires auth
  if (to.matched.some(function (record) {
    return record.meta && record.meta.requiresAuth;
  })) {
    // check if we are already authenticated, and continue ahead if we are
    if (_store["default"].getters.isAuthenticated) {
      next();
    } // if not, proxy this route through the login component
    // inform the login component where to go next
    else next({
        name: "login",
        query: {
          to: to.name,
          from: from.name
        }
      });
  } // otherwise, just continue through
  else next();
});
var _default = router;
exports["default"] = _default;