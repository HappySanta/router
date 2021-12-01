import { Page, Router } from '..';
import { delay } from './tools';

describe('restoreFromCache', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/#');
  });

  it('firstPageCHeckWorked', async (done) => {
    const USER_PAGE = '/user/:id([0-9]+)';
    const r = new Router({
      '/': new Page('main', 'main'),
      [USER_PAGE]: new Page('user', 'main'),
      '/info': new Page('info', 'main'),
      '/create': new Page('create', 'main'),
      '/done': new Page('done', 'main'),
    });

    r.start();

    expect(r.getCurrentLocation().isFirstPage()).toBeTruthy();

    r.pushPage('/info');

    expect(r.getCurrentLocation().getPageId()).toBe('/info');
    expect(r.getCurrentLocation().isFirstPage()).toBeFalsy();

    window.location.hash = '#user/12';

    await delay();
    expect(r.getCurrentLocation().isFirstPage()).toBeTruthy();
    expect(r.getCurrentLocation().getPageId()).toBe(USER_PAGE);
    expect(r.getCurrentLocation().getParams()).toMatchObject({
      id: '12',
    });

    done();
  });
});
