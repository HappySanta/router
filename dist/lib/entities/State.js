"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.__testResetHistoryUniqueId = __testResetHistoryUniqueId;
exports.stateFromLocation = stateFromLocation;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @ignore
 */
var randomIdForCheckState = Math.random() * 2000000 + "." + Date.now();
/**
 * Используется для тестов где не сбрасывается состояние jsdom
 * @ignore
 */

function __testResetHistoryUniqueId() {
  randomIdForCheckState = Math.random() * 2000000 + "." + Date.now();
}
/**
 * @ignore
 * @param currentIndex
 */


function stateFromLocation(currentIndex) {
  var state = window.history.state;

  if (state && _typeof(state) == "object") {
    var s = state;

    if (s.i === randomIdForCheckState) {
      return _objectSpread({}, s);
    }
  }

  return {
    blank: 1,
    first: 0,
    length: window.history.length,
    index: currentIndex,
    history: [],
    i: randomIdForCheckState,
    panelInView: {}
  };
}