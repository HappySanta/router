import {PANEL_MAIN, ROOT_MAIN, VIEW_MAIN} from "../const";
import {EnterCallback, LeaveCallback} from "./Types";

export class Page {
  public panelId: string;
  public viewId: string;
  public rootId: string;
  public isInfinityPanel: boolean = false;
  public enterCallback: EnterCallback | null = null
  public leaveCallback: LeaveCallback | null = null

  constructor(panelId = PANEL_MAIN, viewId = VIEW_MAIN, rootId = ROOT_MAIN) {
    this.panelId = panelId;
    this.viewId = viewId;
    this.rootId = rootId;
  }

  clone() {
    const p = new Page(this.panelId, this.viewId, this.rootId)
    p.enterCallback = this.enterCallback
    p.leaveCallback = this.leaveCallback
    return p
  }

  makeInfinity() {
    this.isInfinityPanel = true;
    return this
  }

  onEnter(cb: EnterCallback) {
    this.enterCallback = cb;
    return this;
  }

  onLeave(cb: LeaveCallback) {
    this.leaveCallback = cb;
    return this;
  }
}
