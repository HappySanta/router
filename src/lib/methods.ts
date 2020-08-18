import {PageParams, RouteList, Router} from "./entities/Router";
import {Route} from "./entities/Route";
import {RouterConfig} from "./entities/RouterConfig";

let globalRouter: Router | null = null;

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

export function setGlobalRouter(router:Router) {
  globalRouter = router
}

export function dangerousResetGlobalRouterUseForTestOnly() {
  if (globalRouter) {
    globalRouter.stop()
    window.history.pushState(null, "", "")
  }
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

export function popPageIfModalOrPopup() {
  return getGlobalRouter().popPageIfModalOrPopup()
}

export function pushPageAfterPreviews(prevPageId: string, pageId: string, params: PageParams = {}) {
  return getGlobalRouter().pushPageAfterPreviews(prevPageId, pageId, params)
}

export function getLastPanelInView(viewId: string):string|undefined {
  return getGlobalRouter().getLastPanelInView(viewId)
}

/**
 * @deprecated getCurrentStateOrDef
 */
export function getCurrentRouterState() {
  return getCurrentStateOrDef();
}

export function getCurrentStateOrDef() {
  return getGlobalRouter().getCurrentStateOrDef();
}

/**
 * @deprecated getCurrentRouteOrDef
 */
export function getCurrentRoute(): Route {
  return getCurrentRouteOrDef();
}

export function getCurrentRouteOrDef() {
  return getGlobalRouter().getCurrentRouteOrDef();
}

export function getViewHistory(viewId: string): string[] {
  return getGlobalRouter().getViewHistory(viewId)
}

export function getViewHistoryWithLastPanel(viewId: string): string[] {
  return getGlobalRouter().getViewHistoryWithLastPanel(viewId)
}

export function getPanelIdInView(viewId: string): string|undefined {
  return getGlobalRouter().getPanelIdInView(viewId)
}

export function isInfinityPanel(panelId: string): boolean {
  // see Route.getPanelId
  return !!panelId && (panelId[0] === '_');
}


export function getInfinityPanelId(panelId: string) {
  // see Route.getPanelId
  return (panelId.split('..').shift() || "").replace("_", '')
}
