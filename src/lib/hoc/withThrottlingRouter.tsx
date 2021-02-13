import React, { ComponentType } from 'react';
import { useRouter, useThrottlingLocation } from '../..';
import { RouterProps } from './withRouter';
import { getDisplayName } from '../tools';

export interface ThrottlingRouterProps extends RouterProps {
  onTransitionEnd: () => void;
}

/**
 * Смотри описание {@link useThrottlingLocation}
 * @param Component
 */
export function withThrottlingRouter<T extends ThrottlingRouterProps>(Component: ComponentType<T>): ComponentType<Omit<T, keyof ThrottlingRouterProps>> {
  function WithThrottlingRouter(props: Omit<T, keyof ThrottlingRouterProps>) {
    const router = useRouter(false);
    const [location, onTransitionEnd] = useThrottlingLocation();
    const routerProps: ThrottlingRouterProps = {
      router: router,
      onTransitionEnd: onTransitionEnd,
      routeState: location.state,
      location: location,
      route: location.route,
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const allProps: T = {
      ...props,
      ...routerProps,
    } as T;
    return <Component {...allProps} />;
  }

  WithThrottlingRouter.displayName = `WithThrottlingRouter(${getDisplayName(Component)})`;
  return WithThrottlingRouter;
}
