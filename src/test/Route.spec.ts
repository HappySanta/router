import { Page } from '../lib/entities/Page';
import { Route } from '../lib/entities/Route';
import { RouteList } from '../lib/entities/Router';

describe('Route', () => {
  test('from location', () => {
    const list: RouteList = {
      '/': new Page(),
    };
    const location = '';
    expect(!!Route.fromLocation(list, location)).toBe(true);
    expect(!!Route.fromLocation(list, location, true)).toBe(true);
  });

  test('route clone', () => {
    const page = new Page('vew_main', 'panel_main').makeInfinity();
    const route = new Route(page, '/', { id: '15' });

    expect(JSON.stringify(route)).toEqual(JSON.stringify(route.clone()));
  });

  test('getParamsFromPath', () => {
    expect(Route.getParamsFromPath('?user=ivan')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('/?user=ivan')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('/hello?user=ivan')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('/hello/world?user=ivan')).toMatchObject({ user: 'ivan' });

    expect(Route.getParamsFromPath('?user=ivan#page1')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('?user=ivan#page=1')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('?user=ivan#page=1&x=1')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('?user=ivan#/x?page=1&x=1')).toMatchObject({ user: 'ivan' });

    expect(Route.getParamsFromPath('?user=ivan&age=27')).toMatchObject({ user: 'ivan', age: '27' });

    expect(Route.getParamsFromPath('/hello&user=ivan')).toMatchObject({ user: 'ivan' });
    expect(Route.getParamsFromPath('/hello&user=ivan&age=12')).toMatchObject({ user: 'ivan', age: '12' });
    expect(Route.getParamsFromPath('/hello&user=ivan&age=12#?q=1')).toMatchObject({ user: 'ivan', age: '12' });
  });
});
