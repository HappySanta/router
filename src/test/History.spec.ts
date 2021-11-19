import { History } from '../lib/entities/History';
import { Route } from '../lib/entities/Route';
import { State, stateFromLocation } from '../lib/entities/State';
import { Page } from '../lib/entities/Page';
import { cleanup } from '@testing-library/react';

function getRoute() {
  return new Route(new Page('main', 'main'), '/', {});
}

function getState(): State {
  return stateFromLocation(0);
}

describe('History', () => {
  afterEach(() => {
    cleanup();
    window.history.replaceState({}, '', '/#');
  });

  it('check', () => {
    const h = new History();

    expect(h.getCurrentIndex()).toEqual(0);
    expect(h.getLength()).toEqual(0);
    h.push( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(0);
    expect(h.getLength()).toEqual(1);

    h.push( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(1);
    expect(h.getLength()).toEqual(2);

    h.push( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);

    h.replace( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);

    h.push( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(3);
    expect(h.getLength()).toEqual(4);

    h.setCurrentIndex(h.getCurrentIndex() - 2);

    expect(h.getCurrentIndex()).toEqual(1);
    expect(h.getLength()).toEqual(4);

    h.push( getRoute(), getState() );
    expect(h.getCurrentIndex()).toEqual(2);
    expect(h.getLength()).toEqual(3);
  });
});
