import React, {useContext, useEffect, useState, ComponentType} from "react";
import {Route} from "../entities/Route";
import {State} from "../entities/State";
import {RouterContext} from "../entities/RouterContext";

export interface WithSantaRouterProps {
    routeState: State,
    route: Route,
}

export function withSantaRouter<T>(Component: ComponentType<T>):ComponentType<WithSantaRouterProps & T> {
    function withSantaRouter(props: T) {
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
        return <Component {...props} routeState={route[1]} route={route[0]}/>;
    }
    return withSantaRouter;
}