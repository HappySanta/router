import { Router } from '../lib/entities/Router';
import { Page } from '../lib/entities/Page';
import { delay } from './tools';

describe('onVKWebAppChangeFragment', () => {
  beforeEach(() => {
    window.history.replaceState({}, '', '/#');
  });

  it('after event isFirstPage is true', async (done) => {
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

    r.onVKWebAppChangeFragment('user/12');

    await delay();
    expect(r.getCurrentLocation().isFirstPage()).toBeTruthy();
    expect(r.getCurrentLocation().getPageId()).toBe(USER_PAGE);
    expect(r.getCurrentLocation().getParams()).toMatchObject({
      id: '12',
    });

    done();
  });
});
