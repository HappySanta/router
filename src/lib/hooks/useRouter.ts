import {useContext, useEffect, useRef, useState} from "react";
import {Location, PageParams, Router, RouterContext} from "../..";

const useForceUpdate = () => useState<number>(0)[1];


export function useRouter(withUpdate: boolean = false): Router {
  const router = useContext(RouterContext);
  if (!router) throw new Error("Use useRoute without context");
  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const fn = () => {
      if (withUpdate) {
        forceUpdate(Date.now());
      }
    };
    router.on("update", fn);
    return () => {
      router.off("update", fn);
    }
  }, []);
  return router
}

export function useParams(): PageParams {
  const router = useRouter(false)
  const params = useRef(router.getCurrentLocation().getParams())
  return params.current
}

export function useLocation(withUpdate: boolean = true): Location {
  const router = useRouter(withUpdate)
  const cachedLocation = useRef(router.getCurrentLocation())
  if (withUpdate) {
    return router.getCurrentLocation()
  }
  return cachedLocation.current
}