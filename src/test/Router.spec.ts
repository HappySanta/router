/**
 * @jest-environment jsdom
 */

import { Router } from '../lib/entities/Router';
import { Page } from '../lib/entities/Page';
import { Route } from '../lib/entities/Route';
import { dangerousResetGlobalRouterUseForTestOnly } from '../lib/methods';
import { HistoryUpdateType } from '../lib/entities/Types';

function delay(time = 100) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

test('route basic usage', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/info': new Page('info'),
  });

  const recordEvents: Array<{ newRoute: Route; oldRoute: Route | undefined; isNewRoute: boolean; type: HistoryUpdateType }> = [];

  r.on('update', (newRoute, oldRoute, isNewRoute, type) => {
    recordEvents.push({ newRoute, oldRoute, isNewRoute, type });
  });

  r.start();
  expect(r.history.getCurrentIndex()).toBe(0);
  r.pushPage('/user');
  expect(r.history.getCurrentIndex()).toBe(1);
  await delay(10);
  r.pushPage('/info');
  expect(r.history.getCurrentIndex()).toBe(2);
  await delay(10);
  r.popPage();
  await delay(10);
  expect(r.history.getCurrentIndex()).toBe(1);
  r.replacePage('/info');
  await delay(10);
  expect(r.history.getCurrentIndex()).toBe(1);

  setTimeout(() => {
    // одно событие update приходит после старта роутера
    expect(recordEvents.length).toBe(4 + 1);
    expect(recordEvents[0].isNewRoute).toBeTruthy();
    expect(recordEvents[1].isNewRoute).toBeTruthy();
    expect(recordEvents[2].isNewRoute).toBeTruthy();
    expect(recordEvents[3].isNewRoute).toBeFalsy();
    expect(recordEvents[4].isNewRoute).toBeTruthy();
    done();
    r.stop();
  }, 10);
});

test('route first page push', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/info': new Page('info'),
  });

  r.start();
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(true); // После старта страница всегда first
  r.pushPage('/info');
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(false); // После push страница всегда не будет first
  r.popPage();
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Вернулись назад на первую страницу, она была и осталась first
  r.stop();
  done();
});

test('route first page replace', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/info': new Page('info'),
  });

  r.start();
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(true); // После старта страница всегда first
  r.replacePage('/info');
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Мы заменили first страницу на какую-то другу, она осталась first
  r.pushPage('/user');
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(false); // Был push страница уже не first
  r.popPage();
  await delay(100);
  expect(r.getCurrentLocation().isFirstPage()).toBe(true); // Вернулись обратно на first страницу
  r.stop();
  done();
});

test('check history', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page('main', 'main'),
    '/user': new Page('user', 'main'),
    '/info': new Page('info', 'main'),
    '/create': new Page('create', 'create'),
    '/done': new Page('done', 'create'),
  });

  r.start();

  expect(r.getCurrentLocation().getViewHistory('main')).toEqual(['main']);
  expect(r.getCurrentLocation().getPanelId()).toBe('main');
  expect(r.getCurrentLocation().getViewId()).toBe('main');
  r.pushPage('/user');
  expect(r.getCurrentLocation().getViewHistory('main')).toEqual(['main', 'user']);
  expect(r.getCurrentLocation().getPanelId()).toBe('user');
  expect(r.getCurrentLocation().getViewId()).toBe('main');
  r.pushPage('/info');
  expect(r.getCurrentLocation().getViewHistory('main')).toEqual(['main', 'user', 'info']);
  expect(r.getCurrentLocation().getPanelId()).toBe('info');
  expect(r.getCurrentLocation().getViewId()).toBe('main');
  r.pushPage('/create');
  expect(r.getCurrentLocation().getViewHistory('main')).toEqual(['info']);
  expect(r.getCurrentLocation().getViewHistory('create')).toEqual(['create']);
  expect(r.getCurrentLocation().getPanelId()).toBe('create');
  expect(r.getCurrentLocation().getViewId()).toBe('create');
  r.pushPage('/done');
  expect(r.getCurrentLocation().getViewHistory('create')).toEqual(['create', 'done']);
  expect(r.getCurrentLocation().getViewHistory('main')).toEqual(['info']);
  expect(r.getCurrentLocation().getPanelId()).toBe('done');
  expect(r.getCurrentLocation().getViewId()).toBe('create');
  expect(r.getCurrentLocation().getLastPanelInView('main')).toBe('info');
  r.popPage();
  await delay(100);
  expect(r.getCurrentLocation().getViewHistory('create')).toEqual(['create']);
  expect(r.getCurrentLocation().getLastPanelInView('main')).toBe('info');

  r.stop();
  done();
});

test('route preventSameLocationChange', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/info': new Page('info'),
  }, { preventSameLocationChange: true });

  r.start();
  expect(r.history.getCurrentIndex()).toBe(0);
  r.pushPage('/user');
  expect(r.history.getCurrentIndex()).toBe(1);
  await delay(10);

  // Пушим точно такую же страницу, ничего не должно произойти
  let wasUpdates = false;
  r.once('update', () => wasUpdates = true);
  r.pushPage('/user');
  expect(r.history.getCurrentIndex()).toBe(1);
  expect(wasUpdates).toBe(false);
  done();
});

test('fixBrokenHistory', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/product': new Page('user'),
  });
  r.start();
  r.pushPage('/user');
  r.pushPage('/product');

  // Эмитируем открытие м закрытие левого приложения
  window.history.pushState(null, 'OTHER PAGE OPEN', '#PAGE OPEN');

  r.fixBrokenHistory();
  expect(r.getCurrentLocation().getPageId()).toBe('/product');
  r.popPage();
  await r.afterUpdate();
  expect(r.getCurrentLocation().getPageId()).toBe('/user');
  done();
});

test('popPageToAndReplace', async (done) => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/product': new Page('user'),
    '/done': new Page('done'),
  });
  r.start();
  r.pushPage('/user');
  r.pushPage('/product');

  r.popPageToAndReplace(-2, '/done', {});
  await r.afterUpdate();

  expect(r.history.getCurrentIndex()).toBe(0);
  await done();
});

test('get locations', () => {
  dangerousResetGlobalRouterUseForTestOnly();
  const r = new Router({
    '/': new Page(),
    '/user': new Page('user'),
    '/product': new Page('user'),
    '/done': new Page('done'),
  });
  r.start();

  expect(r.getPageLocation('/')).toBe('#/');
  expect(r.getPageLocation('/product')).toBe('#/product');
  expect(r.getPageLocation('/product', { id: '1' })).toBe('#/product?id=1');
  expect(r.getModalLocation('hello')).toBe('#/?m=hello');
  expect(r.getPopupLocation('world')).toBe('#/?p=world');
  expect(r.getModalLocation('hello', { name: 'ivan' })).toBe('#/?m=hello&name=ivan');
  expect(r.getPopupLocation('world', { age: '25' })).toBe('#/?p=world&age=25');

  r.pushPage('/product');

  expect(r.getPopupLocation('world', { age: '25' })).toBe('#/product?p=world&age=25');
});
