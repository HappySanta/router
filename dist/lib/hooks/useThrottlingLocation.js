"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useThrottlingLocation = useThrottlingLocation;

var _react = require("react");

var _useRouter = require("./useRouter");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Магическое число милисекунд после которого можно обновлять VKUI и он не зависнет
var UPDATE_INTERVAL = 900;

function useThrottlingLocation() {
  var router = (0, _useRouter.useRouter)(true);

  var _useState = (0, _react.useState)(router.getCurrentLocation()),
      _useState2 = _slicedToArray(_useState, 2),
      location = _useState2[0],
      setLocation = _useState2[1];

  var lastUpdateRouteAt = (0, _react.useRef)(0);
  var updateTimer = (0, _react.useRef)(0);
  var updateCallback = (0, _react.useRef)(null);
  (0, _react.useEffect)(function () {
    var fn = function fn() {
      var diff = Date.now() - lastUpdateRouteAt.current;

      if (diff > UPDATE_INTERVAL) {
        lastUpdateRouteAt.current = Date.now();
        setLocation(router.getCurrentLocation());
      } else {
        clearTimeout(updateTimer.current);

        updateCallback.current = function () {
          updateCallback.current = null;
          lastUpdateRouteAt.current = Date.now();
          setLocation(router.getCurrentLocation());
        };

        updateTimer.current = setTimeout(updateCallback.current, UPDATE_INTERVAL - diff);
      }
    };

    router.on("update", fn);
    return function () {
      router.off("update", fn);
    };
  }, []);
  var onTransitionEnd = (0, _react.useCallback)(function () {
    lastUpdateRouteAt.current = 0;

    if (updateCallback.current) {
      clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(updateCallback.current, 1);
    }
  }, []);
  return [location, onTransitionEnd];
}