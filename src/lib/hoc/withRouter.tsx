import React, {ComponentType} from "react";
import {Route, Router} from "../..";
import {State} from "../entities/State";
import {useRouter} from "../hooks/useRouter";

export interface RouterProps {
  /**
   * @deprecated
   */
  routeState: State,

  /**
   * @deprecated
   */
  route: Route,

  router: Router,
}

/**
 * @deprecated use RouterProps
 */
export interface SantaRouterProps extends RouterProps {

}

/**
 * @deprecated use withRouter
 */
export function withSantaRouter<T>(Component: ComponentType<RouterProps & T>): ComponentType<T> {
  return withRouter<T>(Component)
}


export function withRouter<T>(Component: ComponentType<RouterProps & T>, withUpdate: boolean = true): ComponentType<T> {
  function WithRouter(props: T) {
    const router = useRouter(withUpdate)
    return <Component {...props} router={router} routeState={router.getCurrentStateOrDef()} route={router.getCurrentRouteOrDef()}/>;
  }

  return WithRouter;
}