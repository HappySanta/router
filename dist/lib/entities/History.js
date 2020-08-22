"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.History = exports.HISTORY_UPDATE_MOVE = exports.HISTORY_UPDATE_REPLACE = exports.HISTORY_UPDATE_PUSH = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @ignore
 */
var HISTORY_UPDATE_PUSH = "PUSH";
/**
 * @ignore
 */

exports.HISTORY_UPDATE_PUSH = HISTORY_UPDATE_PUSH;
var HISTORY_UPDATE_REPLACE = "REPLACE";
/**
 * @ignore
 */

exports.HISTORY_UPDATE_REPLACE = HISTORY_UPDATE_REPLACE;
var HISTORY_UPDATE_MOVE = "MOVE";
/**
 * @ignore
 */

exports.HISTORY_UPDATE_MOVE = HISTORY_UPDATE_MOVE;

/**
 * @ignore
 */
var History = /*#__PURE__*/function () {
  function History() {
    var _this = this;

    _classCallCheck(this, History);

    _defineProperty(this, "stack", []);

    _defineProperty(this, "currentIndex", 0);

    _defineProperty(this, "setLastPanelInView", function (next, prev) {
      var state = _this.getCurrentState();

      if (!state) return;
      state.panelInView = _objectSpread(_objectSpread({}, state.panelInView), {}, _defineProperty({}, next.getViewId(), next.getPanelId()));

      if (prev) {
        state.panelInView = _objectSpread(_objectSpread({}, state.panelInView), {}, _defineProperty({}, prev.getViewId(), prev.getPanelId()));
      }
    });
  }

  _createClass(History, [{
    key: "push",
    value: function push(r, s) {
      var current = this.getCurrentRoute();

      if (this.getCurrentIndex() !== this.getLength() - 1) {
        //Пуш после отката назад, в этом случае вся история "впереди удаляется"
        this.stack = this.stack.slice(0, this.getCurrentIndex() + 1);
      }

      this.stack.push([r, s]);
      this.currentIndex = this.stack.length - 1;
      var next = this.getCurrentRoute();
      current === null || current === void 0 ? void 0 : current.out();
      next === null || next === void 0 ? void 0 : next["in"]();

      if (next) {
        this.setLastPanelInView(next, current);
        return [next, current, true, HISTORY_UPDATE_PUSH];
      } else {
        // Если мы только что запушили новое состояние то оно никак не может оказаться пустым
        // если оказалос то что-то не так
        throw new Error("Impossible error on push state, next state is empty!");
      }
    }
  }, {
    key: "replace",
    value: function replace(r, s) {
      var current = this.getCurrentRoute();
      this.stack[this.currentIndex] = [r, s];
      var next = this.getCurrentRoute();
      current === null || current === void 0 ? void 0 : current.out();
      next === null || next === void 0 ? void 0 : next["in"]();

      if (next) {
        this.setLastPanelInView(next, current);
        return [next, current, true, HISTORY_UPDATE_REPLACE];
      } else {
        // Если мы только что заменили состояние то оно никак не может оказаться пустым
        // если оказалос то что-то не так
        throw new Error("Impossible error on replace state, next state is empty!");
      }
    }
  }, {
    key: "setCurrentIndex",
    value: function setCurrentIndex(x) {
      var current = this.getCurrentRoute();
      this.currentIndex = x;
      var next = this.getCurrentRoute();
      current === null || current === void 0 ? void 0 : current.out();
      next === null || next === void 0 ? void 0 : next["in"]();

      if (next) {
        this.setLastPanelInView(next, current);
        return [next, current, false, HISTORY_UPDATE_MOVE];
      } else {
        // Если мы только что заменили состояние то оно никак не может оказаться пустым
        // если оказалось то что-то не так
        throw new Error("Impossible error on push state, next state is empty!");
      }
    }
  }, {
    key: "move",
    value: function move(to) {
      this.currentIndex += to;
    }
  }, {
    key: "getLength",
    value: function getLength() {
      return this.stack.length;
    }
  }, {
    key: "getCurrentIndex",
    value: function getCurrentIndex() {
      return this.currentIndex;
    }
  }, {
    key: "getCurrentRoute",
    value: function getCurrentRoute() {
      return this.stack[this.currentIndex] ? this.stack[this.currentIndex][0] : undefined;
    }
  }, {
    key: "getCurrentState",
    value: function getCurrentState() {
      return this.stack[this.currentIndex] ? this.stack[this.currentIndex][1] : undefined;
    }
  }, {
    key: "canJumpIntoOffset",
    value: function canJumpIntoOffset(offset) {
      var index = this.currentIndex + offset;
      return index >= 0 && index <= this.getLength() - 1;
    }
  }, {
    key: "getPageOffset",
    value: function getPageOffset(pageId) {
      for (var i = this.currentIndex - 1; i >= 0; i--) {
        var route = this.stack[i][0];

        if (route.getPageId() === pageId) {
          //Страница совпадает но может быть ситуация когда поврех этой страницы попап или модалка
          //такое мы дожны пропустить нас попросили найти смещение до конкретной страницы
          if (!route.hasOverlay()) {
            return i - this.currentIndex;
          }
        }
      }

      return 0;
    }
  }, {
    key: "getFirstPageOffset",
    value: function getFirstPageOffset() {
      for (var i = this.currentIndex - 1; i >= 0; i--) {
        var route = this.stack[i][0];

        if (!route.hasOverlay()) {
          return i - this.currentIndex;
        }
      }

      return 0;
    }
  }, {
    key: "getHistoryFromStartToCurrent",
    value: function getHistoryFromStartToCurrent() {
      return this.stack.slice(0, this.currentIndex);
    }
  }]);

  return History;
}();

exports.History = History;