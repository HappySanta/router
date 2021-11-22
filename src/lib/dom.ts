export const canUseDOM = !!(
  typeof window !== 'undefined' &&
  window.document &&
  /* eslint-disable */
  window.document.createElement
  /* eslint-enable */
);
