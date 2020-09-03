import { PANEL_MAIN, VIEW_MAIN } from '../const';

export class Page {
  public panelId: string;
  public viewId: string;
  public isInfinityPanel = false;

  constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN) {
    this.panelId = panelId;
    this.viewId = viewId;
  }

  clone() {
    const p = new Page(this.panelId, this.viewId);
    p.isInfinityPanel = this.isInfinityPanel;
    return p;
  }

  makeInfinity() {
    this.isInfinityPanel = true;
    return this;
  }
}
