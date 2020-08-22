/**
 * @ignore
 * @packageDocumentation
 */
import { Route } from "./Route";
import { State } from "./State";
import { HistoryUpdateType } from "./Types";
/**
 * @ignore
 */
export declare const HISTORY_UPDATE_PUSH: HistoryUpdateType;
/**
 * @ignore
 */
export declare const HISTORY_UPDATE_REPLACE: HistoryUpdateType;
/**
 * @ignore
 */
export declare const HISTORY_UPDATE_MOVE: HistoryUpdateType;
/**
 * @ignore
 */
export declare type UpdateEventType = [Route, Route | undefined, boolean, HistoryUpdateType];
/**
 * @ignore
 */
export declare class History {
    private stack;
    private currentIndex;
    push(r: Route, s: State): UpdateEventType;
    replace(r: Route, s: State): UpdateEventType;
    setCurrentIndex(x: number): UpdateEventType;
    move(to: number): void;
    getLength(): number;
    getCurrentIndex(): number;
    getCurrentRoute(): Route | undefined;
    getCurrentState(): State | undefined;
    canJumpIntoOffset(offset: number): boolean;
    getPageOffset(pageId: string): number;
    getFirstPageOffset(): number;
    getHistoryFromStartToCurrent(): [Route, State][];
    private setLastPanelInView;
}
