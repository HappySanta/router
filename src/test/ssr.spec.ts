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
});
