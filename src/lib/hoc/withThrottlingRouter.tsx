import React, {ComponentType, useCallback, useEffect, useRef, useState} from "react";
import {Route} from "../..";
import {State} from "../entities/State";

import {RouterProps} from "./withRouter";
import {useRouter} from "../hooks/useRouter";

export interface ThrottlingRouterProps extends RouterProps {
  onTransitionEnd: () => void
}

// Магическое число милисекунд после которого можно обновлять VKUI и он не зависнет
const UPDATE_INTERVAL: number = 650

export function withThrottlingRouter<T>(Component: ComponentType<ThrottlingRouterProps & T>): ComponentType<T> {
  function withThrottlingRouter(props: T) {
    const router = useRouter()
    const [route, setRoute] = useState<[Route, State]>([router.getCurrentRouteOrDef(), router.getCurrentStateOrDef()]);
    const lastUpdateRouteAt = useRef(0)
    const updateTimer = useRef(0)
    const updateCallback = useRef<(() => void) | null>(null)
    useEffect(() => {
      const fn = (next: Route) => {
        const diff = Date.now() - lastUpdateRouteAt.current
        if (diff > UPDATE_INTERVAL) {
          lastUpdateRouteAt.current = Date.now()
          setRoute([next, router.getCurrentStateOrDef()]);
        } else {
          clearTimeout(updateTimer.current)
          updateCallback.current = () => {
            lastUpdateRouteAt.current = Date.now()
            setRoute([next, router.getCurrentStateOrDef()]);
            updateCallback.current = null
          }
          updateTimer.current = setTimeout(updateCallback.current, UPDATE_INTERVAL - diff) as any as number
        }
      };
      router.on("update", fn);
      return () => {
        router.off("update", fn);
      }
    }, []);
    const onTransitionEnd = useCallback(() => {
      lastUpdateRouteAt.current = 0
    }, [])
    return <Component {...props} router={router} onTransitionEnd={onTransitionEnd} routeState={route[1]}
                      route={route[0]}/>;
  }

  return withThrottlingRouter;
}