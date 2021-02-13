import React, { ComponentType } from 'react';
import { Location, PageParams, Route, Router, State, useRouter } from '../..';
import { getDisplayName } from '../tools';

export interface RouterProps {
  /**
   * @deprecated
   */
  routeState: State;

  /**
   * @deprecated
   */
  route: Route;

  router: Router;
  location: Location;
}

export interface RouterParams {
  params: PageParams;
}

/**
 * @deprecated use RouterProps
 */
export type SantaRouterProps = RouterProps;

/**
 * @deprecated use withRouter
 * @ignore
 */
export function withSantaRouter<T extends RouterProps>(Component: ComponentType<T>) {
  return withRouter<T>(Component);
}

/**
 * HOC для добавления свойств
 *
 * location:{@link Location}
 * router:{@link Router}
 *
 * в переданный компонент
 *
 * ```typescript
 * export default withRouter(App);
 * ```
 * @param Component
 * @param withUpdate true - обновлять изменении при изменении location false - не обновлять
 */
export function withRouter<T extends RouterProps>(Component: ComponentType<T>, withUpdate = true): ComponentType<Omit<T, keyof RouterProps>> {
  function WithRouter(props: Omit<T, keyof RouterProps>) {
    const router = useRouter(withUpdate);
    const routerProps: RouterProps = {
      router: router,
      location: router.getCurrentLocation(),
      routeState: router.getCurrentStateOrDef(),
      route: router.getCurrentRouteOrDef(),
    };
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const propsWithRouter: T = {
      ...props,
      ...routerProps,
    } as T;
    return <Component {...propsWithRouter} />;
  }

  WithRouter.displayName = `WithRouter(${getDisplayName(Component)})`;
  return WithRouter;
}

