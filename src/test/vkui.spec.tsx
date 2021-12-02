import React from 'react';
import { Page, RouteList, Router, RouterContext, Location, useLocation, ROOT_MAIN } from '..';
import { act, render, cleanup } from '@testing-library/react';
import { noop, delay } from './tools';
import { ConfigProvider, Root, View, Panel, Epic, Tabbar } from '@vkontakte/vkui';

describe('VKUI', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/#');
  });

  const getViewProps = (viewId: string, location: Location, defPanel: string) => {
    return {
      id: viewId,
      activePanel: location.getViewActivePanel(viewId) || defPanel,
      history: location.getViewHistory(viewId),
    };
  };

  test('VKUI integration stress test', async (done) => {
    // scrollTo is not implemented
    Object.defineProperty(global.window, 'scrollTo', { value: noop });

    const PAGE_MAIN = '/';
    const PAGE_ABOUT = '/about';
    const PAGE_ABOUT_NEXT = '/about/next';
    const PAGE_INFO = '/info';

    const PANEL_MAIN = 'panel_main';
    const PANEL_ABOUT = 'panel_about';
    const PANEL_ABOUT_NEXT = 'panel_about_next';
    const PANEL_INFO = 'panel_info';

    const VIEW_MAIN = 'view_main';
    const VIEW_ABOUT = 'view_about';
    const VIEW_INFO = 'view_info';

    const list: RouteList = {
      [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
      [PAGE_ABOUT]: new Page(PANEL_ABOUT, VIEW_ABOUT),
      [PAGE_ABOUT_NEXT]: new Page(PANEL_ABOUT_NEXT, VIEW_ABOUT),
      [PAGE_INFO]: new Page(PANEL_INFO, VIEW_INFO),
    };

    const Main: React.FC = () => {
      const location = useLocation(true);

      return (
        <Root activeView={location.getViewId()}>
          <View {...getViewProps(VIEW_MAIN, location, PANEL_MAIN)}>
            <Panel id={PANEL_MAIN} data-testid={PANEL_MAIN}>{PANEL_MAIN}</Panel>
          </View>
          <View {...getViewProps(VIEW_ABOUT, location, PANEL_ABOUT)}>
            <Panel id={PANEL_ABOUT} data-testid={PANEL_ABOUT}>{PANEL_ABOUT}</Panel>
            <Panel id={PANEL_ABOUT_NEXT} data-testid={PANEL_ABOUT_NEXT}>{PANEL_ABOUT_NEXT}</Panel>
          </View>
          <View {...getViewProps(VIEW_INFO, location, PANEL_INFO)}>
            <Panel id={PANEL_INFO} data-testid={PANEL_INFO}>{PANEL_INFO}</Panel>
          </View>
        </Root>
      );
    };

    const router = new Router(list);
    router.start();

    const component = render(
      <ConfigProvider transitionMotionEnabled={false}>
        <RouterContext.Provider value={router}>
          <Main />
        </RouterContext.Provider>,
      </ConfigProvider>,
    );

    const updateAct = async (count: number, callback: () => void) => {
      await act(() => {
        return new Promise((resolve, reject) => {
          let updates = 0;
          const update = () => {
            updates = updates + 1;
            if (updates >= count) {
              router.off('update', update);
              setTimeout(resolve, 20);
            }
          };
          router.on('update', update);
          setTimeout(() => {
            reject(new Error('Update timeout'));
          }, 2E3);

          try {
            callback();
          } catch (e) {
            reject(e);
          }
        });
      });
    };

    const expectPanel = async (panel: string) => {
      expect(await component.findByTestId(panel)).toBeTruthy();
    };

    await expectPanel(PANEL_MAIN);

    await updateAct(2, () => {
      router.pushPage(PAGE_INFO);
      router.pushPageAfterPreviews(PAGE_MAIN, PAGE_ABOUT);
    });

    await expectPanel(PANEL_ABOUT);

    await updateAct(1, () => {
      router.popPage();
    });

    await expectPanel(PANEL_MAIN);

    await updateAct(3, () => {
      router.pushPage(PAGE_ABOUT);
      router.pushPage(PAGE_ABOUT_NEXT);
      router.pushPageAfterPreviews(PAGE_MAIN, PAGE_INFO);
    });

    await expectPanel(PANEL_INFO);

    await updateAct(1, () => {
      router.popPage();
    });

    await expectPanel(PANEL_MAIN);

    await updateAct(2, () => {
      router.pushPage(PAGE_INFO);
      router.pushPageAfterPreviews(PAGE_MAIN, PAGE_INFO);
    });

    await expectPanel(PANEL_INFO);

    for (let i = 3; i > 0; --i) {
      await updateAct(1, () => {
        router.pushPageAfterPreviews(PAGE_MAIN, PAGE_ABOUT);
      });

      await expectPanel(PANEL_ABOUT);
    }

    await updateAct(1, () => {
      router.popPage();
    });

    await expectPanel(PANEL_MAIN);

    await updateAct(3, () => {
      router.pushPage(PAGE_ABOUT);
      router.pushPage(PAGE_ABOUT_NEXT);
      router.pushPage(PAGE_INFO);
    });

    await expectPanel(PANEL_INFO);

    await updateAct(1, () => {
      router.popPageTo(-3);
    });

    await expectPanel(PANEL_MAIN);

    await updateAct(3, () => {
      router.pushPage(PAGE_INFO);
      router.pushPage(PAGE_ABOUT_NEXT);
      router.pushPage(PAGE_ABOUT);
    });

    await expectPanel(PANEL_ABOUT);

    await updateAct(1, () => {
      router.popPageTo(-3);
    });

    await expectPanel(PANEL_MAIN);

    await updateAct(3, () => {
      router.pushPage(PAGE_ABOUT_NEXT);
      router.pushPage(PAGE_ABOUT);
      router.pushPage(PAGE_INFO);
    });

    await expectPanel(PANEL_INFO);

    await updateAct(1, () => {
      router.popPageTo(-3);
    });

    await expectPanel(PANEL_MAIN);

    await delay();
    cleanup();

    done();
  });

  test('VKUI Epic', async (done) => {
    // scrollTo is not implemented
    Object.defineProperty(global.window, 'scrollTo', { value: noop });

    const PAGE_MAIN = '/';
    const PAGE_ABOUT = '/about';
    const PAGE_ABOUT_NEXT = '/about/next';

    const PANEL_MAIN = 'panel_main';
    const PANEL_ABOUT = 'panel_about';
    const PANEL_ABOUT_NEXT = 'panel_about_next';

    const VIEW_MAIN = 'view_main';
    const VIEW_ABOUT = 'view_about';

    const ROOT_ABOUT = 'root_about';

    const list: RouteList = {
      [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
      [PAGE_ABOUT]: new Page(PANEL_ABOUT, VIEW_ABOUT, ROOT_ABOUT),
      [PAGE_ABOUT_NEXT]: new Page(PANEL_ABOUT_NEXT, VIEW_ABOUT, ROOT_ABOUT),
    };

    const Main: React.FC = () => {
      const location = useLocation(true);

      return (
        <Epic tabbar={<Tabbar />} activeStory={location.getRootId()}>
          <Root id={ROOT_MAIN} activeView={location.getViewId()}>
            <View {...getViewProps(VIEW_MAIN, location, PANEL_MAIN)}>
              <Panel id={PANEL_MAIN} data-testid={PANEL_MAIN}>{PANEL_MAIN}</Panel>
            </View>
          </Root>
          <Root id={ROOT_ABOUT} activeView={location.getViewId()}>
            <View {...getViewProps(VIEW_ABOUT, location, PANEL_ABOUT)}>
              <Panel id={PANEL_ABOUT} data-testid={PANEL_ABOUT}>{PANEL_ABOUT}</Panel>
              <Panel id={PANEL_ABOUT_NEXT} data-testid={PANEL_ABOUT_NEXT}>{PANEL_ABOUT_NEXT}</Panel>
            </View>
          </Root>
        </Epic>
      );
    };

    const router = new Router(list);
    router.start();

    const component = render(
      <ConfigProvider transitionMotionEnabled={false}>
        <RouterContext.Provider value={router}>
          <Main />
        </RouterContext.Provider>,
      </ConfigProvider>,
    );

    const expectPanel = async (panel: string) => {
      expect(await component.findByTestId(panel)).toBeTruthy();
    };

    await expectPanel(PANEL_MAIN);

    act(() => {
      router.pushPage(PAGE_ABOUT);
    });
    await expectPanel(PANEL_ABOUT);

    act(() => {
      router.pushPage(PAGE_ABOUT_NEXT);
    });
    await expectPanel(PANEL_ABOUT_NEXT);

    cleanup();

    done();
  });
});
