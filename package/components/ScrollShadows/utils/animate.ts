import { getClass } from ".";
import { LocalState } from "../../../types";

export const animateShadow = (
  state: LocalState,
  shadowEl: HTMLElement,
  isVisible: boolean,
  type: "before" | "after"
) => {
  const { props, init, onToggleShadow, scrollableContainer } = state;
  const { animation } = props;
  const shadowContainerEl = shadowEl;

  shadowEl = animation
    ? (shadowEl.firstElementChild?.firstElementChild as HTMLElement)
    : shadowEl;

  const cbResult = onToggleShadow
    ? onToggleShadow({
        type,
        shadowEl: animation
          ? shadowEl
          : (shadowEl.firstElementChild?.firstElementChild as HTMLElement),
        shadowContainerEl,
        active: isVisible,
        init,
        scrollContainerEl: scrollableContainer,
      })
    : false;

  if (cbResult) return;

  if (animation) {
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

  shadowEl.classList.add(...getClass(type, props.shadowsClass).split(" "));

  if (init) {
    shadowEl!.style.transition = "none";
  } else {
    shadowEl!.style.transition = "opacity 400ms";
  }

  shadowEl!.style.opacity = isVisible ? "1" : "0";
};
