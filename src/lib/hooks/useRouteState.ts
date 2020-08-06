import {useContext} from "react";
import {RouterContext} from "../entities/RouterContext";

export function useRouteState() {
  const router = useContext(RouterContext);
  if (!router) throw new Error("Use useRouteState without context");
  return router.getCurrentStateOrDef();
}