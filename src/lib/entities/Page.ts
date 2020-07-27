import {PANEL_MAIN, ROOT_MAIN, VIEW_MAIN} from "../const";


export class Page {
	public panelId: string;
	public viewId: string;
	public rootId: string;
	public isInfinityPanel: boolean = false;

	constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN, rootId = ROOT_MAIN) {
		this.panelId = panelId;
		this.viewId = viewId;
		this.rootId = rootId;
	}

	clone() {
		return new Page(this.panelId, this.viewId, this.rootId)
	}

	makeInfinity() {
		this.isInfinityPanel = true;
		return this
	}
}
