import {Route} from "./Route";
import {State} from "./State";
import {PageParams} from "./Types";

export class Location {
  route: Route
  state: State

  constructor(route: Route, state: State) {
    this.route = route;
    this.state = state;
  }

  public getLastPanelInView(viewId: string): string | undefined {
    const state = this.state
    if (state && state.panelInView[viewId]) {
      return state.panelInView[viewId]
    }
    return undefined
  }

  public getViewHistory(viewId: string): string[] {
    const route = this.route
    const state = this.state
    if (route.getViewId() === viewId) {
      return state.history
    } else {
      const lastPanelId = this.getPanelIdInView(viewId)
      if (lastPanelId) {
        return [lastPanelId]
      }
      return []
    }
  }

  public getViewHistoryWithLastPanel(viewId: string): string[] {
    const history = this.getViewHistory(viewId);
    const lastPanel = this.getLastPanelInView(viewId);
    if (lastPanel && history.indexOf(lastPanel) === -1) {
      return history.concat([lastPanel])
    } else {
      return history
    }
  }

  /**
   * @deprecated use getViewActivePanel
   * @param viewId
   */
  public getPanelIdInView(viewId: string): string | undefined {
    return this.getViewActivePanel(viewId)
  }

  public getViewActivePanel(viewId: string): string | undefined {
    const route = this.route
    if (route.getViewId() === viewId) {
      return route.getPanelId()
    } else {
      return this.getLastPanelInView(viewId)
    }
  }

  public getPanelId() {
    return this.route.getPanelId()
  }

  public getViewId() {
    return this.route.getViewId()
  }

  public getModalId() {
    return this.route.getModalId()
  }

  public getPopupId() {
    return this.route.getPopupId()
  }

  public getParams(): PageParams {
    return this.route.getParams()
  }

  public hasOverlay() {
    return this.route.hasOverlay()
  }

  /**
   * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
   */
  public isFirstPage(): boolean {
    return this.state.first === 1;
  }
}