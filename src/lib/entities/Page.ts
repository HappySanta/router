import { PANEL_MAIN, VIEW_MAIN, ROOT_MAIN } from '../const';

export class Page {
  public panelId: string;
  public viewId: string;
  public rootId: string;
  public isInfinityPanel = false;

  constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN, rootId = ROOT_MAIN) {
    this.panelId = panelId;
    this.viewId = viewId;
    this.rootId = rootId;
  }

  clone() {
    const p = new Page(this.panelId, this.viewId, this.rootId);
    p.isInfinityPanel = this.isInfinityPanel;
    return p;
  }

  makeInfinity() {
    this.isInfinityPanel = true;
    return this;
  }
}
