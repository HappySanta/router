/**
 * @ignore
 * @packageDocumentation
 */

import { Route } from './Route';
import { State } from './State';
import { HistoryUpdateType } from './Types';

/**
 * @ignore
 */
export const HISTORY_UPDATE_PUSH: HistoryUpdateType = 'PUSH';
/**
 * @ignore
 */
export const HISTORY_UPDATE_REPLACE: HistoryUpdateType = 'REPLACE';
/**
 * @ignore
 */
export const HISTORY_UPDATE_MOVE: HistoryUpdateType = 'MOVE';

/**
 * @ignore
 */
export type UpdateEventType = [Route, Route | undefined, boolean, HistoryUpdateType];

/**
 * @ignore
 */
export class History {
  private stack: Array<[Route, State]> = [];
  private currentIndex = 0;

  push(r: Route, s: State): UpdateEventType {
    const current = this.getCurrentRoute();
    if (this.getCurrentIndex() !== this.getLength() - 1) {
      // Пуш после отката назад, в этом случае вся история "впереди" удаляется
      this.stack = this.stack.slice(0, this.getCurrentIndex() + 1);
    }
    this.stack.push([r, s]);
    this.currentIndex = this.stack.length - 1;
    const next = this.getCurrentRoute();
    current?.out();
    next?.in();
    if (next) {
      this.setLastPanelInView(next, current);
      return [next, current, true, HISTORY_UPDATE_PUSH];
    } else {
      // Если мы только что запушили новое состояние то оно никак не может оказаться пустым
      // если оказалось то что-то не так
      throw new Error('Impossible error on push state, next state is empty!');
    }
  }

  replace(r: Route, s: State): UpdateEventType {
    const current = this.getCurrentRoute();
    this.stack[this.currentIndex] = [r, s];
    const next = this.getCurrentRoute();
    current?.out();
    next?.in();
    if (next) {
      this.setLastPanelInView(next, current);
      return [next, current, true, HISTORY_UPDATE_REPLACE];
    } else {
      // Если мы только что заменили состояние то оно никак не может оказаться пустым
      // если оказалось то что-то не так
      throw new Error('Impossible error on replace state, next state is empty!');
    }
  }

  setCurrentIndex(x: number): UpdateEventType {
    const current = this.getCurrentRoute();
    this.currentIndex = x;
    const next = this.getCurrentRoute();
    current?.out();
    next?.in();
    if (next) {
      this.setLastPanelInView(next, current);
      return [next, current, false, HISTORY_UPDATE_MOVE];
    } else {
      // Если мы только что заменили состояние то оно никак не может оказаться пустым
      // если оказалось то что-то не так
      throw new Error('Impossible error on push state, next state is empty!');
    }
  }

  move(to: number) {
    this.currentIndex += to;
  }

  getLength() {
    return this.stack.length;
  }

  getCurrentIndex(): number {
    return this.currentIndex;
  }

  getCurrentRoute(): Route | undefined {
    return this.stack[this.currentIndex] ? this.stack[this.currentIndex][0] : undefined;
  }

  getCurrentState(): State | undefined {
    return this.stack[this.currentIndex] ? this.stack[this.currentIndex][1] : undefined;
  }

  getHistoryItem(offset = 0): [Route, State] | undefined {
    const index = this.currentIndex + offset;
    return this.stack[index] ? this.stack[index] : undefined;
  }

  canJumpIntoOffset(offset: number) {
    const index = this.currentIndex + offset;
    return index >= 0 && index <= this.getLength() - 1;
  }

  getPageOffset(pageId: string): number {
    for (let i = this.currentIndex - 1; i >= 0; i--) {
      const route = this.stack[i][0];
      if (route.getPageId() === pageId) {
        // Страница совпадает но может быть ситуация когда поверх этой страницы попап или модалка
        // такое мы должны пропустить нас попросили найти смещение до конкретной страницы
        if (!route.hasOverlay()) {
          return i - this.currentIndex;
        }
      }
    }
    return 0;
  }

  getFirstPageOffset(): number {
    for (let i = this.currentIndex - 1; i >= 0; i--) {
      const route = this.stack[i][0];
      if (!route.hasOverlay()) {
        return i - this.currentIndex;
      }
    }
    return 0;
  }

  getHistoryFromStartToCurrent(): Array<[Route, State]> {
    return this.stack.slice(0, this.currentIndex + 1);
  }

  private readonly setLastPanelInView = (next: Route, prev?: Route) => {
    const state = this.getCurrentState();
    if (!state) {
      return;
    }
    state.panelInView = { ...state.panelInView, [next.getViewId()]: next.getPanelId() };
    if (prev) {
      state.panelInView = { ...state.panelInView, [prev.getViewId()]: prev.getPanelId() };
    }
  };
}

