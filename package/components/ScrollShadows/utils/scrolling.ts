import { LocalState } from "../../../types";
import { resetJustifyShadow } from "./justifyShadowToContentItems";

export const scrollHorizontally = (state: LocalState, e: WheelEvent) => {
  if (!state.isScrollable) return;

  e.preventDefault();

  const target = e.currentTarget as HTMLElement;
  target.scrollLeft += e.deltaX + e.deltaY;
};

export const onScroll = (state: LocalState, e: Event) => {
  const {
    timeoutActive,
    props,
    containerScrollSize,
    containerSize,
    shadowFirstEl,
    shadowLastEl,
    endsMargin,
  } = state;
  const scrollPosition =
    props.direction === "column" ? "scrollTop" : "scrollLeft";
  const scrollContainer = e.currentTarget as HTMLElement;
  const containerScrollPosition = Math.abs(scrollContainer[scrollPosition]);

  console.log("fire");
  if (!timeoutActive) {
    const scrollSize =
      props.direction === "column" ? "scrollHeight" : "scrollWidth";
    const size = props.direction === "column" ? "clientHeight" : "clientWidth";
    state.containerScrollSize = scrollContainer[scrollSize];
    state.containerSize = scrollContainer[size];
  }

  // console.log(containerScrollPosition, containerScrollSize);

  const isAtStart = containerScrollPosition - endsMargin <= 0;
  const isAtEnd =
    containerScrollPosition + containerSize >= containerScrollSize - endsMargin;

  shadowFirstEl.style.opacity = isAtStart ? "0" : "1";
  shadowLastEl.style.opacity = isAtEnd ? "0" : "1";
  if (!timeoutActive) {
    state.isScrollable =
      props.direction === "row" ? !(isAtStart && isAtEnd) : false;
    resetJustifyShadow(state);
  }

  const run = () => {
    state.timeoutActive = false;
  };

  clearTimeout(state.scrollTimeout);
  state.scrollTimeout = window.setTimeout(run, 100);
  state.timeoutActive = true;
  state.init = false;
};
