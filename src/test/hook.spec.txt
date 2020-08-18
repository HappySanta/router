import React from "react";
import {Page, RouteList, Router, RouterContext, useFirstPageCheck} from '..';
import {useRouter} from "../lib/hooks/useRouter";
import {act, cleanup, render} from '@testing-library/react';

afterEach(cleanup);

function Main() {
  const router = useRouter()
  const first = useFirstPageCheck();
  return <span>{"Hello world: "+router.getPanelId() + " " + ( first ? "first_page" : "" )}</span>
}

test('use router with hook', () => {

  const list : RouteList = {
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

  act( () => {
    router.pushPage("/user")
  } )

  expect(component.queryByText(/panel_user/i)).toBeTruthy()
  expect(component.queryByText(/first_page/i)).toBeFalsy()

})