/**
 * @ignore
 * @packageDocumentation
 */

import { canUseDOM } from './dom';

/**
 * @ignore
 */
export function preventBlinkingBySettingScrollRestoration() {
  if (canUseDOM) {
    if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
      window.history.scrollRestoration = 'manual';
    }
  }
}

/**
 * @ignore
 * @param WrappedComponent
 */
export function getDisplayName(WrappedComponent: { displayName?: string; name?: string }) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export function isDesktopSafari(): boolean {
  if (!canUseDOM) {
    return false;
  }
  const ua = window.navigator.userAgent;
  return ua.indexOf('AppleWebKit/') > 0
    && ua.indexOf('Safari/') > 0
    && !ua.includes('Chrome/')
    && !ua.includes('Mobile/')
    && !ua.includes('Android')
    && !ua.includes('iPhone');
}
