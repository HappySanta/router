import { Page } from './Page';
import { History, UpdateEventType } from './History';
import { MODAL_KEY, POPUP_KEY, Route as MyRoute } from './Route';
import { preventBlinkingBySettingScrollRestoration } from '../tools';
import { State, stateFromLocation } from './State';
import { EventEmitter } from 'tsee';

import { PAGE_MAIN, PANEL_MAIN, VIEW_MAIN } from '../const';
import { RouterConfig } from './RouterConfig';
import { Location } from './Location';
import { HistoryUpdateType, PageParams } from './Types';

export declare type RouteList = { [key: string]: Page };

export declare type ReplaceUnknownRouteFn = (newRoute: MyRoute, oldRoute?: MyRoute) => MyRoute;
/**
 * @ignore
 */
export declare type UpdateEventFn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => void;
/**
 * @ignore
 */
export declare type EnterEventFn = (newRoute: MyRoute, oldRoute?: MyRoute) => void;
/**
 * @ignore
 */
export declare type LeaveEventFn = (newRoute: MyRoute, oldRoute: MyRoute, isNewRoute: boolean, type: HistoryUpdateType) => void;

export class Router extends EventEmitter<{
  update: UpdateEventFn;
  enter: EnterEventFn;
}> {
  routes: RouteList = {};
  history: History;
  enableLogging = false;
  enableErrorThrowing = false;
  defaultPage: string = PAGE_MAIN;
  defaultView: string = VIEW_MAIN;
  defaultPanel: string = PANEL_MAIN;
  alwaysStartWithSlash = true;
  private deferOnGoBack: (() => void) | null = null;
  private startHistoryOffset = 0;
  private started = false;

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

  replacerUnknownRoute: ReplaceUnknownRouteFn = (r) => r;

  start() {
    if (this.started) {
      throw new Error('start method call twice! this is not allowed');
    }
    this.started = true;

    let enterEvent: [MyRoute, MyRoute|undefined]|null = null;
    this.startHistoryOffset = window.history.length;
    let nextRoute = this.createRouteFromLocationWithReplace();
    const state = stateFromLocation(this.history.getCurrentIndex());
    state.first = 1;
    if (state.blank === 1) {
      enterEvent = [nextRoute, this.history.getCurrentRoute()];
      state.history = [nextRoute.getPanelId()];
    }
    this.replace(state, nextRoute);
    window.removeEventListener('popstate', this.onPopState);
    window.addEventListener('popstate', this.onPopState);
    if (enterEvent) {
      this.emit('enter', ...enterEvent);
    }
  }

  stop() {
    window.removeEventListener('popstate', this.onPopState);
  }

  getCurrentRouteOrDef(): MyRoute {
    const r = this.history.getCurrentRoute();
    if (r) {
      return r;
    }
    return this.createRouteFromLocation(this.defaultPage);
  }

  getCurrentStateOrDef(): State {
    const s = this.history.getCurrentState();
    if (s) {
      return { ...s };
    }
    return stateFromLocation(this.history.getCurrentIndex());
  }

  isErrorThrowingEnabled() {
    return this.enableErrorThrowing;
  }

  log(...args: any) {
    if (!this.enableLogging) {
      return;
    }
    console.log.apply(this, args);
  }

  /**
   * Добавляет новую страницу в историю
   * @param pageId страница указанная в конструкторе {@link Router.constructor}
   * @param params можно получить из {@link Location.getParams}
   */
  pushPage(pageId: string, params: PageParams = {}) {
    this.log(`pushPage ${pageId}`, params);
    this.checkParams(params);
    let currentRoute = this.getCurrentRouteOrDef();
    let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
    const s = { ...this.getCurrentStateOrDef() };
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
  replacePage(pageId: string, params: PageParams = {}) {
    this.log(`replacePage ${pageId}`, params);
    let currentRoute = this.getCurrentRouteOrDef();
    let nextRoute = MyRoute.fromPageId(this.routes, pageId, params);
    const s = { ...this.getCurrentStateOrDef() };
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
    this.log('pushPageAfterPreviews', [prevPageId, pageId, params]);
    const offset = this.history.getPageOffset(prevPageId);
    if (this.history.canJumpIntoOffset(offset)) {
      return this.popPageToAndPush(offset, pageId, params);
    } else {
      return this.popPageToAndPush(0, pageId, params);
    }
  }

  /**
   * Переход по истории назад
   */
  popPage() {
    this.log('popPage');
    Router.back();
  }

  /**
   * Если x - число, то осуществляется переход на указанное количество шагов назад
   * Если x - строка, то в истории будет найдена страница с указанным pageId и осуществлен переход до нее
   * @param {string|number} x
   */
  popPageTo(x: number | string) {
    this.log('popPageTo', x);
    if (typeof x === 'number') {
      Router.backTo(x);
    } else {
      const offset = this.history.getPageOffset(x);
      if (this.history.canJumpIntoOffset(offset)) {
        Router.backTo(offset);
      } else {
        throw new Error(`Unexpected offset ${offset} then try jump to page ${x}`);
      }
    }
  }

  popPageToAndPush(x: number, pageId: string, params: PageParams = {}) {
    if (x !== 0) {
      this.deferOnGoBack = () => {
        this.pushPage(pageId, params);
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
    return window.history.length !== this.history.getLength() + this.startHistoryOffset;
  }

  /**
   * Способ починить историю браузера когда ее сломали снаружи из фрейма
   * например перейдя по колокольчику или открыв вкпей
   */
  fixBrokenHistory() {
    this.history.getHistoryFromStartToCurrent().forEach(([r, s]) => {
      window.history.pushState(s, `page=${s.index}`, `#${r.getLocation()}`);
    });
    this.startHistoryOffset = window.history.length - this.history.getLength();
  }

  /**
   * @param modalId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  pushModal(modalId: string, params: PageParams = {}) {
    this.checkParams(params);
    this.log(`pushModal ${modalId}`, params);
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
    this.log(`pushPopup ${popupId}`, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
    this.push(this.getCurrentStateOrDef(), nextRoute);
  }

  /**
   * @param modalId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  replaceModal(modalId: string, params: PageParams = {}) {
    this.log(`replaceModal ${modalId}`, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setModalId(modalId).setParams(params);
    this.replace(this.getCurrentStateOrDef(), nextRoute);
  }

  /**
   * @param popupId
   * @param params Будьте аккуратны с параметрами, не допускайте чтобы ваши параметры пересекались с параметрами страницы
   */
  replacePopup(popupId: string, params: PageParams = {}) {
    this.log(`replacePopup ${popupId}`, params);
    let currentRoute = this.getCurrentRouteOrDef();
    const nextRoute = currentRoute.clone().setPopupId(popupId).setParams(params);
    this.replace(this.getCurrentStateOrDef(), nextRoute);
  }

  popPageIfModal() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isModal()) {
      this.log('popPageIfModal');
      Router.back();
    }
  }

  popPageIfPopup() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isPopup()) {
      this.log('popPageIfPopup');
      Router.back();
    }
  }

  /**
   * @deprecated use popPageIfHasOverlay
   */
  popPageIfModalOrPopup() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.isPopup() || currentRoute.isModal()) {
      this.log('popPageIfModalOrPopup');
      Router.back();
    }
  }

  popPageIfHasOverlay() {
    let currentRoute = this.getCurrentRouteOrDef();
    if (currentRoute.hasOverlay()) {
      this.log('popPageIfHasOverlay');
      Router.back();
    }
  }

  /**
   * @param pageId
   * @param fn
   * @return unsubscribe function
   */
  onEnterPage(pageId: string, fn: UpdateEventFn): () => void {
    const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
      if (newRoute.pageId === pageId) {
        if (!newRoute.hasOverlay()) {
          fn(newRoute, oldRoute, isNewRoute, type);
        }
      }
    };

    this.on('update', _fn);
    return () => {
      this.off('update', _fn);
    };
  }

  /**
   * @param pageId
   * @param fn
   * @return unsubscribe function
   */
  onLeavePage(pageId: string, fn: LeaveEventFn): () => void {
    const _fn = (newRoute: MyRoute, oldRoute: MyRoute | undefined, isNewRoute: boolean, type: HistoryUpdateType) => {
      if (oldRoute && oldRoute.pageId === pageId) {
        if (!oldRoute.hasOverlay()) {
          fn(newRoute, oldRoute, isNewRoute, type);
        }
      }
    };

    this.on('update', _fn);
    return () => {
      this.off('update', _fn);
    };
  }

  getCurrentLocation(): Location {
    return new Location(this.getCurrentRouteOrDef(), this.getCurrentStateOrDef());
  }

  private checkParams(params: PageParams) {
    if (params.hasOwnProperty(POPUP_KEY)) {
      if (this.isErrorThrowingEnabled()) {
        throw new Error(`pushPage with key [${POPUP_KEY}]:${params[POPUP_KEY]} is not allowed use another key`);
      }
    }
    if (params.hasOwnProperty(MODAL_KEY)) {
      if (this.isErrorThrowingEnabled()) {
        throw new Error(`pushPage with key [${MODAL_KEY}]:${params[MODAL_KEY]} is not allowed use another key`);
      }
    }
  }

  private getDefaultRoute(location: string, params: PageParams) {
    try {
      return MyRoute.fromLocation(this.routes, '/', this.alwaysStartWithSlash);
    } catch (e) {
      if (e && e.message === 'ROUTE_NOT_FOUND') {
        return new MyRoute(
          new Page(this.defaultPanel, this.defaultView),
          this.defaultPage,
          params,
        );
      }
      throw e;
    }
  }

  private readonly onPopState = () => {
    let nextRoute = this.createRouteFromLocationWithReplace();
    const state = stateFromLocation(this.history.getCurrentIndex());
    let enterEvent: [MyRoute, MyRoute | undefined] | null = null;
    let updateEvent: UpdateEventType | null = null;
    if (state.blank === 1) {
      // Пустое состояние бывает когда приложение восстанавливают из кеша с другим хешом
      // такое состояние помечаем как первая страница
      state.first = 1;
      state.index = this.history.getCurrentIndex();
      state.history = [nextRoute.getPanelId()];
      enterEvent = [nextRoute, this.history.getCurrentRoute()];
      updateEvent = this.history.push(nextRoute, state);
      window.history.replaceState(state, `page=${state.index}`, `#${nextRoute.getLocation()}`);
    } else {
      updateEvent = this.history.setCurrentIndex(state.index);
    }

    if (this.deferOnGoBack) {
      this.log('onPopStateInDefer');
      this.deferOnGoBack();
      this.deferOnGoBack = null;
      return;
    }

    this.log('onPopState', [nextRoute, this.history.getCurrentRoute(), state]);

    if (enterEvent) {
      this.emit('enter', ...enterEvent);
    }
    if (updateEvent) {
      this.emit('update', ...updateEvent);
    }
  };

  private replace(state: State, nextRoute: MyRoute) {
    state.length = window.history.length;
    state.index = this.history.getCurrentIndex();
    state.blank = 0;
    const updateEvent = this.history.replace(nextRoute, state);
    window.history.replaceState(state, `page=${state.index}`, `#${nextRoute.getLocation()}`);
    preventBlinkingBySettingScrollRestoration();

    this.emit('update', ...updateEvent);
  }

  private push(state: State, nextRoute: MyRoute) {
    state.length = window.history.length;
    state.blank = 0;
    state.first = 0;
    let updateEvent = this.history.push(nextRoute, state);
    state.index = this.history.getCurrentIndex();
    window.history.pushState(state, `page=${state.index}`, `#${nextRoute.getLocation()}`);
    preventBlinkingBySettingScrollRestoration();

    this.emit('update', ...updateEvent);
  }

  private createRouteFromLocationWithReplace() {
    const location = window.location.hash;
    try {
      return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash);
    } catch (e) {
      if (e && e.message === 'ROUTE_NOT_FOUND') {
        const def = this.getDefaultRoute(location, MyRoute.getParamsFromPath(location));
        return this.replacerUnknownRoute(def, this.history.getCurrentRoute());
      }
      throw e;
    }
  }

  private createRouteFromLocation(location: string): MyRoute {
    try {
      return MyRoute.fromLocation(this.routes, location, this.alwaysStartWithSlash);
    } catch (e) {
      if (e && e.message === 'ROUTE_NOT_FOUND') {
        return this.getDefaultRoute(location, MyRoute.getParamsFromPath(location));
      }
      throw e;
    }
  }

  /**
   * @param safety - true будет ждать события не дольше 700мс, если вы уверены что надо ждать дольше передайте false
   */
  afterUpdate(safety = true): Promise<void> {
    return new Promise((resolve) => {
      let t = 0;
      const fn = () => {
        clearTimeout(t);
        this.off('update', fn);
        resolve();
      };
      this.on('update', fn);
      if (safety) {
        // На случай когда метод ошибочно используется не после popPage
        // чтобы не завис навечно
        t = setTimeout(fn, 700) as any as number;
      }
    });
  }
}
