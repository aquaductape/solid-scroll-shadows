import { getClass } from "./getClass";
import { LocalState } from "../../../types";

export const animateShadow = (
  state: LocalState,
  shadowEl: HTMLElement,
  isVisible: boolean,
  type: "before" | "after",
  shadowInit: boolean
) => {
  const { props, init, scrollableContainer, direction } = state;
  const { animation } = props;
  const shadowContainerEl = shadowEl;

  shadowEl = animation
    ? (shadowEl.firstElementChild?.firstElementChild as HTMLElement)
    : (shadowEl.firstElementChild?.firstElementChild as HTMLElement);

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

  if (shadowInit) {
    shadowContainerEl!.style.transition = "none";
  } else {
    shadowContainerEl!.style.transition = "opacity 250ms";
  }

  shadowContainerEl!.style.opacity = isVisible ? "1" : "0";
};
