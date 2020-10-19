import { delay, noop } from './tools';
import {
  getInfinityPanelId,
  isInfinityPanel,
  Page,
  RouteList,
  Router,
  RouterContext,
  useRouter,
  useThrottlingLocation,
} from '..';
import React from 'react';
import Root from '@vkontakte/vkui/dist/components/Root/Root';
import View from '@vkontakte/vkui/dist/components/View/View';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import { act, render } from '@testing-library/react';
import ConfigProvider from '@vkontakte/vkui/dist/components/ConfigProvider/ConfigProvider';

describe('dynamic panels', () => {
  test('work with fast back press', async (done) => {
    // scrollTo is not implemented
    Object.defineProperty(global.window, 'scrollTo', { value: noop });

    const PAGE_MAIN = '/';
    const PAGE_PLAYER = '/player/:id([0-9]+)';

    const VIEW_MAIN = 'view_main';
    const PANEL_MAIN = 'panel_main';
    const PANEL_PLAYER = 'panel_player';

    const list: RouteList = {
      [PAGE_MAIN]: new Page(PANEL_MAIN, VIEW_MAIN),
      [PAGE_PLAYER]: new Page(PANEL_PLAYER, VIEW_MAIN).makeInfinity(),
    };

    const Main: React.FC = () => {
      const [location, onTransition] = useThrottlingLocation();
      const router = useRouter(false);
      const panelList = [
        <Panel id={PANEL_MAIN} key={PANEL_MAIN} data-testid={PANEL_MAIN}>{PANEL_MAIN}</Panel>,
        ...router.getInfinityPanelList(VIEW_MAIN).map((panelId) => {
          if (isInfinityPanel(panelId)) {
            const type = getInfinityPanelId(panelId);
            if (type === PANEL_PLAYER) {
              return <Panel key={panelId}
                data-testid="dynamic"
                id={panelId}>{panelId}</Panel>;
            }
          }
          return null;
        }).filter((x) => !!x),
      ];

      // console.log('render', location.getViewHistoryWithLastPanel(VIEW_MAIN))

      return (
        <Root onTransition={() => onTransition()} activeView={location.getViewId()}>
          <View onTransition={() => onTransition()}
            activePanel={location.getViewActivePanel(VIEW_MAIN)}
            history={location.getViewHistory(VIEW_MAIN)}
            id={VIEW_MAIN}>
            {panelList}
          </View>
        </Root>
      );
    };

    const router = new Router(list);
    router.start();

    const component = render(
      <ConfigProvider transitionMotionEnabled={true}>
        <RouterContext.Provider value={router}>
          <Main />
        </RouterContext.Provider>,
      </ConfigProvider>,
    );

    const expectPanel = async (panel: string) => {
      expect(await component.findByTestId(panel)).toBeTruthy();
    };

    const expectInfinityPanel = async (panel: string) => {
      const panel2 = await component.findByTestId('dynamic');
      expect(panel2.innerHTML).toContain(panel);
    };

    await expectPanel(PANEL_MAIN);

    const PUSH_COUNT = 7;

    for (let i = 1; i < PUSH_COUNT; i++) {
      await act(async () => {
        router.pushPage(PAGE_PLAYER, { id: `1${i.toString()}` });
        await delay(400);
      });

      await expectInfinityPanel(PANEL_PLAYER);
    }

    // console.log("PUSH DONE")
    await delay(350);

    await act(async () => {
      for (let i = 1; i < PUSH_COUNT; i++) {
        router.popPage();
        await delay(1);
      }
      // console.log("POP DONE")
      await delay(950);
    });

    await expectPanel(PANEL_MAIN);

    done();
  });
});
