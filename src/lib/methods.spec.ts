/**
 * @jest-environment jsdom
 */
import {getCurrentRoute, pushPage, startGlobalRouter} from "./methods";
import { Page } from "./entities/Page";
import {RouteList} from "./entities/Router";


test('route basic usage', () => {
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

  pushPage(USER_PAGE, {id:"15"})
  const r1 = getCurrentRoute();
  expect(r1.getPageId()).toBe(USER_PAGE);
  expect(r1.getPanelId()).toBe(USER_PANEL);
  expect(r1.getParams()).toHaveProperty("id", "15")
});