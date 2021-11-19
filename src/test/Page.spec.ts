import { Page } from '../lib/entities/Page';

test('page clone', () => {
  const page = new Page('vew_main', 'panel_main');

  expect(JSON.stringify(page)).toEqual( JSON.stringify(page.clone()) );

  const page2 = new Page('vew_main', 'panel_main').makeInfinity();

  expect(JSON.stringify(page2)).toEqual( JSON.stringify(page2.clone()) );
});
