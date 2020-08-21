import {useLocation} from "./useRouter";

export function useFirstPageCheck(withUpdate: boolean = false): boolean {
  const location = useLocation(withUpdate);
  return location.isFirstPage();
}