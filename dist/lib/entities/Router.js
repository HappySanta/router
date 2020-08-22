"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Router = void 0;

var _Page = require("./Page");

var _History = require("./History");

var _Route = require("./Route");

var _tools = require("../tools");

var _State = require("./State");

var _tsee = require("tsee");

var _const = require("../const");

var _Location = require("./Location");

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Router = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Router, _EventEmitter);

  var _super = _createSuper(Router);

  /**
   *
   * ```javascript
   * export const PAGE_MAIN = '/';
   * export const PAGE_PERSIK = '/persik';
   * export const PANEL_MAIN = 'panel_main';
   * export const PANEL_PERSIK = 'panel_persik';
   * export const VIEW_MAIN = 'view_main';
   * const routes = {
   *   [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
   *   [PAGE_PERSIK]: new Page(PANEL_PERSIK, VIEW_MAIN),
   * };
   * export const router = new Router(routes);
   * router.start();
   * ```
   * @param routes
   * @param routerConfig
   */
  function Router(routes) {
    var _this;

    var routerConfig = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

    _classCallCheck(this, Router);

    _this = _super.call(this);

    _defineProperty(_assertThisInitialized(_this), "routes", {});

    _defineProperty(_assertThisInitialized(_this), "history", void 0);

    _defineProperty(_assertThisInitialized(_this), "enableLogging", false);

    _defineProperty(_assertThisInitialized(_this), "enableErrorThrowing", false);

    _defineProperty(_assertThisInitialized(_this), "defaultPage", _const.PAGE_MAIN);

    _defineProperty(_assertThisInitialized(_this), "defaultView", _const.VIEW_MAIN);

    _defineProperty(_assertThisInitialized(_this), "defaultPanel", _const.PANEL_MAIN);

    _defineProperty(_assertThisInitialized(_this), "alwaysStartWithSlash", true);

    _defineProperty(_assertThisInitialized(_this), "deferOnGoBack", null);

    _defineProperty(_assertThisInitialized(_this), "startHistoryOffset", 0);

    _defineProperty(_assertThisInitialized(_this), "started", false);

    _defineProperty(_assertThisInitialized(_this), "replacerUnknownRoute", function (r) {
      return r;
    });

    _defineProperty(_assertThisInitialized(_this), "onPopState", function () {
      if (_this.deferOnGoBack) {
        _this.log("onPopStateInDefer");

        _this.deferOnGoBack();

        _this.deferOnGoBack = null;
        return;
      }

      var nextRoute = _this.createRouteFromLocationWithReplace();

      var state = (0, _State.stateFromLocation)(_this.history.getCurrentIndex());

      if (state.blank === 1) {
        var _this2;

        state.index = _this.history.getCurrentIndex();
        state.history = [nextRoute.getPanelId()];

        _this.emit("enter", nextRoute, _this.history.getCurrentRoute());

        (_this2 = _this).emit.apply(_this2, ["update"].concat(_toConsumableArray(_this.history.push(nextRoute, state))));

        window.history.replaceState(state, "page=" + state.index, '#' + nextRoute.getLocation());
      } else {
        var _this3;

        (_this3 = _this).emit.apply(_this3, ["update"].concat(_toConsumableArray(_this.history.setCurrentIndex(state.index))));
      }

      _this.log("onPopState", [nextRoute, _this.history.getCurrentRoute(), state]);
    });

    _this.routes = routes;
    _this.history = new _History.History();

    if (routerConfig) {
      if (routerConfig.enableLogging !== undefined) {
        _this.enableLogging = routerConfig.enableLogging;
      }

      if (routerConfig.enableErrorThrowing !== undefined) {
        _this.enableErrorThrowing = routerConfig.enableErrorThrowing;
      }

      if (routerConfig.defaultPage !== undefined) {
        _this.defaultPage = routerConfig.defaultPage;
      }

      if (routerConfig.defaultView !== undefined) {
        _this.defaultView = routerConfig.defaultView;
      }

      if (routerConfig.defaultPanel !== undefined) {
        _this.defaultPanel = routerConfig.defaultPanel;
      }

      if (routerConfig.noSlash !== undefined) {
        _this.alwaysStartWithSlash = routerConfig.noSlash;
      }
    }

    return _this;
  }

  _createClass(Router, [{
    key: "start",
    value: function start() {
      if (this.started) {
        throw new Error("start method call twice! this is not allowed");
      }

      this.started = true;
      this.startHistoryOffset = window.history.length;
      var nextRoute = this.createRouteFromLocationWithReplace();
      var state = (0, _State.stateFromLocation)(this.history.getCurrentIndex());
      state.first = 1;

      if (state.blank === 1) {
        this.emit("enter", nextRoute, this.history.getCurrentRoute());
        state.history = [nextRoute.getPanelId()];
      }

      this.replace(state, nextRoute);
      window.removeEventListener("popstate", this.onPopState);
      window.addEventListener("popstate", this.onPopState);
    }
  }, {
    key: "stop",
    value: function stop() {
      window.removeEventListener("popstate", this.onPopState);
    }
  }, {
    key: "getCurrentRouteOrDef",
    value: function getCurrentRouteOrDef() {
      var r = this.history.getCurrentRoute();

      if (r) {
        return r;
      }

      return this.createRouteFromLocation(this.defaultPage);
    }
  }, {
    key: "getCurrentStateOrDef",
    value: function getCurrentStateOrDef() {
      var s = this.history.getCurrentState();

      if (s) {
        return _objectSpread({}, s);
      }

      return (0, _State.stateFromLocation)(this.history.getCurrentIndex());
    }
  }, {
    key: "isErrorThrowingEnabled",
    value: function isErrorThrowingEnabled() {
      return this.enableErrorThrowing;
    }
  }, {
    key: "log",
    value: function log() {
      if (!this.enableLogging) {
        return;
      }

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      console.log.apply(this, args);
    }
    /**
     * Добавляет новую страницу в историю
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */

  }, {
    key: "pushPage",
    value: function pushPage(pageId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.log("pushPage " + pageId, params);
      this.checkParams(params);
      var currentRoute = this.getCurrentRouteOrDef();

      var nextRoute = _Route.Route.fromPageId(this.routes, pageId, params);

      var s = _objectSpread({}, this.getCurrentStateOrDef());

      if (currentRoute.getViewId() === nextRoute.getViewId()) {
        s.history = s.history.concat([nextRoute.getPanelId()]);
      } else {
        s.history = [nextRoute.getPanelId()];
      }

      this.push(s, nextRoute);
    }
    /**
     * Заменяет текущую страницу на переданную
     * @param pageId страница указанная в конструкторе {@link Router.constructor}
     * @param params можно получить из {@link Location.getParams}
     */

  }, {
    key: "replacePage",
    value: function replacePage(pageId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.log("replacePage " + pageId, params);
      var currentRoute = this.getCurrentRouteOrDef();

      var nextRoute = _Route.Route.fromPageId(this.routes, pageId, params);

      var s = _objectSpread({}, this.getCurrentStateOrDef());

      if (currentRoute.getViewId() === nextRoute.getViewId()) {
        s.history = s.history.concat([]);
        s.history.pop();
        s.history.push(nextRoute.getPanelId());
      } else {
        s.history = [nextRoute.getPanelId()];
      }

      this.replace(s, nextRoute);
    }
  }, {
    key: "pushPageAfterPreviews",
    value: function pushPageAfterPreviews(prevPageId, pageId) {
      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var offset = this.getPageOffset(prevPageId) - 1;

      if (this.history.canJumpIntoOffset(offset)) {
        return this.popPageToAndPush(offset, pageId, params);
      } else {
        return this.popPageToAndPush(0, pageId, params);
      }
    }
  }, {
    key: "popPage",
    value: function popPage() {
      this.log("popPage");
      Router.back();
    }
  }, {
    key: "popPageTo",
    value: function popPageTo(x) {
      this.log("popPageTo", x);
      Router.backTo(x);
    }
  }, {
    key: "popPageToAndPush",
    value: function popPageToAndPush(x, pageId) {
      var _this4 = this;

      var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (x !== 0) {
        this.deferOnGoBack = function () {
          _this4.pushPage(pageId, params);
        };

        Router.backTo(x);
      } else {
        this.pushPage(pageId, params);
      }
    }
    /**
     *  История ломается когда открывается VKPay или пост из колокольчика
     */

  }, {
    key: "isHistoryBroken",
    value: function isHistoryBroken() {
      return window.history.length !== this.history.getLength() + this.startHistoryOffset;
    }
    /**
     * Способ починить историю браузера когда ее сломали снаружи из фрейма
     * напирмер перейдя по колокольчику или открыв вкпей
     */

  }, {
    key: "fixBrokenHistory",
    value: function fixBrokenHistory() {
      this.history.getHistoryFromStartToCurrent().forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            r = _ref2[0],
            s = _ref2[1];

        window.history.pushState(s, "page=" + s.index, '#' + r.getLocation());
      });
      this.startHistoryOffset = window.history.length - this.history.getLength();
    }
    /**
     * @param pageId
     * @return number на сколько страниц назад надо откатиться чтобы дойти до искомой страницы
     * если вернется - 0 то страница не найдена в истории
     */

  }, {
    key: "getPageOffset",
    value: function getPageOffset(pageId) {
      return this.history.getPageOffset(pageId);
    }
    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */

  }, {
    key: "pushModal",
    value: function pushModal(modalId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.checkParams(params);
      this.log("pushModal " + modalId, params);
      var currentRoute = this.getCurrentRouteOrDef();
      var nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
      this.push(this.getCurrentStateOrDef(), nextRoute);
    }
    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */

  }, {
    key: "pushPopup",
    value: function pushPopup(popupId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.checkParams(params);
      this.log("pushPopup " + popupId, params);
      var currentRoute = this.getCurrentRouteOrDef();
      var nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
      this.push(this.getCurrentStateOrDef(), nextRoute);
    }
    /**
     * @param modalId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */

  }, {
    key: "replaceModal",
    value: function replaceModal(modalId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.log("replaceModal " + modalId, params);
      var currentRoute = this.getCurrentRouteOrDef();
      var nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
      this.replace(this.getCurrentStateOrDef(), nextRoute);
    }
    /**
     * @param popupId
     * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
     */

  }, {
    key: "replacePopup",
    value: function replacePopup(popupId) {
      var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      this.log("replacePopup " + popupId, params);
      var currentRoute = this.getCurrentRouteOrDef();
      var nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
      this.replace(this.getCurrentStateOrDef(), nextRoute);
    }
  }, {
    key: "popPageIfModal",
    value: function popPageIfModal() {
      var currentRoute = this.getCurrentRouteOrDef();

      if (currentRoute.isModal()) {
        this.log("popPageIfModal");
        Router.back();
      }
    }
  }, {
    key: "popPageIfPopup",
    value: function popPageIfPopup() {
      var currentRoute = this.getCurrentRouteOrDef();

      if (currentRoute.isPopup()) {
        this.log("popPageIfPopup");
        Router.back();
      }
    }
    /**
     * @deprecated use popPageIfHasOverlay
     */

  }, {
    key: "popPageIfModalOrPopup",
    value: function popPageIfModalOrPopup() {
      var currentRoute = this.getCurrentRouteOrDef();

      if (currentRoute.isPopup() || currentRoute.isModal()) {
        this.log("popPageIfModalOrPopup");
        Router.back();
      }
    }
  }, {
    key: "popPageIfHasOverlay",
    value: function popPageIfHasOverlay() {
      var currentRoute = this.getCurrentRouteOrDef();

      if (currentRoute.hasOverlay()) {
        this.log("popPageIfHasOverlay");
        Router.back();
      }
    }
    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */

  }, {
    key: "onEnterPage",
    value: function onEnterPage(pageId, fn) {
      var _this5 = this;

      var _fn = function _fn(newRoute, oldRoute, isNewRoute, type) {
        if (newRoute.pageId === pageId) {
          if (!newRoute.hasOverlay()) {
            fn(newRoute, oldRoute, isNewRoute, type);
          }
        }
      };

      this.on("update", _fn);
      return function () {
        _this5.off("update", _fn);
      };
    }
    /**
     * @param pageId
     * @param fn
     * @return unsubscribe function
     */

  }, {
    key: "onLeavePage",
    value: function onLeavePage(pageId, fn) {
      var _this6 = this;

      var _fn = function _fn(newRoute, oldRoute, isNewRoute, type) {
        if (oldRoute && oldRoute.pageId === pageId) {
          if (!oldRoute.hasOverlay()) {
            fn(newRoute, oldRoute, isNewRoute, type);
          }
        }
      };

      this.on("update", _fn);
      return function () {
        _this6.off("update", _fn);
      };
    }
  }, {
    key: "getCurrentLocation",
    value: function getCurrentLocation() {
      return new _Location.Location(this.getCurrentRouteOrDef(), this.getCurrentStateOrDef());
    }
  }, {
    key: "checkParams",
    value: function checkParams(params) {
      if (params.hasOwnProperty(_Route.POPUP_KEY)) {
        if (this.isErrorThrowingEnabled()) {
          throw new Error("pushPage with key [".concat(_Route.POPUP_KEY, "]:").concat(params[_Route.POPUP_KEY], " is not allowed use another key"));
        }
      }

      if (params.hasOwnProperty(_Route.MODAL_KEY)) {
        if (this.isErrorThrowingEnabled()) {
          throw new Error("pushPage with key [".concat(_Route.MODAL_KEY, "]:").concat(params[_Route.MODAL_KEY], " is not allowed use another key"));
        }
      }
    }
  }, {
    key: "getDefaultRoute",
    value: function getDefaultRoute(location, params) {
      try {
        return _Route.Route.fromLocation(this.routes, "/", this.alwaysStartWithSlash);
      } catch (e) {
        if (e && e.message === 'ROUTE_NOT_FOUND') {
          return new _Route.Route(new _Page.Page(this.defaultPanel, this.defaultView), this.defaultPage, params);
        }

        throw e;
      }
    }
  }, {
    key: "replace",
    value: function replace(state, nextRoute) {
      state.length = window.history.length;
      state.index = this.history.getCurrentIndex();
      state.blank = 0;
      this.emit.apply(this, ["update"].concat(_toConsumableArray(this.history.replace(nextRoute, state))));
      window.history.replaceState(state, "page=" + state.index, '#' + nextRoute.getLocation());
      (0, _tools.preventBlinkingBySettingScrollRestoration)();
    }
  }, {
    key: "push",
    value: function push(state, nextRoute) {
      state.length = window.history.length;
      state.blank = 0;
      state.first = 0;
      this.emit.apply(this, ["update"].concat(_toConsumableArray(this.history.push(nextRoute, state))));
      state.index = this.history.getCurrentIndex();
      window.history.pushState(state, "page=" + state.index, '#' + nextRoute.getLocation());
      (0, _tools.preventBlinkingBySettingScrollRestoration)();
    }
  }, {
    key: "createRouteFromLocationWithReplace",
    value: function createRouteFromLocationWithReplace() {
      var location = window.location.hash;

      try {
        return _Route.Route.fromLocation(this.routes, location, this.alwaysStartWithSlash);
      } catch (e) {
        if (e && e.message === 'ROUTE_NOT_FOUND') {
          var def = this.getDefaultRoute(location, _Route.Route.getParamsFromPath(location));
          return this.replacerUnknownRoute(def, this.history.getCurrentRoute());
        }

        throw e;
      }
    }
  }, {
    key: "createRouteFromLocation",
    value: function createRouteFromLocation(location) {
      try {
        return _Route.Route.fromLocation(this.routes, location, this.alwaysStartWithSlash);
      } catch (e) {
        if (e && e.message === 'ROUTE_NOT_FOUND') {
          return this.getDefaultRoute(location, _Route.Route.getParamsFromPath(location));
        }

        throw e;
      }
    }
  }, {
    key: "afterUpdate",
    value: function afterUpdate() {
      var _this7 = this;

      return new Promise(function (resolve) {
        var fn = function fn() {
          resolve();

          _this7.off("update", fn);
        };

        _this7.on("update", fn);
      });
    }
  }], [{
    key: "back",
    value: function back() {
      window.history.back();
    }
  }, {
    key: "backTo",
    value: function backTo(x) {
      window.history.go(x);
    }
  }]);

  return Router;
}(_tsee.EventEmitter);

exports.Router = Router;