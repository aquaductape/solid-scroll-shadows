import { LocalState } from "../../../types";

export const animateShadow = (
  state: LocalState,
  shadowEl: HTMLElement,
  isVisible: boolean
) => {
  const { props, init } = state;
  const { animation } = props;

  if (animation) {
    shadowEl = shadowEl.firstElementChild?.firstElementChild! as HTMLElement;
    shadowEl.style.transition = init ? "none" : "";

    if (isVisible) {
      shadowEl.classList.add(animation.enterClass);
      shadowEl.classList.remove(animation.exitClass);
    } else {
      shadowEl.classList.remove(animation.enterClass);
      shadowEl.classList.add(animation.exitClass);
    }
    return;
  }

  shadowEl!.style.opacity = isVisible ? "1" : "0";
};
