import { Router } from '../lib/entities/Router';
import { Page } from '../lib/entities/Page';

describe('navigateInSearch', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/');
  });

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

    router.pushPage('/user');

    {
      const location = router.getCurrentLocation();
      expect(location.getPanelId()).toBe('user');
    }
  });

  it('restore fine', () => {
    const router = new Router({
      '/': new Page('main', 'main', 'main'),
      '/user/:id([0-9]+)': new Page('user', 'user', 'user'),
    }, {
      navigateInHash: false,
    });

    window.history.replaceState({}, '', '/user/15?name=ivan&age=12#title');

    router.start();

    const location = router.getCurrentLocation();
    expect(location.getPanelId()).toBe('user');
    expect(location.getParams()).toMatchObject({ id: '15', name: 'ivan', age: '12' });
  });
});
