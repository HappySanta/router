import {PageParams, RouteList, Router} from "./entities/Router";
import {Route} from "./entities/Route";

let globalRouter: Router|null = null;

export function startGlobalRouter(routes: RouteList):Router {
	if (globalRouter) {
		throw new Error('startGlobalRouter called twice is not allowed')
	}
	globalRouter = new Router(routes);
	globalRouter.start();
	return globalRouter;
}

export function getGlobalRouter():Router {
	if (!globalRouter) {
		throw new Error("getGlobalRouter called before startGlobalRouter")
	}
	return globalRouter;
}

export function pushPage(pageId: string, params: PageParams = {}) {
	return getGlobalRouter().pushPage(pageId, params)
}

export function replacePage(pageId: string, params: PageParams = {}) {
	return getGlobalRouter().replacePage(pageId, params)
}

export function popPage() {
	return getGlobalRouter().popPage()
}

export function pushModal(modalId: string, params: PageParams = {}) {
	return getGlobalRouter().pushModal(modalId, params)
}

export function pushPopup(popupId: string, params: PageParams = {}) {
	return getGlobalRouter().pushPopup(popupId, params)
}

export function replaceModal(modalId: string, params: PageParams = {}) {
	return getGlobalRouter().replaceModal(modalId, params)
}

export function replacePopout(popupId: string, params: PageParams = {}) {
	return getGlobalRouter().replacePopup(popupId, params)
}

export function popPageIfModalOrPopup() {
	return getGlobalRouter().popPageIfModalOrPopup()
}

export function pushPageAfterPreviews(prevPageId: string, pageId: string, params: PageParams = {}) {
	const offset = getGlobalRouter().getPageOffset(prevPageId)-1;
	if (getGlobalRouter().history.canJumpIntoOffset(offset)) {
		return getGlobalRouter().popPageToAndPush(offset, pageId, params);
	} else {
		return getGlobalRouter().popPageToAndPush(0, pageId, params);
	}
}


export function getLastPanelInView(viewId:string) {
	return getGlobalRouter().lastPanelInView[viewId]
}

export function getCurrentRouterState() {
	return getGlobalRouter().getCurrentStateOrDef();
}

export function getViewHistory(route:Route, viewId:string):string[] {
	const state = getCurrentRouterState();
	if (route.getViewId() === viewId) {
		return state.history
	} else {
		return [getPanelIdInView(route, viewId)].filter(x => !!x)
	}
}

export function getViewHistoryWithLastPanel(route:Route, viewId:string):string[] {
	const history = getViewHistory(route, viewId);
	const lastPanel = getLastPanelInView(viewId);
	if (history.indexOf(lastPanel) === -1) {
		return history.concat([lastPanel])
	} else {
		return history
	}
}

export function getPanelIdInView(route:Route, viewId:string):string {
	if (route.getViewId() === viewId) {
		return route.getPanelId()
	} else {
		return getLastPanelInView(viewId)
	}
}

export function isInfinityPanel(panelId:string):boolean {
	// see Route.getPanelId
	return !!panelId && (panelId[0] === '_');
}


export function getInfinityPanelId(panelId:string) {
	// see Route.getPanelId
	return (panelId.split('..').shift()||"").replace("_", '')
}
