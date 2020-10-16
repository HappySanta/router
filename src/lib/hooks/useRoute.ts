/**
 * @ignore
 * @packageDocumentation
 */

import { Route, useLocation } from '../..';

/**
 * @param withUpdate
 * @param panelId
 * @deprecated useRouter
 * @ignore
 */
export function useRoute(withUpdate = true, panelId?: string): Route {
  const location = useLocation(withUpdate, panelId);
  return location.route;
}
