import {useContext} from "react";
import {RouterContext} from "../entities/RouterContext";

export function useRoute() {
  const router = useContext(RouterContext);
  if (!router) throw new Error("Use useRoute without context");
  return router.getCurrentRouteOrDef();
}