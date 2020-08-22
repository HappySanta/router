"use strict";

var _methods = require("./methods");

var _Page = require("./entities/Page");

var _Router2 = require("./entities/Router");

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

test('route basic usage', function () {
  var _startGlobalRouter;

  (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
  var MAIN_PAGE = "/";
  var MAIN_PANEL = "panel_main";
  var USER_PAGE = "/user/:id([0-9]+)";
  var USER_PANEL = "panel_user";
  (0, _methods.startGlobalRouter)((_startGlobalRouter = {}, _defineProperty(_startGlobalRouter, MAIN_PAGE, new _Page.Page(MAIN_PANEL)), _defineProperty(_startGlobalRouter, USER_PAGE, new _Page.Page(USER_PANEL)), _startGlobalRouter));
  var r = (0, _methods.getCurrentRoute)();
  expect(r.getPageId()).toBe(MAIN_PAGE);
  expect(r.getPanelId()).toBe(MAIN_PANEL);
  (0, _methods.pushPage)(USER_PAGE, {
    id: "15"
  });
  var r1 = (0, _methods.getCurrentRoute)();
  expect(r1.getPageId()).toBe(USER_PAGE);
  expect(r1.getPanelId()).toBe(USER_PANEL);
  expect(r1.getParams()).toHaveProperty("id", "15");
});
test('route basic with enter leave callback', function (done) {
  var _Router;

  (0, _methods.dangerousResetGlobalRouterUseForTestOnly)();
  var MAIN_PAGE = "/";
  var MAIN_PANEL = "panel_main";
  var USER_PAGE = "/user/:id([0-9]+)";
  var USER_PANEL = "panel_user";
  var mainEnterCalls = 0;
  var mainLeaveCalls = 0;
  var userEnterCalls = 0;
  var userLeaveCalls = 0;
  var router = new _Router2.Router((_Router = {}, _defineProperty(_Router, MAIN_PAGE, new _Page.Page(MAIN_PANEL)), _defineProperty(_Router, USER_PAGE, new _Page.Page(USER_PANEL)), _Router));
  router.onEnterPage(MAIN_PAGE, function () {
    mainEnterCalls++;
  });
  router.onLeavePage(MAIN_PAGE, function () {
    mainLeaveCalls++;
  });
  router.onEnterPage(USER_PAGE, function () {
    userEnterCalls++;
  });
  router.onLeavePage(USER_PAGE, function () {
    userLeaveCalls++;
  });
  router.start();
  (0, _methods.setGlobalRouter)(router);
  var r = (0, _methods.getGlobalRouter)().getCurrentLocation().route;
  expect(r.getPageId()).toBe(MAIN_PAGE);
  expect(r.getPanelId()).toBe(MAIN_PANEL);
  (0, _methods.pushPage)(USER_PAGE, {
    id: "15"
  });
  var r1 = (0, _methods.getGlobalRouter)().getCurrentLocation().route;
  expect(r1.getPageId()).toBe(USER_PAGE);
  expect(r1.getPanelId()).toBe(USER_PANEL);
  expect(r1.getParams()).toHaveProperty("id", "15");
  (0, _methods.popPage)();
  setTimeout(function () {
    expect(mainEnterCalls).toBe(1 + 1);
    expect(mainLeaveCalls).toBe(1);
    expect(userEnterCalls).toBe(1);
    expect(userLeaveCalls).toBe(1);
    done();
  }, 150);
});