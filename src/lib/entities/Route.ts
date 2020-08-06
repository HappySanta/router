import {generatePath, MatchInterface, matchPath} from "../tools"
import * as qs from "querystring"
import {Page} from "./Page";
import {PageParams, RouteList} from "./Router";

export const POPUP_KEY = 'p';
export const MODAL_KEY = 'm';

let routeUniqueId = 1;

function getNextUniqId() {
  return routeUniqueId++
}

export class Route {
  /**
   * @type {Page}
   */
  structure: Page;
  location: string;
  pageId: string;
  params: PageParams = {};
  isBadRoute: boolean = false;
  uniqId: number;


  constructor(structure: Page, location: string, pageId: string, params: PageParams) {
    this.structure = structure;
    this.location = location;
    this.pageId = pageId;
    this.params = params;
    this.uniqId = getNextUniqId();
  }

  static getParamsFromPath(location: string) {
    return location.indexOf('?') !== -1
      ? (qs.parse(location.split('?', 2)[1]) as { [key: string]: string })
      : {}
  }

  /**
   * @param {RouteList} routeList
   * @param location "info?w=about&show=1" то, что лежит в window.location.hash
   * @param noSlash
   */
  static fromLocation(routeList: RouteList, location: string, noSlash: boolean) {
    const params = Route.getParamsFromPath(location);
    location = location.replace("#", '');
    if (noSlash && location.length && location[0] !== '/') {
      location = '/' + location
    }
    location = location.split("?", 2).shift() || "";

    let match: null | MatchInterface = null;
    for (let pageId in routeList) {
      if (routeList.hasOwnProperty(pageId)) {
        match = matchPath(location, pageId);
        if (match && match.isExact) {
          break
        }
      }
    }

    if (!match) {
      throw new Error("ROUTE_NOT_FOUND")
    }

    const ps = routeList[match.path];
    if (!ps) {
      throw new Error("Router fail: cant find structure in routes for " + location)
    }
    return new Route(ps, location, match.path, {...params, ...match.params});
  }

  static fromPageId(routeList: RouteList, pageId: string, params?: PageParams) {
    const ps = routeList[pageId];
    if (!ps) {
      throw new Error("Router fail: cant find structure in routes for " + pageId)
    }
    return new Route(ps, generatePath(pageId, params), pageId, params || ({} as PageParams))
  }

  clone(): Route {
    const copy = new Route(this.structure.clone(), this.location, this.pageId, {...this.params});
    copy.isBadRoute = this.isBadRoute;
    return copy;
  }

  getLocation() {
    return generatePath(this.pageId, this.params)
  }

  getPageId() {
    return this.pageId
  }

  getPanelId(): string {
    if (this.structure.isInfinityPanel) {
      return "_" + this.structure.panelId + '..' + this.uniqId
    }
    return this.structure.panelId
  }

  getPanelIdWithoutInfinity(): string {
    return this.structure.panelId
  }

  getViewId() {
    return this.structure.viewId
  }

  getRootId() {
    return this.structure.rootId
  }

  getParams() {
    return this.params
  }

  setParams(params: PageParams = {}): Route {
    this.params = {...this.params, ...params};
    return this;
  }

  isPopup(): boolean {
    return !!this.getPopupId()
  }

  getPopupId(): string | number | null {
    return this.params[POPUP_KEY] || null
  }

  setPopupId(popupId: string): Route {
    this.params[POPUP_KEY] = popupId;
    return this;
  }

  isModal(): boolean {
    return !!this.getModalId()
  }

  hasOverlay() {
    return this.isModal() || this.isPopup()
  }

  getModalId(): string | null {
    return (this.params[MODAL_KEY]?.toString()) || null
  }

  setModalId(modalId: string): Route {
    this.params[MODAL_KEY] = modalId;
    return this;
  }

  out() {
    if (!this.hasOverlay()) {
      if (this.structure.leaveCallback) {
        this.structure.leaveCallback(this)
      }
    }
  }

  in() {
    if (!this.hasOverlay()) {
      if (this.structure.enterCallback) {
        this.structure.enterCallback(this)
      }
    }
  }
}
