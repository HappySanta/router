import { useLocation } from './useRouter';

/**
 * Проверка на первую страницу для ситуаций когда пользователь входит в приложение по ссылке вида
 * https://vk.com/app7574523#product/12
 * @param withUpdate
 */
export function useFirstPageCheck(withUpdate = false): boolean {
  const location = useLocation(withUpdate);
  return location.isFirstPage();
}
