/**
 * @ignore
 * @packageDocumentation
 */

/**
 * @ignore
 */
export function preventBlinkingBySettingScrollRestoration() {
  if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
    window.history.scrollRestoration = 'manual';
  }
}

/**
 * @ignore
 * @param WrappedComponent
 */
export function getDisplayName(WrappedComponent: {displayName?: string;name?: string}) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function isDesktopSafari(): boolean {
  const ua = window.navigator.userAgent;
  return ua.indexOf('AppleWebKit/') > 0 && ua.indexOf('Safari/') > 0;
}
