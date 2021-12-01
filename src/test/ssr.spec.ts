/**
 * @testEnvironment node
 */

import { Router } from '../lib/entities/Router';
import { Page } from '../lib/entities/Page';

describe('SSR', () => {
  it('work fine', () => {
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
    });

    router.start();

    {
      const location = router.getCurrentLocation();
      expect(location.getPanelId()).toBe('main');
    }
  });

  it('readLocationInConstructor t1', () => {
    window.history.replaceState({}, 'Main', '/');
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
      readLocationInConstructor: true,
    });

    expect(router.getCurrentLocation().getPanelId()).toBe('main');
  });

  it('readLocationInConstructor t2', () => {
    window.history.replaceState({}, 'User', '/user');
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
      readLocationInConstructor: true,
    });

    expect(router.getCurrentLocation().getPanelId()).toBe('user');
  });

  it('readLocationInConstructor t3', () => {
    window.history.replaceState({}, 'User', '/user?p=p1&age=15');
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
      readLocationInConstructor: true,
    });

    expect(router.getCurrentLocation().getPanelId()).toBe('user');
    expect(router.getCurrentLocation().getPopupId()).toBe('p1');
    expect(router.getCurrentLocation().getParams()['age']).toBe('15');
  });

  it('readLocationInConstructor t4', () => {
    window.history.replaceState({}, 'User', '/user/19?m=open');
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user/:id([0-9]+)': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
      readLocationInConstructor: true,
    });

    expect(router.getCurrentLocation().getPanelId()).toBe('user');
    expect(router.getCurrentLocation().getModalId()).toBe('open');
    expect(router.getCurrentLocation().getParams()['id']).toBe('19');
  });
});
