import {useContext} from "react";
import {RouterContext} from "../entities/RouterContext";

export function useFirstPageCheck(): boolean {
  const router = useContext(RouterContext);
  if (!router) throw new Error("Use useFirstPageCheck without context");
  return router.isFirstPage();
}