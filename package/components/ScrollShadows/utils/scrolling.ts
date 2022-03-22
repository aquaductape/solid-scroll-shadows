import { LocalState } from "../../../types";
import { animateShadow } from "./animate";
import { getShadowEl } from "./getShadowEl";
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
    scrollableContainer,
    shadowFirstEl,
    shadowLastEl,
    endsMargin,
    onAtEnds,
    init,
  } = state;
  const scrollPosition =
    props.direction === "column" ? "scrollTop" : "scrollLeft";
  const scrollContainer = e.currentTarget as HTMLElement;
  const containerScrollPosition = Math.abs(scrollContainer[scrollPosition]);

  if (!timeoutActive) {
    const scrollSize =
      props.direction === "column" ? "scrollHeight" : "scrollWidth";
    const size = props.direction === "column" ? "clientHeight" : "clientWidth";
    state.containerScrollSize = scrollContainer[scrollSize];
    state.containerSize = scrollContainer[size];
  }

  const isAtStart = containerScrollPosition - endsMargin <= 0;
  const isAtEnd =
    containerScrollPosition + containerSize >= containerScrollSize - endsMargin;

  if (isAtStart) {
    if (!state.isAtStart) {
      if (onAtEnds) {
        onAtEnds({
          type: "start",
          active: isAtStart,
          shadowEl: getShadowEl({
            shadowEl: shadowFirstEl,
            hasShadowEl: !!props.shadowsClass,
            animated: !!props.animation,
          }),
          shadowContainerEl: shadowFirstEl,
          scrollContainerEl: scrollableContainer,
          direction: props.direction,
          init,
        });
      }
      animateShadow(state, shadowFirstEl, !isAtStart, "before", false);
    } else {
      state.isAtStart = true;
      state.isAtEnd = false;
    }
  }

  if (isAtEnd) {
    if (!state.isAtEnd) {
      if (onAtEnds) {
        onAtEnds({
          type: "end",
          active: isAtEnd,
          shadowEl: getShadowEl({
            shadowEl: shadowLastEl,
            hasShadowEl: !!props.shadowsClass,
            animated: !!props.animation,
          }),
          shadowContainerEl: shadowFirstEl,
          scrollContainerEl: scrollableContainer,
          direction: props.direction,
          init,
        });
      }
      animateShadow(state, shadowLastEl, !isAtEnd, "after", false);
    } else {
      state.isAtStart = false;
      state.isAtEnd = true;
    }
  }

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
