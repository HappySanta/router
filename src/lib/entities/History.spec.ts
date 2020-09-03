import { History } from './History';
import { Route } from './Route';
import { State, stateFromLocation } from './State';
import { Page } from './Page';

function getRoute() {
  return new Route(new Page('main', 'main'), '/', {});
}

function getState(): State {
  return stateFromLocation(0);
}

describe('History', () => {
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
