import {useRouter} from "./useRouter";

export function useFirstPageCheck(withUpdate: boolean = false): boolean {
  const router = useRouter(withUpdate);
  return router.isFirstPage();
}