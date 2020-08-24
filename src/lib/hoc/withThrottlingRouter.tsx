import React, {ComponentType} from "react";
import {useRouter, useThrottlingLocation} from "../..";
import {RouterProps} from "./withRouter";
import {getDisplayName} from "../tools";

export interface ThrottlingRouterProps extends RouterProps {
  onTransitionEnd: () => void
}

/**
 * Смотри описание {@link useThrottlingLocation}
 * @param Component
 */
export function withThrottlingRouter<T>(Component: ComponentType<ThrottlingRouterProps & T>): ComponentType<T> {
  function WithThrottlingRouter(props: T) {
    const router = useRouter(false)
    const [location, onTransitionEnd] = useThrottlingLocation()
    return <Component {...props}
                      router={router}
                      onTransitionEnd={onTransitionEnd}
                      routeState={location.state}
                      location={location}
                      route={location.route}/>;
  }
  WithThrottlingRouter.displayName = `WithThrottlingRouter(${getDisplayName(Component)})`;
  return WithThrottlingRouter;
}