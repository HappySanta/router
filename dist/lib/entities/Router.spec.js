"use strict";

var _Router = require("./Router");

var _Page = require("./Page");

var _methods = require("../methods");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function delay() {
  var time = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 100;
  return new Promise(function (resolve) {
    return setTimeout(resolve, time);
  });
}

test('route basic usage', /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(done) {
    var r, recordEvents;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
            r = new _Router.Router({
              "/": new _Page.Page(),
              "/user": new _Page.Page("user"),
              "/info": new _Page.Page("info")
            }, null);
            recordEvents = [];
            r.on("update", function (newRoute, oldRoute, isNewRoute, type) {
              recordEvents.push({
                newRoute: newRoute,
                oldRoute: oldRoute,
                isNewRoute: isNewRoute,
                type: type
              });
            });
            r.start();
            r.pushPage("/user");
            _context.next = 8;
            return delay(10);

          case 8:
            r.pushPage("/info");
            _context.next = 11;
            return delay(10);

          case 11:
            r.popPage();
            _context.next = 14;
            return delay(10);

          case 14:
            r.replacePage("/info");
            _context.next = 17;
            return delay(10);

          case 17:
            setTimeout(function () {
              // одно событие update приходит после старта роутера
              expect(recordEvents.length).toBe(4 + 1);
              expect(recordEvents[0].isNewRoute).toBeTruthy();
              expect(recordEvents[1].isNewRoute).toBeTruthy();
              expect(recordEvents[2].isNewRoute).toBeTruthy();
              expect(recordEvents[3].isNewRoute).toBeFalsy();
              expect(recordEvents[4].isNewRoute).toBeTruthy();
              done();
              r.stop();
            }, 10);

          case 18:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
test('route first page push', /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(done) {
    var r;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
            r = new _Router.Router({
              "/": new _Page.Page(),
              "/user": new _Page.Page("user"),
              "/info": new _Page.Page("info")
            }, null);
            r.start();
            _context2.next = 5;
            return delay(100);

          case 5:
            expect(r.getCurrentLocation().isFirstPage()).toBe(true); // После старта страница всегда first

            r.pushPage("/info");
            _context2.next = 9;
            return delay(100);

          case 9:
            expect(r.getCurrentLocation().isFirstPage()).toBe(false); // После push страница всегда не будет first

            r.popPage();
            _context2.next = 13;
            return delay(100);

          case 13:
            expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Вернулись назад на первую страницу, она была и осталась first

            r.stop();
            done();

          case 16:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  return function (_x2) {
    return _ref2.apply(this, arguments);
  };
}());
test('route first page replace', /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(done) {
    var r;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
            r = new _Router.Router({
              "/": new _Page.Page(),
              "/user": new _Page.Page("user"),
              "/info": new _Page.Page("info")
            }, null);
            r.start();
            _context3.next = 5;
            return delay(100);

          case 5:
            expect(r.getCurrentLocation().isFirstPage()).toBe(true); // После старта страница всегда first

            r.replacePage("/info");
            _context3.next = 9;
            return delay(100);

          case 9:
            expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Мы заменили first страницу на какую-то другу, она осталась first

            r.pushPage("/user");
            _context3.next = 13;
            return delay(100);

          case 13:
            expect(r.getCurrentLocation().isFirstPage()).toBe(false); // Был push страница уже не first

            r.popPage();
            _context3.next = 17;
            return delay(100);

          case 17:
            expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Вернулись обратно на first страницу

            r.stop();
            done();

          case 20:
          case "end":
            return _context3.stop();
        }
      }
    }, _callee3);
  }));

  return function (_x3) {
    return _ref3.apply(this, arguments);
  };
}());
test("check history", /*#__PURE__*/function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(done) {
    var r;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
            r = new _Router.Router({
              "/": new _Page.Page("main", "main"),
              "/user": new _Page.Page("user", "main"),
              "/info": new _Page.Page("info", "main"),
              "/create": new _Page.Page("create", "create"),
              "/done": new _Page.Page("done", "create")
            }, null);
            r.start();
            expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main"]);
            expect(r.getCurrentLocation().getPanelId()).toBe("main");
            expect(r.getCurrentLocation().getViewId()).toBe("main");
            r.pushPage("/user");
            expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main", "user"]);
            expect(r.getCurrentLocation().getPanelId()).toBe("user");
            expect(r.getCurrentLocation().getViewId()).toBe("main");
            r.pushPage("/info");
            expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main", "user", "info"]);
            expect(r.getCurrentLocation().getPanelId()).toBe("info");
            expect(r.getCurrentLocation().getViewId()).toBe("main");
            r.pushPage("/create");
            expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["info"]);
            expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create"]);
            expect(r.getCurrentLocation().getPanelId()).toBe("create");
            expect(r.getCurrentLocation().getViewId()).toBe("create");
            r.pushPage("/done");
            expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create", "done"]);
            expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["info"]);
            expect(r.getCurrentLocation().getPanelId()).toBe("done");
            expect(r.getCurrentLocation().getViewId()).toBe("create");
            expect(r.getCurrentLocation().getLastPanelInView("main")).toBe("info");
            r.popPage();
            _context4.next = 28;
            return delay(100);

          case 28:
            expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create"]);
            expect(r.getCurrentLocation().getLastPanelInView("main")).toBe("info");
            r.stop();
            done();

          case 32:
          case "end":
            return _context4.stop();
        }
      }
    }, _callee4);
  }));

  return function (_x4) {
    return _ref4.apply(this, arguments);
  };
}());