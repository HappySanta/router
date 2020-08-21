import {useFirstPageCheck} from "./useFirstPageCheck";


/**
 * @deprecated use useFirstPageCheck
 * @ignore
 */
export function useHomePageCheck(): boolean {
  return useFirstPageCheck()
}