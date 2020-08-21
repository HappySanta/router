/**
 * @ignore
 */
export function preventBlinkingBySettingScrollRestoration() {
  if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
    window.history.scrollRestoration = 'manual'
  }
}
