import matchPath from "./tools";

test('matchPath / and /', () => {
  expect(!!matchPath('/', '/')).toBe(true)
})

test('matchPath page with variable', () => {
  expect(!!matchPath('/123', '/:id([0-9]+)')).toBe(true)
})

test('matchPath page with const', () => {
  expect(!!matchPath('/main', '/main')).toBe(true)
})

test('matchPath page no match', () => {
  expect(!!matchPath('/main', '/user')).toBe(false)
})