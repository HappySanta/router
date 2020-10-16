import { generatePath, matchPath } from './workWithPathRegexp';

describe('matchPath', () => {
  test('/ and /', () => {
    expect(!!matchPath('/', '/')).toBe(true);
  });

  test('/ and /user be false', () => {
    expect(!!matchPath('/', '/user')).toBe(false);
  });

  test('page with variable', () => {
    expect(!!matchPath('/123', '/:id([0-9]+)')).toBe(true);
  });

  test('page with variable not', () => {
    expect(!!matchPath('/gam', '/:id([0-9]+)')).toBe(false);
  });

  test('/main math /main', () => {
    expect(!!matchPath('/main', '/main')).toBe(true);
  });

  test('/clevel NOT match /main', () => {
    expect(!!matchPath('/clevel', '/main')).toBe(false);
  });

  test('/about/info NOT match /about', () => {
    expect(!!matchPath('/about/info', '/about')).toBe(false);
  });

  test('/about NOT match /about/info', () => {
    expect(!!matchPath('/about', '/about/info')).toBe(false);
  });

  test('generatePath simple', () => {
    expect(generatePath('user', {})).toEqual('user');
  });

  test('generatePath params', () => {
    expect(generatePath('user/:id', { id: 5 })).toEqual('user/5');
  });

  test('generatePath params and slash', () => {
    expect(generatePath('/user/:id', { id: 5 })).toEqual('/user/5');
  });

  test('generatePath inline and additional params', () => {
    expect(generatePath('user/:id', { id: 19, name: 'Ivan' })).toEqual('user/19?name=Ivan');
  });

  test('generatePath only additional params', () => {
    expect(generatePath('user', { id: 19, name: 'Ivan' })).toEqual('user?id=19&name=Ivan');
  });

  test('generatePath edge case 1', () => {
    expect(generatePath('', {})).toEqual('');
  });

  test('generatePath edge case 2', () => {
    expect(generatePath('/', {})).toEqual('/');
  });

  test('generatePath edge case 3', () => {
    expect(generatePath('/:name', { name: 'Ivan' })).toEqual('/Ivan');
  });

  test('generatePath edge case 4', () => {
    expect(generatePath('/:name', { name: 'Ivan', id: '9' })).toEqual('/Ivan?id=9');
  });

  test('generatePath edge case 5', () => {
    expect(generatePath('/', { id: '9' })).toEqual('/?id=9');
  });
});
