import { dangerousResetGlobalRouterUseForTestOnly, Page, Router } from '..';

function delay(time = 30) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

describe('pushPageAfterPreviews', () => {
  beforeEach(() => {
    dangerousResetGlobalRouterUseForTestOnly();
    window.history.replaceState({}, '', '/#');
  });

  it('simple', async (done) => {
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
    r.popPage();
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/create');
    r.pushPageAfterPreviews('/', '/done');
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
    r.popPage();
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');
    done();
  });

  it('complex', async (done) => {
    const r = new Router({
      '/': new Page('main', 'main'),
      '/user': new Page('user', 'main'),
      '/info': new Page('info', 'main'),
      '/create': new Page('create', 'main'),
      '/done': new Page('done', 'main'),
    }, null);

    r.start();

    r.pushPage('/user');
    r.pushPage('/info');
    r.pushPage('/create');
    r.pushPage('/done');
    await delay();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');

    const updateCallback = jest.fn();
    r.on('update', updateCallback);
    r.pushPageAfterPreviews('/', '/done');
    await r.afterUpdate();
    r.off('update', updateCallback);
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');
    expect(r.history.getLength()).toBe(2);
    expect(updateCallback).toHaveBeenCalled();

    r.pushPageAfterPreviews('/info', '/create'); // Тут страницы /info у нас нет, это обычный push
    await r.afterUpdate();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/create');
    expect(r.history.getLength()).toBe(3);

    r.popPage();
    await r.afterUpdate();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/done');

    r.popPage();
    await r.afterUpdate();
    expect(r.getCurrentRouteOrDef().getPageId()).toBe('/');

    done();
  });

  it('save correct activePanel', async (done) => {
    const r = new Router({
      '/': new Page('main', 'main'),
      '/user': new Page('user', 'main'),
      '/info': new Page('info', 'main'), // 2
      '/create': new Page('create', 'create'),
      '/done': new Page('done', 'create'), // 1
    }, null);

    r.start();

    expect(r.getCurrentLocation().getViewActivePanel('create')).toBe(undefined);
    r.pushPage('/user');
    r.pushPage('/info');
    r.pushPage('/create');
    expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('create');
    r.pushPage('/done');

    expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('done');

    expect(r.getCurrentLocation().getViewActivePanel('main')).toBe('info');

    r.popPageTo('/');
    await r.afterUpdate();

    expect(r.getCurrentLocation().getViewActivePanel('create')).toBe('done');
    done();
  });
});
