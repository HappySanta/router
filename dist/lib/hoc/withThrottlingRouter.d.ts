import { ComponentType } from "react";
import { RouterProps } from "./withRouter";
export interface ThrottlingRouterProps extends RouterProps {
    onTransitionEnd: () => void;
}
export declare function withThrottlingRouter<T>(Component: ComponentType<ThrottlingRouterProps & T>): ComponentType<T>;
