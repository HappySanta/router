export declare class Page {
    panelId: string;
    viewId: string;
    isInfinityPanel: boolean;
    constructor(panelId?: string, viewId?: string);
    clone(): Page;
    makeInfinity(): this;
}
