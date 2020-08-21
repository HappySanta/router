/**
 * @jest-environment jsdom
 */

import {Router} from "./Router";
import {Page} from "./Page";
import {Route} from "./Route";
import {dangerousResetGlobalRouterUseForTestOnly} from "../methods";
import {HistoryUpdateType} from "./Types";

function delay(time = 100) {
  return new Promise(resolve => setTimeout(resolve, time))
}

test('route basic usage', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly()
  const r = new Router({
    "/": new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  const recordEvents: { newRoute: Route, oldRoute: Route | undefined, isNewRoute: boolean, type: HistoryUpdateType }[] = []

  r.on("update", ((newRoute, oldRoute, isNewRoute, type) => {
    recordEvents.push({newRoute, oldRoute, isNewRoute, type})
  }))

  r.start()

  r.pushPage("/user")
  await delay(10)
  r.pushPage("/info")
  await delay(10)
  r.popPage()
  await delay(10)
  r.replacePage("/info")
  await delay(10)

  setTimeout(() => {
    // одно событие update приходит после старта роутера
    expect(recordEvents.length).toBe(4 + 1)
    expect(recordEvents[0].isNewRoute).toBeTruthy()
    expect(recordEvents[1].isNewRoute).toBeTruthy()
    expect(recordEvents[2].isNewRoute).toBeTruthy()
    expect(recordEvents[3].isNewRoute).toBeFalsy()
    expect(recordEvents[4].isNewRoute).toBeTruthy()
    done()
    r.stop()
  }, 10)
})


test('route first page push', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly()
  const r = new Router({
    "/": new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  r.start()
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(true) // После старта страница всегда first
  r.pushPage("/info")
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(false) // После push страница всегда не будет first
  r.popPage()
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(true) // Вернулись назад на первую страницу, она была и осталась first
  r.stop()
  done()
})

test('route first page replace', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly()
  const r = new Router({
    "/": new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  r.start()
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(true) // После старта страница всегда first
  r.replacePage("/info")
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(true) // Мы заменили first страницу на какую-то другу, она осталась first
  r.pushPage("/user")
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(false) // Был push страница уже не first
  r.popPage()
  await delay(100)
  expect(r.getCurrentLocation().isFirstPage()).toBe(true) // Вернулись обратно на first страницу
  r.stop()
  done()
})


test("check history", async (done) => {
  dangerousResetGlobalRouterUseForTestOnly()
  const r = new Router({
    "/": new Page("main", "main"),
    "/user": new Page("user", "main"),
    "/info": new Page("info", "main"),
    "/create": new Page("create", "create"),
    "/done": new Page("done", "create"),
  }, null)

  r.start()

  expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main"])
  expect(r.getCurrentLocation().getPanelId()).toBe("main")
  expect(r.getCurrentLocation().getViewId()).toBe("main")
  r.pushPage("/user")
  expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main", "user"])
  expect(r.getCurrentLocation().getPanelId()).toBe("user")
  expect(r.getCurrentLocation().getViewId()).toBe("main")
  r.pushPage("/info")
  expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["main", "user", "info"])
  expect(r.getCurrentLocation().getPanelId()).toBe("info")
  expect(r.getCurrentLocation().getViewId()).toBe("main")
  r.pushPage("/create")
  expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["info"])
  expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create"])
  expect(r.getCurrentLocation().getPanelId()).toBe("create")
  expect(r.getCurrentLocation().getViewId()).toBe("create")
  r.pushPage("/done")
  expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create", "done"])
  expect(r.getCurrentLocation().getViewHistory("main")).toEqual(["info"])
  expect(r.getCurrentLocation().getPanelId()).toBe("done")
  expect(r.getCurrentLocation().getViewId()).toBe("create")
  expect(r.getCurrentLocation().getLastPanelInView("main")).toBe("info")
  r.popPage()
  await delay(100)
  expect(r.getCurrentLocation().getViewHistory("create")).toEqual(["create"])
  expect(r.getCurrentLocation().getLastPanelInView("main")).toBe("info")

  r.stop()
  done()
})