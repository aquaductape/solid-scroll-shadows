export const style = (styleModule: CSSModuleClasses, selectors: string) => {
  const selectorsArr = selectors.split(" ");
  return selectorsArr.map((item) => styleModule[item]).join(" ");
};
