import { RouterMiddleware } from './Router';
import { UsedFixers } from './HotFixers';
import { PAGE_MAIN, PANEL_MAIN, ROOT_MAIN, VIEW_MAIN } from '../const';
import { ReplaceUnknownRouteFn } from './Route';

export interface RouterConfig {
  /**
   * Добавить вывод логов для отладки переходов
   */
  enableLogging: boolean;
  defaultPage: string;
  defaultView: string;
  defaultPanel: string;
  defaultRoot: string;
  /**
   * всегда используйте `true` чтобы избежать путаницы с адресами vk.com/app123#product/123 и vk.com/app123#/product/123
   */
  alwaysStartWithSlash: boolean;
  blankMiddleware: RouterMiddleware[];
  preventSameLocationChange: boolean;

  hotFixes: UsedFixers;

  /**
   * Если true то location будет читаться и писаться из window.location.hash
   * иначе из window.location.pathname+search
   *
   * true -- для миниапов
   * false -- для сайтов
   */
  navigateInHash: boolean;

  ssrLocation?: string;

  // если true то после вызова конструктора, getCurrentRoute будет возвращать актуальное значение
  readLocationInConstructor: boolean;

  replacerUnknownRoute: ReplaceUnknownRouteFn;
}

export const defaultRouterConfig: RouterConfig = {
  enableLogging: false,
  defaultPage: PAGE_MAIN,
  defaultView: VIEW_MAIN,
  defaultPanel: PANEL_MAIN,
  defaultRoot: ROOT_MAIN,
  alwaysStartWithSlash: true,
  blankMiddleware: [],
  preventSameLocationChange: false,
  hotFixes: [],
  navigateInHash: true,
  ssrLocation: undefined,
  readLocationInConstructor: false,
  replacerUnknownRoute: (r) => r,
};
