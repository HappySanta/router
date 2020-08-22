import { Route } from "./Route";
import { State } from "./State";
import { PageParams } from "./Types";
export declare class Location {
    route: Route;
    state: State;
    constructor(route: Route, state: State);
    getLastPanelInView(viewId: string): string | undefined;
    getViewHistory(viewId: string): string[];
    getViewHistoryWithLastPanel(viewId: string): string[];
    /**
     * @deprecated use getViewActivePanel
     * @param viewId
     */
    getPanelIdInView(viewId: string): string | undefined;
    getViewActivePanel(viewId: string): string | undefined;
    getPanelId(): string;
    getViewId(): string;
    getModalId(): string | null;
    getPopupId(): string | null;
    getParams(): PageParams;
    hasOverlay(): boolean;
    /**
     * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
     */
    isFirstPage(): boolean;
}
