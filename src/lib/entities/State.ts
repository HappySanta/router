export interface State {
  i: string,
  history: string[],
  panelInView: { [key: string]: string },
  length: number, //window.history.length;
  index: number, //ourIndex;
  blank: 0 | 1,
  first: 0 | 1,
}


let randomIdForCheckState = (Math.random() * 2000000) + "." + Date.now();

export function __testResetHistoryUniqueId() {
  randomIdForCheckState = (Math.random() * 2000000) + "." + Date.now();
}


export function stateFromLocation(currentIndex: number): State {
  const state = window.history.state;
  if (state && typeof state == "object") {
    const s = state as State;
    if (s.i === randomIdForCheckState) {
      return {...s}
    }
  }
  return {
    blank: 1,
    first: 0,
    length: window.history.length,
    index: currentIndex,
    history: [],
    i: randomIdForCheckState,
    panelInView: {}
  }
}
