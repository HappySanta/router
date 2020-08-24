/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @ignore
 */
export function preventBlinkingBySettingScrollRestoration() {
  if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
    window.history.scrollRestoration = 'manual'
  }
}


/**
 * @ignore
 * @param WrappedComponent
 */
export function getDisplayName(WrappedComponent:{displayName?:string,name?:string}) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}