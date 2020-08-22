import React from "react";
import {Router} from "./Router";

/**
 * Все приложение необходимо оборачивать в контекст для корректной работы {@link withRouter} {@link useRouter}
 *
 * ```javascript
 * import { RouterContext } from '@happysanta/router';
 * import { router } from './routers';
 *
 * ReactDOM.render(<RouterContext.Provider value={router}>
 *   <ConfigProvider isWebView={true}>
 *     <App/>
 *   </ConfigProvider>
 * </RouterContext.Provider>, document.getElementById('root'));
 * ```
 */
export const RouterContext = React.createContext<Router | null>(null);