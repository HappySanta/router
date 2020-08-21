import React, {ComponentType} from "react";
import {Location, PageParams, Route, Router, State, useParams, useRouter} from "../..";

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
  location: Location,
}

export interface RouterParams {
  params: PageParams,
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
    return <Component {...props}
                      router={router}
                      location={router.getCurrentLocation()}
                      routeState={router.getCurrentStateOrDef()}
                      route={router.getCurrentRouteOrDef()}/>;
  }

  return WithRouter;
}

export function withParams<T>(Component: ComponentType<RouterParams & T>): ComponentType<T> {
  function WithParams(props: T) {
    const params = useParams()
    return <Component {...props} params={params}/>;
  }

  return WithParams;
}