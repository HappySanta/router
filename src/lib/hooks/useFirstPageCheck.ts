import {useLocation} from "./useRouter";

/**
 * Проверка на первую страницу для ситаций когда пользователь входит в прилжение по ссылке вида
 * https://vk.com/app7574523#product/12
 * @param withUpdate
 */
export function useFirstPageCheck(withUpdate: boolean = false): boolean {
  const location = useLocation(withUpdate);
  return location.isFirstPage();
}