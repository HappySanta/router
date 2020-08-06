/**
 * @jest-environment jsdom
 */

import {HistoryUpdateType, Router} from "./Router";
import {Page} from "./Page";
import {Route} from "./Route";

function delay(time = 100) {
  return new Promise(resolve => setTimeout(resolve, time))
}

test('route basic usage', async (done) => {
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
  }, 10)
})


test('route first page push', async (done) => {
  const r = new Router({
    "/": new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  r.start()
  await delay(100)
  expect(r.isFirstPage()).toBe(true) // После старта страница всегда first
  r.pushPage("/info")
  await delay(100)
  expect(r.isFirstPage()).toBe(false) // После push страница всегда не будет first
  r.popPage()
  await delay(100)
  expect(r.isFirstPage()).toBe(true) // Вернулись назад на первую страницу, она была и осталась first
  done()
})

test('route first page replace', async (done) => {
  const r = new Router({
    "/": new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  r.start()
  await delay(100)
  expect(r.isFirstPage()).toBe(true) // После старта страница всегда first
  r.replacePage("/info")
  await delay(100)
  expect(r.isFirstPage()).toBe(true) // Мы заменили first страницу на какую-то другу, она осталась first
  r.pushPage("/user")
  await delay(100)
  expect(r.isFirstPage()).toBe(false) // Был push страница уже не first
  r.popPage()
  await delay(100)
  expect(r.isFirstPage()).toBe(true) // Вернулись обратно на first страницу
  done()
})