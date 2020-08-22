import { RouteList, Router } from "./entities/Router";
import { Route } from "./entities/Route";
import { RouterConfig } from "./entities/RouterConfig";
import { PageParams } from "./entities/Types";
/**
 * @ignore
 * @param routes
 * @param config
 */
export declare function startGlobalRouter(routes: RouteList, config?: RouterConfig | null): Router;
export declare function getGlobalRouter(): Router;
export declare function setGlobalRouter(router: Router): void;
/**
 * @ignore
 */
export declare function dangerousResetGlobalRouterUseForTestOnly(): void;
export declare function pushPage(pageId: string, params?: PageParams): void;
export declare function replacePage(pageId: string, params?: PageParams): void;
export declare function popPage(): void;
export declare function pushModal(modalId: string, params?: PageParams): void;
export declare function pushPopup(popupId: string, params?: PageParams): void;
export declare function replaceModal(modalId: string, params?: PageParams): void;
export declare function replacePopout(popupId: string, params?: PageParams): void;
/**
 * @deprecated use popPageIfHasOverlay
 */
export declare function popPageIfModalOrPopup(): void;
export declare function popPageIfHasOverlay(): void;
export declare function pushPageAfterPreviews(prevPageId: string, pageId: string, params?: PageParams): void;
/**
 * @deprecated getCurrentStateOrDef
 * @ignore
 */
export declare function getCurrentRouterState(): import("./entities/State").State;
export declare function getCurrentStateOrDef(): import("./entities/State").State;
/**
 * @deprecated getCurrentRouteOrDef
 * @ignore
 */
export declare function getCurrentRoute(): Route;
export declare function getCurrentRouteOrDef(): Route;
export declare function isInfinityPanel(panelId: string): boolean;
export declare function getInfinityPanelId(panelId: string): string;
