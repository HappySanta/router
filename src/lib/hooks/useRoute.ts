/**
 * @ignore
 * @packageDocumentation
 */

import {useEffect, useState} from "react";
import {Route} from "../..";
import {useRouter} from "./useRouter";

/**
 * @param withUpdate
 * @deprecated useRouter
 * @ignore
 */
export function useRoute(withUpdate: boolean = true): Route {
  const router = useRouter(false)
  const [route, setRoute] = useState(router.getCurrentRouteOrDef())
  useEffect(() => {
    const fn = (next: Route) => {
      if (withUpdate) {
        setRoute(next);
      }
    };
    router.on("update", fn);
    return () => {
      router.off("update", fn);
    }
  }, []);
  return route;
}