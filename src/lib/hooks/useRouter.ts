import {PageParams, Router, RouterContext} from "../..";
import {useContext, useEffect, useRef, useState} from "react";

const useForceUpdate = () => useState<number>(0)[1];

export function useRouter(withUpdate:boolean = true): Router {
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

export function useParams():PageParams {
    const router = useRouter(false)
    const params = useRef(router.getParams())
    return params.current
}