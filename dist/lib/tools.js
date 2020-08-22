"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preventBlinkingBySettingScrollRestoration = preventBlinkingBySettingScrollRestoration;

/**
 * @ignore
 */
function preventBlinkingBySettingScrollRestoration() {
  if ('scrollRestoration' in window.history && window.history.scrollRestoration === 'auto') {
    window.history.scrollRestoration = 'manual';
  }
}