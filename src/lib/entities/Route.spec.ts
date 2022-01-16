import { Page } from './Page';
import { Route } from './Route';
import { RouteList } from './Router';

test('from location', () => {
  const list: RouteList = {
    '/': new Page(),
  };
  {
    const location = '';
    expect(!!Route.fromLocation(list, location)).toBe(true);
    expect(!!Route.fromLocation(list, location, true)).toBe(true);
  }
  {
    const location = '/';
    expect(!!Route.fromLocation(list, location)).toBe(true);
    expect(!!Route.fromLocation(list, location, true)).toBe(true);
  }
  {
    const location = '/?utm_source=ad';
    expect(!!Route.fromLocation(list, location)).toBe(true);
    expect(!!Route.fromLocation(list, location, true)).toBe(true);
  }
});

test('route clone', () => {
  const page = new Page('vew_main', 'panel_main').makeInfinity();
  const route = new Route(page, '/', { id: '15' });

  expect(JSON.stringify(route)).toEqual( JSON.stringify(route.clone()) );
});
