import { generatePath, MatchInterface, matchPath } from '../workWithPathRegexp';
import * as qs from 'querystring';
import { Page } from './Page';
import { RouteList } from './Router';
import { PageParams } from './Types';

/**
 * @ignore
 */
export const POPUP_KEY = 'p';
/**
 * @ignore
 */
export const MODAL_KEY = 'm';

let routeUniqueId = 1;

function getNextUniqId() {
  return routeUniqueId++;
}

export class Route {
  /**
   * @type {Page}
   */
  structure: Page;
  pageId: string;
  params: PageParams = {};
  uniqId: number;

  constructor(structure: Page, pageId: string, params: PageParams) {
    this.structure = structure;
    this.pageId = pageId;
    this.params = params;
    this.uniqId = getNextUniqId();
  }

  /**
   * @param location обязательно без символа # в начале
   */
  static getParamsFromPath(location: string) {
    const qIndex = location.indexOf('?');
    const ampIndex = location.indexOf('&');
    const qFirst = qIndex !== -1 && (qIndex < ampIndex || ampIndex === -1);
    if (qFirst) {
      return qs.parse(location.split(/[?#]/usi, 3)[1]) as { [key: string]: string };
    } else if (ampIndex !== -1) {
      // Это эдж кейс когда кто-то делает ссылку на миниап
      // vk.com/app131232#/user&utm_source=12&utm....
      let data = location.split('&', 2)[1];
      data = location.split('#', 2)[0];
      return qs.parse(data) as { [key: string]: string };
    }

    return {};
  }

  /**
   * @param {RouteList} routeList
   * @param location "info?w=about&show=1" то, что лежит в window.location.hash
   * @param noSlash
   */
  static fromLocation(routeList: RouteList, location: string, noSlash = true) {
    location = location.replace(/^#/usi, '');
    const params = Route.getParamsFromPath(location);
    if (noSlash && location.length && !location.startsWith('/')) {
      location = `/${location}`;
    }
    if (noSlash && !location.length) {
      location = `/${location}`;
    }
    location = location.split('?', 2).shift() || (noSlash ? '/' : '');

    let match: null | MatchInterface = null;
    for (let pageId in routeList) {
      if (routeList.hasOwnProperty(pageId)) {
        match = matchPath(location, pageId);
        if (match && match.isExact) {
          break;
        }
      }
    }

    if (!match) {
      throw new Error('ROUTE_NOT_FOUND');
    }

    const ps = routeList[match.path];
    if (!ps) {
      throw new Error(`Router fail: cant find structure in routes for ${location}`);
    }
    return new Route(ps, match.path, { ...params, ...match.params });
  }

  static fromPageId(routeList: RouteList, pageId: string, params?: PageParams) {
    const ps = routeList[pageId];
    if (!ps) {
      throw new Error(`Router fail: cant find structure in routes for ${pageId}`);
    }
    return new Route(ps, pageId, params || {});
  }

  clone(): Route {
    const copy = new Route(this.structure.clone(), this.pageId, { ...this.params });
    copy.uniqId = this.uniqId;
    return copy;
  }

  getLocation() {
    return generatePath(this.pageId, this.params);
  }

  getPageId() {
    return this.pageId;
  }

  getPanelId(): string {
    if (this.structure.isInfinityPanel) {
      return `_${this.structure.panelId}..${String(this.uniqId)}`;
    }
    return this.structure.panelId;
  }

  getPanelIdWithoutInfinity(): string {
    return this.structure.panelId;
  }

  getViewId() {
    return this.structure.viewId;
  }

  getRootId() {
    return this.structure.rootId;
  }

  getParams(): PageParams {
    return this.params;
  }

  setParams(params: PageParams = {}): Route {
    this.params = { ...this.params, ...params };
    return this;
  }

  isPopup(): boolean {
    return !!this.getPopupId();
  }

  getPopupId(): string | null {
    return this.params[POPUP_KEY]?.toString() || null;
  }

  setPopupId(popupId: string): Route {
    this.params[POPUP_KEY] = popupId;
    return this;
  }

  isModal(): boolean {
    return !!this.getModalId();
  }

  hasOverlay() {
    return this.isModal() || this.isPopup();
  }

  getModalId(): string | null {
    return this.params[MODAL_KEY]?.toString() || null;
  }

  setModalId(modalId: string): Route {
    this.params[MODAL_KEY] = modalId;
    return this;
  }
}

export declare type ReplaceUnknownRouteFn = (newRoute: Route, oldRoute?: Route) => Route;
