"use strict";

var _vue = _interopRequireDefault(require("vue"));

var _vueRouter = _interopRequireDefault(require("vue-router"));

var _vue2Hammer = require("vue2-hammer");

var _vueAnalytics = _interopRequireDefault(require("vue-analytics"));

var _router = _interopRequireDefault(require("src/js/router"));

var _index = _interopRequireDefault(require("src/store/index"));

var _App = _interopRequireDefault(require("src/App.vue"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// smooth scroll behavior polyfill (for safari)
if (!('scrollBehavior' in document.documentElement.style)) {
  Promise.resolve().then(function () {
    return _interopRequireWildcard(require('scroll-behavior-polyfill'));
  });
}

if (navigator.serviceWorker) {
  navigator.serviceWorker.register('service-worker.js');
}

_vue["default"].use(_vueRouter["default"]);

_vue["default"].use(_vue2Hammer.VueHammer);

_vue["default"].use(_vueAnalytics["default"], {
  id: 'UA-83979451-1',
  router: _router["default"],
  autoTracking: {
    pageviewTemplate: function pageviewTemplate($route) {
      // filter out any query strings before sending path to Google Analytics
      // ($route.path doesn't include query strings or hashes, $route.fullPath does)
      return {
        page: $route.path
      };
    }
  }
}); // Any element can add the directive 'v-focus' to automatically gain focus when created


_vue["default"].directive('focus', {
  // When the the element is inserted into the DOM
  inserted: function inserted(el) {
    el.focus();
  }
});
/* eslint-disable-next-line no-new */


new _vue["default"]({
  el: '#app',
  render: function render(h) {
    return h(_App["default"]);
  },
  router: _router["default"],
  store: _index["default"]
});