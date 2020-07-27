import React, {useContext, useEffect, useState} from "react";
import {Route} from "../entities/Route";
import {State} from "../entities/State";
import {RouterContext} from "../entities/RouterContext";

export function withSantaRouter<T>(Component: T): T {
    function withSantaRouter(props: {}) {
        const router = useContext(RouterContext);
        if (!router) throw new Error("Use withSantaRouter without context");
        const [route, setRoute] = useState<[Route, State]>([router.getCurrentRouteOrDef(), router.getCurrentStateOrDef()]);
        useEffect(() => {
            const fn = (next: Route) => {
                setRoute([next, router.getCurrentStateOrDef()]);
            };
            router.on("update", fn);
            return () => {
                router.off("update", fn);
            }
        }, []);
        // @ts-ignore
        return <Component routeState={route[1]} route={route[0]} {...props}/>;
    }
    return withSantaRouter as unknown as T;
}