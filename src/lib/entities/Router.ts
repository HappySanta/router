import {Page} from "./Page";
import {History} from "./History";
import {MODAL_KEY, POPUP_KEY, Route as MyRoute} from "./Route";
import {preventBlinkingBySettingScrollRestoration} from "../tools";
import {State, stateFromLocation} from "./State";
import {EventEmitter} from "tsee";

import {PAGE_MAIN, PANEL_MAIN, VIEW_MAIN} from "../const";
import {RouterConfig} from "./RouterConfig";

export declare type RouteList = { [key: string]: Page }
export declare type ReplaceUnknownRouteFn = (newRoute: MyRoute, oldRoute?: MyRoute) => MyRoute
export declare type PageParams = { [key: string]: string | number }

export declare type HistoryUpdateType = "PUSH" | "REPLACE" | "MOVE";
export declare type UpdateEventFn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => void
export declare type EnterEventFn = (newRoute: MyRoute, oldRoute?: MyRoute) => void
export declare type LeaveEventFn = (newRoute: MyRoute, oldRoute: MyRoute, isNewRoute: boolean, type: HistoryUpdateType) => void

export class Router extends EventEmitter<{
  update: UpdateEventFn,
  enter: EnterEventFn,
}> {

  routes: RouteList = {};
  history: History;
  deferOnGoBack: (() => void) | null = null;
  startHistoryOffset: number = 0;
  lastPanelInView: { [key: string]: string } = {};
  enableLogging: boolean = false;
  enableErrorThrowing: boolean = false;
  defaultPage: string = PAGE_MAIN;
  defaultView: string = VIEW_MAIN;
  defaultPanel: string = PANEL_MAIN;
  alwaysStartWithSlash: boolean = true;
  private stated: boolean = false;

  constructor(routes: RouteList, routerConfig: RouterConfig | null = null) {
    super();
    this.routes = routes;
    this.history = new History();
    if (routerConfig) {
      if (routerConfig.enableLogging !== undefined) {
        this.enableLogging = routerConfig.enableLogging;
      }
      if (routerConfig.enableErrorThrowing !== undefined) {
        this.enableErrorThrowing = routerConfig.enableErrorThrowing;
      }
      if (routerConfig.defaultPage !== undefined) {
        this.defaultPage = routerConfig.defaultPage;
      }
      if (routerConfig.defaultView !== undefined) {
        this.defaultView = routerConfig.defaultView;
      }
      if (routerConfig.defaultPanel !== undefined) {
        this.defaultPanel = routerConfig.defaultPanel;
      }
      if (routerConfig.noSlash !== undefined) {
        this.alwaysStartWithSlash = routerConfig.noSlash;
      }
    }
  }

  private static back() {
    window.history.back();
  }

  private static backTo(x: number) {
    window.history.go(x);
  }

  replacerUnknownRoute: ReplaceUnknownRouteFn = r => r;

  start() {
    if (this.stated) {
      throw new Error("start method call twice! this is not allowed");
    }
    this.stated = true;

    this.off("update", this.saveLastPanelInView);
    this.on("update", this.saveLastPanelInView);
    this.startHistoryOffset = window.history.length;
    let nextRoute = this.createRouteFromLocationWithReplace();
    const state = stateFromLocation(this.history.getCurrentIndex());
    state.first = 1;
    if (state.blank === 1) {
      this.emit("enter", nextRoute, this.history.getCurrentRoute());
      state.history = [nextRoute.getPanelId()]
    }
    this.replace(state, nextRoute);
    window.removeEventListener("popstate", this.onPopState);
    window.addEventListener("popstate", this.onPopState);
  }

  stop() {
    window.removeEventListener("popstate", this.onPopState);
  }

  getCurrentRouteOrDef(): MyRoute {
    const r = this.history.getCurrentRoute();
    if (r) {
      return r;
    }
    return this.createRouteFromLocation(this.defaultPage)
  }

  getCurrentStateOrDef(): State {
    const s = this.history.getCurrentState();
    if (s) {
      return {...s};
    }
    return stateFromLocation(this.history.getCurrentIndex());
  }

  checkParams(params: PageParams) {
    if (params.hasOwnProperty(POPUP_KEY)) {
      if (this.isErrorThrowingEnabled()) {
        throw new Error(`pushPage with key [${POPUP_KEY}]:${params[POPUP_KEY]} is not allowed use another key`)
      }
    }
    if (params.hasOwnProperty(MODAL_KEY)) {
      if (this.isErrorThrowingEnabled()) {
        throw new Error(`pushPage with key [${MODAL_KEY}]:${params[MODAL_KEY]} is not allowed use another key`)
      }
    }
  }

  isErrorThrowingEnabled() {
    return this.enableErrorThrowing;
  }

  log(...args: any) {
    if (!this.enableLogging) {
      return
    }
    console.log.apply(this, args)
  }

  /**
   * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
   */
  isFirstPage(): boolean {
    const state = this.getCurrentStateOrDef();
    return state.first === 1;
  }

  pushPage(pageId: string, params: PageParams = {}) {
    this.log("pushPage " + pageId, params);
    this.checkParams(params);
    let currentRoute = this.getCurrentRouteOrDef();
    let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
    const s = {...this.getCurrentStateOrDef()};
    if (currentRoute.getViewId() === nextRoute.getViewId()) {
      s.history = s.history.concat([nextRoute.getPanelId()]);
    } else {
      s.history = [nextRoute.getPanelId()]
    }
    this.push(s, nextRoute);
  }

  replacePage(pageId: string, params: PageParams = {}) {
    this.log("replacePage " + pageId, params);
    let currentRoute = this.getCurrentRouteOrDef();
    let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
    const s = {...this.getCurrentStateOrDef()};
    if (currentRoute.getViewId() === nextRoute.getViewId()) {
      s.history = s.history.concat([]);
      s.history.pop();
      s.history.push(nextRoute.getPanelId());
    } else {
      s.history = [nextRoute.getPanelId()];
    }
    this.replace(s, nextRoute);
  }

  pushPageAfterPreviews(prevPageId: string, pageId: string, params: PageParams = {}) {
    const offset = this.getPageOffset(prevPageId) - 1;
    if (this.history.canJumpIntoOffset(offset)) {
      return this.popPageToAndPush(offset, pageId, params);
    } else {
      return this.popPageToAndPush(0, pageId, params);
    }
  }

  popPage() {
    this.log("popPage");
    Router.back();
  }

  popPageTo(x: number) {
    this.log("popPageTo", x);
    Router.backTo(x);
  }

  popPageToAndPush(x: number, pageId: string, params: PageParams = {}) {
    if (x !== 0) {
      this.deferOnGoBack = () => {
        this.pushPage(pageId, params)
      };
      Router.backTo(x);
    } else {
      this.pushPage(pageId, params);
    }
  }

  /**
   *  История ломается когда открывается VKPay или пост из колокольчика
   */
  isHistoryBroken(): boolean {
    return (window.history.length !== (this.history.getLength() + this.startHistoryOffset))
  }

  /**
   * Способ починить историю браузера когда ее сломали снаружи из фрейма
   * напирмер перейдя по колокольчику или открыв вкпей
   */
  fixBrokenHistory() {
    this.history.getHistoryFromStartToCurrent().forEach(([r, s]) => {
      window.history.pushState(s, "page=" + s.index, '#' + r.getLocation());
    });
    this.startHistoryOffset = window.history.length - this.history.getLength();
  }

  /**
   * @param pageId
   * @return number на сколько страниц назад надо откатиться чтобы дойти до искомой страницы
   * если вернется - 0 то страница не найдена в истории
   */
  getPageOffset(pageId: string): number {
    return this.history.getPageOffset(pageId)
  }

  /**
   * @param modalId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  pushModal(modalId: string, params: PageParams = {}) {
    this.checkParams(params);
    this.log("pushModal " + modalId, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
    this.push(this.getCurrentStateOrDef(), nextRoute);
  }

  /**
   * @param popupId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  pushPopup(popupId: string, params: PageParams = {}) {
    this.checkParams(params);
    this.log("pushPopup " + popupId, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
    this.push(this.getCurrentStateOrDef(), nextRoute);
  }

  /**
   * @param modalId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  replaceModal(modalId: string, params: PageParams = {}) {
    this.log("replaceModal " + modalId, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
    this.replace(this.getCurrentStateOrDef(), nextRoute);
  }

  /**
   * @param popupId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  replacePopup(popupId: string, params: PageParams = {}) {
    this.log("replacePopup " + popupId, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
    this.replace(this.getCurrentStateOrDef(), nextRoute);
  }

  popPageIfModal() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isModal()) {
      this.log("popPageIfModal");
      Router.back();
    }
  }

  popPageIfPopup() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isPopup()) {
      this.log("popPageIfPopup");
      Router.back();
    }
  }

  getDefaultRoute(location: string, params: PageParams) {
    return new MyRoute(
      new Page(this.defaultPanel, this.defaultView),
      this.defaultPage,
      params,
    );
  }

  createRouteFromLocation(location: string): MyRoute {
    try {
      return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash)
    } catch (e) {
      if (e && e.message === 'ROUTE_NOT_FOUND') {
        return this.getDefaultRoute(location, MyRoute.getParamsFromPath(location))
      }
      throw e
    }
  }

  popPageIfModalOrPopup() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isPopup() || currentRoute.isModal()) {
      this.log("popPageIfModalOrPopup");
      Router.back();
    }
  }

  public getLastPanelInView(viewId: string): string | undefined {
    return this.lastPanelInView[viewId]
  }

  public getViewHistory(viewId: string): string[] {
    const route = this.getRoute()
    const state = this.getCurrentStateOrDef();
    if (route.getViewId() === viewId) {
      return state.history
    } else {
      const lastPanelId = this.getPanelIdInView(viewId)
      if (lastPanelId) {
        return [lastPanelId]
      }
      return []
    }
  }

  public getViewHistoryWithLastPanel(viewId: string): string[] {
    const history = this.getViewHistory(viewId);
    const lastPanel = this.getLastPanelInView(viewId);
    if (lastPanel && history.indexOf(lastPanel) === -1) {
      return history.concat([lastPanel])
    } else {
      return history
    }
  }

  public getPanelIdInView(viewId: string): string | undefined {
    const route = this.getRoute()
    if (route.getViewId() === viewId) {
      return route.getPanelId()
    } else {
      return this.getLastPanelInView(viewId)
    }
  }

  public getRoute(): MyRoute {
    return this.getCurrentRouteOrDef()
  }

  public getPanelId() {
    return this.getRoute().getPanelId()
  }

  public getViewId() {
    return this.getRoute().getViewId()
  }

  public getModalId() {
    return this.getRoute().getModalId()
  }

  public getPopupId() {
    return this.getRoute().getPopupId()
  }

  public getParams(): PageParams {
    return this.getRoute().getParams()
  }

  public hasOverlay() {
    return this.getRoute().hasOverlay()
  }

  private saveLastPanelInView = (next: MyRoute, prev?: MyRoute) => {
    this.lastPanelInView[next.getViewId()] = next.getPanelId();
    if (prev) {
      this.lastPanelInView[prev.getViewId()] = prev.getPanelId();
    }
  };

  private onPopState = () => {
    if (this.deferOnGoBack) {
      this.log("onPopStateInDefer");
      this.deferOnGoBack();
      this.deferOnGoBack = null;
      return
    }

    let nextRoute = this.createRouteFromLocationWithReplace();
    const state = stateFromLocation(this.history.getCurrentIndex());
    if (state.blank === 1) {
      state.index = this.history.getCurrentIndex();
      state.history = [nextRoute.getPanelId()];
      this.emit("enter", nextRoute, this.history.getCurrentRoute());
      this.emit("update", ...this.history.push(nextRoute, state));
      window.history.replaceState(state, "page=" + state.index, '#' + nextRoute.getLocation());
    } else {
      this.emit("update", ...this.history.setCurrentIndex(state.index));
    }

    this.log("onPopState", [nextRoute, this.history.getCurrentRoute(), state]);
  };

  private replace(state: State, nextRoute: MyRoute) {
    state.length = window.history.length;
    state.index = this.history.getCurrentIndex();
    state.blank = 0;
    this.emit("update", ...this.history.replace(nextRoute, state));
    window.history.replaceState(state, "page=" + state.index, '#' + nextRoute.getLocation());
    preventBlinkingBySettingScrollRestoration();
  }

  private push(state: State, nextRoute: MyRoute) {
    state.length = window.history.length;
    state.blank = 0;
    state.first = 0;
    this.emit("update", ...this.history.push(nextRoute, state));
    state.index = this.history.getCurrentIndex();
    window.history.pushState(state, "page=" + state.index, '#' + nextRoute.getLocation());
    preventBlinkingBySettingScrollRestoration();
  }

  private createRouteFromLocationWithReplace() {
    const location = window.location.hash
    try {
      return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash)
    } catch (e) {
      if (e && e.message === 'ROUTE_NOT_FOUND') {
        const def = this.getDefaultRoute(location, MyRoute.getParamsFromPath(location))
        return this.replacerUnknownRoute(def, this.history.getCurrentRoute())
      }
      throw e
    }
  }


  /**
   * @param pageId
   * @param fn
   * @return unsubscribe function
   */
  onEnterPage(pageId:string, fn:UpdateEventFn):() => void {
    const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
      if (newRoute.pageId === pageId) {
        if (!newRoute.hasOverlay()) {
          fn(newRoute, oldRoute, isNewRoute, type)
        }
      }
    }

    this.on("update", _fn)
    return () => {
      this.off("update", _fn)
    }
  }

  /**
   * @param pageId
   * @param fn
   * @return unsubscribe function
   */
  onLeavePage(pageId:string, fn:LeaveEventFn):() => void {
    const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
      if (oldRoute && oldRoute.pageId === pageId) {
        if (!oldRoute.hasOverlay()) {
          fn(newRoute, oldRoute, isNewRoute, type)
        }
      }
    }

    this.on("update", _fn)
    return () => {
      this.off("update", _fn)
    }
  }
}
