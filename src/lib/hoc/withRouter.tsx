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
export function withSantaRouter<T>(Component: ComponentType<RouterProps & T>): ComponentType<T> {
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
export function withRouter<T>(Component: ComponentType<RouterProps & T>, withUpdate = true): ComponentType<T> {
  function WithRouter(props: T) {
    const router = useRouter(withUpdate);
    return <Component {...props}
      router={router}
      location={router.getCurrentLocation()}
      routeState={router.getCurrentStateOrDef()}
      route={router.getCurrentRouteOrDef()} />;
  }

  WithRouter.displayName = `WithRouter(${getDisplayName(Component)})`;
  return WithRouter;
}

