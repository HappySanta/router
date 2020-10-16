import { Location, useRouter } from '../..';
import { useRef } from 'react';

/**
 * @param withUpdate
 * @param {string} panelId id панели для которой надо получить Location
 */
export function useLocation(withUpdate = true, panelId?: string): Location {
  const router = useRouter(withUpdate);
  const cachedLocation = useRef(router.getCurrentLocation());
  const prevLocation = useRef(router.getPreviousLocation());
  if (withUpdate) {
    const curLocation = router.getCurrentLocation();
    const prevLocation = router.getPreviousLocation();
    if (panelId && prevLocation?.getPanelId() === panelId) {
      return prevLocation;
    }
    return curLocation;
  } else {
    if (panelId && prevLocation.current?.getPanelId() === panelId) {
      return prevLocation.current;
    }
    return cachedLocation.current;
  }
}
