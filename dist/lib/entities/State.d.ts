/**
 * @ignore
 * @packageDocumentation
 */
/**
 * @ignore
 */
export interface State {
    i: string;
    history: string[];
    panelInView: {
        [key: string]: string;
    };
    length: number;
    index: number;
    blank: 0 | 1;
    first: 0 | 1;
}
/**
 * Используется для тестов где не сбрасывается состояние jsdom
 * @ignore
 */
export declare function __testResetHistoryUniqueId(): void;
/**
 * @ignore
 * @param currentIndex
 */
export declare function stateFromLocation(currentIndex: number): State;
