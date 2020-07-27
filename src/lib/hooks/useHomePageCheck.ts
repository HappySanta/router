import {useContext} from "react";
import {RouterContext} from "../entities/RouterContext";

export function useHomePageCheck() {
    const router = useContext(RouterContext);
    if (!router) throw new Error("Use useRouteState without context");
    const state = router.getCurrentStateOrDef();
    return state.first === 1;
}