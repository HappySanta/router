/**
 * @jest-environment jsdom
 */
import {
  dangerousResetGlobalRouterUseForTestOnly,
  getCurrentRoute, getCurrentRouteOrDef,
  popPage,
  pushPage,
  startGlobalRouter
} from "./methods";
import {Page} from "./entities/Page";
import {RouteList} from "./entities/Router";


test('route basic usage', () => {
  dangerousResetGlobalRouterUseForTestOnly();
  const MAIN_PAGE = "/"
  const MAIN_PANEL = "panel_main"
  const USER_PAGE = "/user/:id([0-9]+)"
  const USER_PANEL = "panel_user"
  startGlobalRouter({
    [MAIN_PAGE]: new Page(MAIN_PANEL),
    [USER_PAGE]: new Page(USER_PANEL),
  } as RouteList);

  const r = getCurrentRoute();
  expect(r.getPageId()).toBe(MAIN_PAGE)
  expect(r.getPanelId()).toBe(MAIN_PANEL)

  pushPage(USER_PAGE, {id: "15"})
  const r1 = getCurrentRoute();
  expect(r1.getPageId()).toBe(USER_PAGE);
  expect(r1.getPanelId()).toBe(USER_PANEL);
  expect(r1.getParams()).toHaveProperty("id", "15")
});


test('route basic with enter leave callback', (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const MAIN_PAGE = "/"
  const MAIN_PANEL = "panel_main"
  const USER_PAGE = "/user/:id([0-9]+)"
  const USER_PANEL = "panel_user"
  let mainEnterCalls = 0
  let mainLeaveCalls = 0
  let userEnterCalls = 0
  let userLeaveCalls = 0
  startGlobalRouter({
    [MAIN_PAGE]: new Page(MAIN_PANEL).onEnter(() => mainEnterCalls++).onLeave(() => mainLeaveCalls++),
    [USER_PAGE]: new Page(USER_PANEL).onEnter(() => userEnterCalls++).onLeave(() => userLeaveCalls++),
  } as RouteList);

  const r = getCurrentRouteOrDef();
  expect(r.getPageId()).toBe(MAIN_PAGE)
  expect(r.getPanelId()).toBe(MAIN_PANEL)

  pushPage(USER_PAGE, {id: "15"})
  const r1 = getCurrentRouteOrDef();
  expect(r1.getPageId()).toBe(USER_PAGE);
  expect(r1.getPanelId()).toBe(USER_PANEL);
  expect(r1.getParams()).toHaveProperty("id", "15")

  popPage()

  setTimeout(() => {
    expect(mainEnterCalls).toBe(1 + 1)
    expect(mainLeaveCalls).toBe(1)
    expect(userEnterCalls).toBe(1)
    expect(userLeaveCalls).toBe(1)
    done()
  }, 150)
});