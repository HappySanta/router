import { dangerousResetGlobalRouterUseForTestOnly, Page, Router } from '..';
import { delay } from './tools';

describe('popPageTo', () => {
  beforeEach(() => {
    dangerousResetGlobalRouterUseForTestOnly();
    window.history.replaceState({}, '', '/#');
  });

  it('move to expected', async (done) => {
    const r = new Router({
      '/': new Page('main', 'main'),
      '/user': new Page('user', 'main'),
      '/info': new Page('info', 'main'),
      '/create': new Page('create', 'create'),
      '/done': new Page('done', 'create'),
    }, null);

    r.start();

    r.pushPage('/user');
    r.pushPage('/info');
    r.pushPage('/create');
    r.pushPage('/done');
    await delay();
    r.popPageTo('/info');
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/info');
    r.popPage();
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/user');
    r.pushPage('/info');
    r.pushPage('/create');
    r.pushPage('/done');
    await delay();
    r.popPageTo('/user');
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/user');
    r.popPage();
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');
    done();
  });
});
