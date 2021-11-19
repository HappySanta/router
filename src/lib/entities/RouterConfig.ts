import { RouterMiddleware } from './Router';
import { UsedFixers } from './HotFixers';

export interface RouterConfig {
  /**
   * Добавить вывод логов для отладки переходов
   */
  enableLogging?: boolean;
  defaultPage?: string;
  defaultView?: string;
  defaultPanel?: string;
  /**
   * всегда используйте `true` чтобы избежать путаницы с адресами vk.com/app123#product/123 и vk.com/app123#/product/123
   */
  noSlash?: boolean;
  blankMiddleware?: RouterMiddleware[];
  preventSameLocationChange?: boolean;

  hotFixes?: UsedFixers;

  /**
   * Если true то location будет читаться и писаться из window.location.hash
   * иначе из window.location.pathname+search
   *
   * true -- для миниапов
   * false -- для сайтов
   */
  navigateInHash?: boolean;
}
