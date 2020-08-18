import React from "react";
import {Page, RouteList, Router, RouterContext, RouterProps, withRouter} from '..';
import {act, cleanup, render} from '@testing-library/react';

afterEach(cleanup);

class MainBlank extends React.Component<RouterProps> {

  render() {
    const {router} = this.props
    const first = router.isFirstPage()
    return <span>{"Hello world: " + router.getPanelId() + " " + (first ? "first_page" : "")}</span>
  }
}

const Main = withRouter<{}>(MainBlank)

test('use router with hoc', () => {

  const list: RouteList = {
    "/": new Page('panel_main'),
    "/user": new Page('panel_user')
  }

  const router = new Router(list)
  router.start()

  const component = render(
    <RouterContext.Provider value={router}>
      <Main/>
    </RouterContext.Provider>,
  );

  expect(component.queryByText(/panel_main/i)).toBeTruthy()
  expect(component.queryByText(/first_page/i)).toBeTruthy()

  act(() => {
    router.pushPage("/user")
  })

  expect(component.queryByText(/panel_user/i)).toBeTruthy()
  expect(component.queryByText(/first_page/i)).toBeFalsy()

})