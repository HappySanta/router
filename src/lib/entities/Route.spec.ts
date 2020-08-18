import {Page} from "./Page";
import {Route} from "./Route";
import {RouteList} from "./Router";


test('from location', () => {
  const list: RouteList = {
    "/": new Page()
  }
  const location = ""
  expect(!!Route.fromLocation(list, location)).toBe(true)
  expect(!!Route.fromLocation(list, location, true)).toBe(true)
})