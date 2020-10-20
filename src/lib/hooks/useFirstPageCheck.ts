import { useLocation } from './useLocation';

/**
 * Проверка на первую страницу для ситуаций когда пользователь входит в приложение по ссылке вида
 * https://vk.com/app7574523#product/12
 * @param withUpdate
 * @param panelId
 */

export function useFirstPageCheck(withUpdate = false, panelId?: string): boolean {
  const location = useLocation(withUpdate, panelId);
  return location.isFirstPage();
}
