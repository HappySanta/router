import { Page } from "./Page";
import { RouteList } from "./Router";
import { PageParams } from "./Types";
/**
 * @ignore
 */
export declare const POPUP_KEY = "p";
/**
 * @ignore
 */
export declare const MODAL_KEY = "m";
export declare class Route {
    /**
     * @type {Page}
     */
    structure: Page;
    pageId: string;
    params: PageParams;
    uniqId: number;
    constructor(structure: Page, pageId: string, params: PageParams);
    static getParamsFromPath(location: string): {
        [key: string]: string;
    };
    /**
     * @param {RouteList} routeList
     * @param location "info?w=about&show=1" то, что лежит в window.location.hash
     * @param noSlash
     */
    static fromLocation(routeList: RouteList, location: string, noSlash?: boolean): Route;
    static fromPageId(routeList: RouteList, pageId: string, params?: PageParams): Route;
    clone(): Route;
    getLocation(): string;
    getPageId(): string;
    getPanelId(): string;
    getPanelIdWithoutInfinity(): string;
    getViewId(): string;
    getParams(): PageParams;
    setParams(params?: PageParams): Route;
    isPopup(): boolean;
    getPopupId(): string | null;
    setPopupId(popupId: string): Route;
    isModal(): boolean;
    hasOverlay(): boolean;
    getModalId(): string | null;
    setModalId(modalId: string): Route;
    out(): void;
    in(): void;
}
