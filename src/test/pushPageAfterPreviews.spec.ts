import {dangerousResetGlobalRouterUseForTestOnly, Page, Router} from "..";

function delay(time = 20) {
  return new Promise(resolve => setTimeout(resolve, time))
}

describe("pushPageAfterPreviews", () => {

  beforeEach(() => {
    dangerousResetGlobalRouterUseForTestOnly()
  })

  it("simple", async (done) => {
    const r = new Router({
      "/": new Page("main", "main"),
      "/user": new Page("user", "main"),
      "/info": new Page("info", "main"),
      "/create": new Page("create", "create"),
      "/done": new Page("done", "create"),
    }, null)

    r.start()

    r.pushPage("/user")
    r.pushPage("/info")
    r.pushPage("/create")
    r.pushPage("/done")
    await delay()
    r.popPage()
    await delay()
    expect(r.getCurrentRouteOrDef().getPageId()).toBe("/create")
    r.pushPageAfterPreviews("/", "/done")
    await delay()
    expect(r.getCurrentRouteOrDef().getPageId()).toBe("/done")
    r.popPage()
    await delay()
    expect(r.getCurrentRouteOrDef().getPageId()).toBe("/")
    done()
  })

})
