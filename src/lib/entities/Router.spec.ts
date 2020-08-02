/**
 * @jest-environment jsdom
 */

import {HistoryUpdateType, Router} from "./Router";
import {Page} from "./Page";
import {Route} from "./Route";

function delay(time = 100) {
  return new Promise(resolve => setTimeout(resolve,time))
}

test('route basic usage', async (done) => {
  const r = new Router({
    "/":new Page(),
    "/user": new Page("user"),
    "/info": new Page("info"),
  }, null)

  const recordEvents:{newRoute:Route, oldRoute:Route|undefined, isNewRoute:boolean, type: HistoryUpdateType}[] = []

  r.on("update", ((newRoute, oldRoute, isNewRoute, type) => {
    recordEvents.push({newRoute,oldRoute,isNewRoute, type})
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

  setTimeout( () => {
    // одно событие update приходит после старта роутера
    expect(recordEvents.length).toBe(4 + 1)
    expect(recordEvents[0].isNewRoute).toBeTruthy()
    expect(recordEvents[1].isNewRoute).toBeTruthy()
    expect(recordEvents[2].isNewRoute).toBeTruthy()
    expect(recordEvents[3].isNewRoute).toBeFalsy()
    expect(recordEvents[4].isNewRoute).toBeTruthy()
    done()
  }, 10 )
})