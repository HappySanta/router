import React from 'react';
import {
  Page,
  RouteList,
  Router,
  RouterContext,
  RouterParams,
  RouterProps,
  ThrottlingRouterProps,
  withParams,
  withRouter,
  withThrottlingRouter,
} from '..';
import { act, cleanup, render } from '@testing-library/react';
import { delay } from './tools';

describe('HOC', () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/#');
  });

  test('withRouter hoc', () => {
    const list: RouteList = {
      '/': new Page('panel_main'),
      '/user': new Page('panel_user'),
    };

    class MainBlank extends React.Component<RouterProps> {
      render() {
        const { location } = this.props;
        const first = location.isFirstPage();
        return <span>{`Hello world: ${location.getPanelId()} ${first ? 'first_page' : ''}`}</span>;
      }
    }

    const Main = withRouter(MainBlank);

    const router = new Router(list);
    router.start();

    const component = render(
      <RouterContext.Provider value={router}>
        <Main />
      </RouterContext.Provider>,
    );

    expect(component.queryByText(/panel_main/i)).toBeTruthy();
    expect(component.queryByText(/first_page/i)).toBeTruthy();

    act(() => {
      router.pushPage('/user');
    });

    expect(component.queryByText(/panel_user/i)).toBeTruthy();
    expect(component.queryByText(/first_page/i)).toBeFalsy();

    router.stop();
  });

  test('withThrottlingRouter hoc', async (done) => {
    const list: RouteList = {
      '/': new Page('panel_main'),
      '/user': new Page('panel_user'),
    };

    const router = new Router(list);
    router.start();

    class MainBlank extends React.Component<ThrottlingRouterProps> {
      render() {
        const { location } = this.props;
        const first = location.isFirstPage();
        return <span>{`Hello world: ${location.getPanelId()} ${first ? 'first_page' : ''}`}</span>;
      }
    }

    const Main = withThrottlingRouter(MainBlank);

    const component = render(
      <RouterContext.Provider value={router}>
        <Main />
      </RouterContext.Provider>,
    );

    expect(component.queryByText(/panel_main/i)).toBeTruthy();
    expect(component.queryByText(/first_page/i)).toBeTruthy();

    await act(async () => {
      router.pushPage('/user');
      await delay(1000);
    });

    expect(component.queryByText(/panel_user/i)).toBeTruthy();
    expect(component.queryByText(/first_page/i)).toBeFalsy();
    router.stop();
    done();
  });

  test('withPrams hoc', () => {
    const list: RouteList = {
      '/': new Page('panel_main'),
      '/user': new Page('panel_user'),
    };

    const router = new Router(list);
    router.start();

    class MainBlank extends React.Component<RouterParams> {
      render() {
        const { age } = this.props.params;
        return <span>age:{age || 'no'}</span>;
      }
    }

    const Main = withParams(MainBlank);

    const component = render(
      <RouterContext.Provider value={router}>
        <Main />
      </RouterContext.Provider>,
    );

    expect(component.queryByText(/age:no/i)).toBeTruthy();

    act(() => {
      router.pushPage('/user', { age: '12' });
    });

    const component2 = render(
      <RouterContext.Provider value={router}>
        <Main />
      </RouterContext.Provider>,
    );

    expect(component2.queryByText(/age:12/i)).toBeTruthy();
    router.stop();
  });
});
