import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from './useRouter';
import { Location } from '../..';

// Магическое число милисекунд после которого можно обновлять VKUI и он не зависнет
const UPDATE_INTERVAL = 900;

type NullableFunction = (() => void) | null;

/**
 * хук для обхода решения проблемы с слишком частой сменой панелей/попапов/модалок
 * которая может приводить к зависанию всего приложения
 *
 * работает аналогично {@link useLocation} возвращяет функцию onTransitionEnd котору надо вызывать в колбеках onTransition компонента View
 *
 */
export function useThrottlingLocation(): [Location, () => void] {
  const router = useRouter(true);
  const [location, setLocation] = useState<Location>(router.getCurrentLocation());
  const lastUpdateRouteAt = useRef(0);
  const updateTimer = useRef(0);
  const updateCallback = useRef<NullableFunction>(null);
  useEffect(() => {
    const fn = () => {
      const diff = Date.now() - lastUpdateRouteAt.current;
      if (diff > UPDATE_INTERVAL) {
        lastUpdateRouteAt.current = Date.now();
        setLocation(router.getCurrentLocation());
      } else {
        clearTimeout(updateTimer.current);
        updateCallback.current = () => {
          updateCallback.current = null;
          lastUpdateRouteAt.current = Date.now();
          setLocation(router.getCurrentLocation());
        };
        updateTimer.current = setTimeout(updateCallback.current, UPDATE_INTERVAL - diff) as any as number;
      }
    };
    router.on('update', fn);
    return () => {
      router.off('update', fn);
    };
  }, []);
  const onTransitionEnd = useCallback(() => {
    lastUpdateRouteAt.current = 0;
    if (updateCallback.current) {
      clearTimeout(updateTimer.current);
      updateTimer.current = setTimeout(updateCallback.current, 1) as any as number;
    }
  }, []);
  return [location, onTransitionEnd];
}
