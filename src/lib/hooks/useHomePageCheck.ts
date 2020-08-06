import {useFirstPageCheck} from "./useFirstPageCheck";


/**
 * @deprecated use useFirstPageCheck
 */
export function useHomePageCheck():boolean {
    return useFirstPageCheck()
}