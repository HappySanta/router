"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startGlobalRouter = startGlobalRouter;
exports.getGlobalRouter = getGlobalRouter;
exports.setGlobalRouter = setGlobalRouter;
exports.dangerousResetGlobalRouterUseForTestOnly = dangerousResetGlobalRouterUseForTestOnly;
exports.pushPage = pushPage;
exports.replacePage = replacePage;
exports.popPage = popPage;
exports.pushModal = pushModal;
exports.pushPopup = pushPopup;
exports.replaceModal = replaceModal;
exports.replacePopout = replacePopout;
exports.popPageIfModalOrPopup = popPageIfModalOrPopup;
exports.popPageIfHasOverlay = popPageIfHasOverlay;
exports.pushPageAfterPreviews = pushPageAfterPreviews;
exports.getCurrentRouterState = getCurrentRouterState;
exports.getCurrentStateOrDef = getCurrentStateOrDef;
exports.getCurrentRoute = getCurrentRoute;
exports.getCurrentRouteOrDef = getCurrentRouteOrDef;
exports.isInfinityPanel = isInfinityPanel;
exports.getInfinityPanelId = getInfinityPanelId;

var _Router = require("./entities/Router");

var _State = require("./entities/State");

var globalRouter = null;
/**
 * @ignore
 * @param routes
 * @param config
 */

function startGlobalRouter(routes) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;

  if (globalRouter) {
    throw new Error('startGlobalRouter called twice is not allowed');
  }

  globalRouter = new _Router.Router(routes, config);
  globalRouter.start();
  return globalRouter;
}

function getGlobalRouter() {
  if (!globalRouter) {
    throw new Error("getGlobalRouter called before startGlobalRouter");
  }

  return globalRouter;
}

function setGlobalRouter(router) {
  globalRouter = router;
}
/**
 * @ignore
 */


function dangerousResetGlobalRouterUseForTestOnly() {
  if (globalRouter) {
    globalRouter.stop();
    window.history.pushState(null, "", "");
  }

  if (window.history.state) {
    window.history.pushState(null, "", "");
  }

  (0, _State.__testResetHistoryUniqueId)();
  globalRouter = null;
}

function pushPage(pageId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().pushPage(pageId, params);
}

function replacePage(pageId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().replacePage(pageId, params);
}

function popPage() {
  return getGlobalRouter().popPage();
}

function pushModal(modalId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().pushModal(modalId, params);
}

function pushPopup(popupId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().pushPopup(popupId, params);
}

function replaceModal(modalId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().replaceModal(modalId, params);
}

function replacePopout(popupId) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return getGlobalRouter().replacePopup(popupId, params);
}
/**
 * @deprecated use popPageIfHasOverlay
 */


function popPageIfModalOrPopup() {
  return getGlobalRouter().popPageIfModalOrPopup();
}

function popPageIfHasOverlay() {
  return getGlobalRouter().popPageIfHasOverlay();
}

function pushPageAfterPreviews(prevPageId, pageId) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return getGlobalRouter().pushPageAfterPreviews(prevPageId, pageId, params);
}
/**
 * @deprecated getCurrentStateOrDef
 * @ignore
 */


function getCurrentRouterState() {
  return getCurrentStateOrDef();
}

function getCurrentStateOrDef() {
  return getGlobalRouter().getCurrentStateOrDef();
}
/**
 * @deprecated getCurrentRouteOrDef
 * @ignore
 */


function getCurrentRoute() {
  return getCurrentRouteOrDef();
}

function getCurrentRouteOrDef() {
  return getGlobalRouter().getCurrentRouteOrDef();
}

function isInfinityPanel(panelId) {
  // see Route.getPanelId
  return !!panelId && panelId[0] === '_';
}

function getInfinityPanelId(panelId) {
  // see Route.getPanelId
  return (panelId.split('..').shift() || "").replace("_", '');
}