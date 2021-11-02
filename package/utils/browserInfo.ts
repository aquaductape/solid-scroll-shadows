const userAgent = (pattern: RegExp) => {
  // @ts-ignore
  if (typeof window !== "undefined" && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
};

export const isSafari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
