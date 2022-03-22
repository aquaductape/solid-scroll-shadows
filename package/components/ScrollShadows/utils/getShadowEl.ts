export const getShadowEl = ({
  shadowEl,
  hasShadowEl,
  animated,
}: {
  shadowEl: HTMLElement;
  hasShadowEl: boolean;
  animated: boolean;
}) => {
  if (!hasShadowEl) return null;

  return animated
    ? (shadowEl.firstElementChild?.firstElementChild as HTMLElement)
    : (shadowEl.firstElementChild?.firstElementChild as HTMLElement);
};
