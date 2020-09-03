import { Route } from './Route';
import { State } from './State';
import { PageParams } from './Types';

export class Location {
  route: Route;
  state: State;

  constructor(route: Route, state: State) {
    this.route = route;
    this.state = state;
  }

  /**
   * @ignore
   * @param viewId
   */
  public getLastPanelInView(viewId: string): string | undefined {
    const state = this.state;
    if (state && state.panelInView[viewId]) {
      return state.panelInView[viewId];
    }
    return undefined;
  }

  /**
   * Массив из id панелей для передачи в атрибут history <View>
   *
   * ```javascript
   * import { useLocation } from '@happysanta/router';
   *
   * const App = () => {
   *    const location = useLocation();
   *    return <View id={VIEW_MAIN}
   *                 history={location.getViewHistory(VIEW_MAIN)}
   *                 activePanel={location.getViewActivePanel(VIEW_MAIN)}>
   *           <Home id={PANEL_MAIN}/>
   *           <Persik id={PANEL_PERSIK}/>
   *    </View>
   * }
   * ```
   *
   * @param viewId
   */
  public getViewHistory(viewId: string): string[] {
    const route = this.route;
    const state = this.state;
    if (route.getViewId() === viewId) {
      return state.history;
    } else {
      const lastPanelId = this.getPanelIdInView(viewId);
      if (lastPanelId) {
        return [lastPanelId];
      }
      return [];
    }
  }

  public getViewHistoryWithLastPanel(viewId: string): string[] {
    const history = this.getViewHistory(viewId);
    const lastPanel = this.getLastPanelInView(viewId);
    if (lastPanel && !history.includes(lastPanel)) {
      return history.concat([lastPanel]);
    } else {
      return history;
    }
  }

  /**
   * @deprecated use getViewActivePanel
   * @ignore
   * @param viewId
   */
  public getPanelIdInView(viewId: string): string | undefined {
    return this.getViewActivePanel(viewId);
  }

  public getViewActivePanel(viewId: string): string | undefined {
    const route = this.route;
    if (route.getViewId() === viewId) {
      return route.getPanelId();
    } else {
      return this.getLastPanelInView(viewId);
    }
  }

  public getPanelId() {
    return this.route.getPanelId();
  }

  public getViewId() {
    return this.route.getViewId();
  }

  public getModalId() {
    return this.route.getModalId();
  }

  public getPopupId() {
    return this.route.getPopupId();
  }

  public getPageId(): string {
    return this.route.getPageId();
  }

  public getParams(): PageParams {
    return this.route.getParams();
  }

  public hasOverlay() {
    return this.route.hasOverlay();
  }

  /**
   * Если вам надо отрисовать стрелочку назад или домик то используйте эту функцию
   */
  public isFirstPage(): boolean {
    return this.state.first === 1;
  }
}
