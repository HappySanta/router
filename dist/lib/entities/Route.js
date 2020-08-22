"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = exports.MODAL_KEY = exports.POPUP_KEY = void 0;

var _workWithPathRegexp = require("../workWithPathRegexp");

var qs = _interopRequireWildcard(require("querystring"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @ignore
 */
var POPUP_KEY = 'p';
/**
 * @ignore
 */

exports.POPUP_KEY = POPUP_KEY;
var MODAL_KEY = 'm';
exports.MODAL_KEY = MODAL_KEY;
var routeUniqueId = 1;

function getNextUniqId() {
  return routeUniqueId++;
}

var Route = /*#__PURE__*/function () {
  /**
   * @type {Page}
   */
  function Route(structure, pageId, params) {
    _classCallCheck(this, Route);

    _defineProperty(this, "structure", void 0);

    _defineProperty(this, "pageId", void 0);

    _defineProperty(this, "params", {});

    _defineProperty(this, "uniqId", void 0);

    this.structure = structure;
    this.pageId = pageId;
    this.params = params;
    this.uniqId = getNextUniqId();
  }

  _createClass(Route, [{
    key: "clone",
    value: function clone() {
      var copy = new Route(this.structure.clone(), this.pageId, _objectSpread({}, this.params));
      copy.uniqId = this.uniqId;
      return copy;
    }
  }, {
    key: "getLocation",
    value: function getLocation() {
      return (0, _workWithPathRegexp.generatePath)(this.pageId, this.params);
    }
  }, {
    key: "getPageId",
    value: function getPageId() {
      return this.pageId;
    }
  }, {
    key: "getPanelId",
    value: function getPanelId() {
      if (this.structure.isInfinityPanel) {
        return "_" + this.structure.panelId + '..' + this.uniqId;
      }

      return this.structure.panelId;
    }
  }, {
    key: "getPanelIdWithoutInfinity",
    value: function getPanelIdWithoutInfinity() {
      return this.structure.panelId;
    }
  }, {
    key: "getViewId",
    value: function getViewId() {
      return this.structure.viewId;
    }
  }, {
    key: "getParams",
    value: function getParams() {
      return this.params;
    }
  }, {
    key: "setParams",
    value: function setParams() {
      var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      this.params = _objectSpread(_objectSpread({}, this.params), params);
      return this;
    }
  }, {
    key: "isPopup",
    value: function isPopup() {
      return !!this.getPopupId();
    }
  }, {
    key: "getPopupId",
    value: function getPopupId() {
      var _this$params$POPUP_KE;

      return ((_this$params$POPUP_KE = this.params[POPUP_KEY]) === null || _this$params$POPUP_KE === void 0 ? void 0 : _this$params$POPUP_KE.toString()) || null;
    }
  }, {
    key: "setPopupId",
    value: function setPopupId(popupId) {
      this.params[POPUP_KEY] = popupId;
      return this;
    }
  }, {
    key: "isModal",
    value: function isModal() {
      return !!this.getModalId();
    }
  }, {
    key: "hasOverlay",
    value: function hasOverlay() {
      return this.isModal() || this.isPopup();
    }
  }, {
    key: "getModalId",
    value: function getModalId() {
      var _this$params$MODAL_KE;

      return ((_this$params$MODAL_KE = this.params[MODAL_KEY]) === null || _this$params$MODAL_KE === void 0 ? void 0 : _this$params$MODAL_KE.toString()) || null;
    }
  }, {
    key: "setModalId",
    value: function setModalId(modalId) {
      this.params[MODAL_KEY] = modalId;
      return this;
    }
  }, {
    key: "out",
    value: function out() {}
  }, {
    key: "in",
    value: function _in() {}
  }], [{
    key: "getParamsFromPath",
    value: function getParamsFromPath(location) {
      return location.indexOf('?') !== -1 ? qs.parse(location.split('?', 2)[1]) : {};
    }
    /**
     * @param {RouteList} routeList
     * @param location "info?w=about&show=1" то, что лежит в window.location.hash
     * @param noSlash
     */

  }, {
    key: "fromLocation",
    value: function fromLocation(routeList, location) {
      var noSlash = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
      var params = Route.getParamsFromPath(location);
      location = location.replace("#", '');

      if (noSlash && location.length && location[0] !== '/') {
        location = '/' + location;
      }

      if (noSlash && !location.length) {
        location = '/' + location;
      }

      location = location.split("?", 2).shift() || (noSlash ? "/" : "");
      var match = null;

      for (var pageId in routeList) {
        if (routeList.hasOwnProperty(pageId)) {
          match = (0, _workWithPathRegexp.matchPath)(location, pageId);

          if (match && match.isExact) {
            break;
          }
        }
      }

      if (!match) {
        throw new Error("ROUTE_NOT_FOUND");
      }

      var ps = routeList[match.path];

      if (!ps) {
        throw new Error("Router fail: cant find structure in routes for " + location);
      }

      return new Route(ps, match.path, _objectSpread(_objectSpread({}, params), match.params));
    }
  }, {
    key: "fromPageId",
    value: function fromPageId(routeList, pageId, params) {
      var ps = routeList[pageId];

      if (!ps) {
        throw new Error("Router fail: cant find structure in routes for " + pageId);
      }

      return new Route(ps, pageId, params || {});
    }
  }]);

  return Route;
}();

exports.Route = Route;