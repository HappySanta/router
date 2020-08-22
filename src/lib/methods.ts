/**
 * Эти функции будут работать после вызова {@link setGlobalRouter}
 * @packageDocumentation
 */

import {RouteList, Router} from "./entities/Router";
import {Route} from "./entities/Route";
import {RouterConfig} from "./entities/RouterConfig";
import {__testResetHistoryUniqueId} from "./entities/State";
import {PageParams} from "./entities/Types";

let globalRouter: Router | null = null;

/**
 * @ignore
 * @param routes
 * @param config
 */
export function startGlobalRouter(routes: RouteList, config: RouterConfig | null = null): Router {
  if (globalRouter) {
    throw new Error('startGlobalRouter called twice is not allowed')
  }
  globalRouter = new Router(routes, config);
  globalRouter.start();
  return globalRouter;
}

export function getGlobalRouter(): Router {
  if (!globalRouter) {
    throw new Error("getGlobalRouter called before startGlobalRouter")
  }
  return globalRouter;
}

export function setGlobalRouter(router: Router) {
  globalRouter = router
}

/**
 * @ignore
 */
export function dangerousResetGlobalRouterUseForTestOnly() {
  if (globalRouter) {
    globalRouter.stop()
    window.history.pushState(null, "", "")
  }
  if (window.history.state) {
    window.history.pushState(null, "", "")
  }
  __testResetHistoryUniqueId()
  globalRouter = null
}

export function pushPage(pageId: string, params: PageParams = {}) {
  return getGlobalRouter().pushPage(pageId, params)
}

export function replacePage(pageId: string, params: PageParams = {}) {
  return getGlobalRouter().replacePage(pageId, params)
}

export function popPage() {
  return getGlobalRouter().popPage()
}

export function pushModal(modalId: string, params: PageParams = {}) {
  return getGlobalRouter().pushModal(modalId, params)
}

export function pushPopup(popupId: string, params: PageParams = {}) {
  return getGlobalRouter().pushPopup(popupId, params)
}

export function replaceModal(modalId: string, params: PageParams = {}) {
  return getGlobalRouter().replaceModal(modalId, params)
}

export function replacePopout(popupId: string, params: PageParams = {}) {
  return getGlobalRouter().replacePopup(popupId, params)
}

/**
 * @deprecated use popPageIfHasOverlay
 */
export function popPageIfModalOrPopup() {
  return getGlobalRouter().popPageIfModalOrPopup()
}

export function popPageIfHasOverlay() {
  return getGlobalRouter().popPageIfHasOverlay()
}

export function pushPageAfterPreviews(prevPageId: string, pageId: string, params: PageParams = {}) {
  return getGlobalRouter().pushPageAfterPreviews(prevPageId, pageId, params)
}

/**
 * @deprecated getCurrentStateOrDef
 * @ignore
 */
export function getCurrentRouterState() {
  return getCurrentStateOrDef();
}

export function getCurrentStateOrDef() {
  return getGlobalRouter().getCurrentStateOrDef();
}

/**
 * @deprecated getCurrentRouteOrDef
 * @ignore
 */
export function getCurrentRoute(): Route {
  return getCurrentRouteOrDef();
}

export function getCurrentRouteOrDef() {
  return getGlobalRouter().getCurrentRouteOrDef();
}

export function isInfinityPanel(panelId: string): boolean {
  // see Route.getPanelId
  return !!panelId && (panelId[0] === '_');
}


export function getInfinityPanelId(panelId: string) {
  // see Route.getPanelId
  return (panelId.split('..').shift() || "").replace("_", '')
}
