import { LocalState } from "../../../types";
import {
  resetJustifyShadow,
  runJustifyShadowsToContentItems,
} from "./justifyShadowToContentItems";

const runEntry = (state: LocalState, entry: ResizeObserverEntry) => {
  const {
    init,
    sentinelShadowMap,
    props,
    scrollableContainer,
    shadowFirstEl,
    shadowLastEl,
  } = state;
  const rootBounds = entry.target.getBoundingClientRect();

  const scrollPosition =
    props.direction === "column" ? "scrollTop" : "scrollLeft";
  const containerScrollPosition = Math.abs(scrollableContainer[scrollPosition]);

  const scrollSize =
    props.direction === "column" ? "scrollHeight" : "scrollWidth";
  const size = props.direction === "column" ? "clientHeight" : "clientWidth";
  state.containerScrollSize = scrollableContainer[scrollSize];
  state.containerSize = scrollableContainer[size];

  const isAtStart = containerScrollPosition <= 0;
  const isAtEnd =
    containerScrollPosition + state.containerSize >= state.containerScrollSize;

  sentinelShadowMap.forEach((item, index) => {
    item.visible = index ? isAtStart : isAtEnd;

    if (init && item.type === "after") {
      runJustifyShadowsToContentItems({
        el: item.el,
        isSentinelVisible: !item.visible,
        rootBounds,
        rootEl: scrollableContainer,
        rtl: props.rtl!,
        direction: props.direction,
        justifyShadowsToContentItems: props.justifyShadowsToContentItems,
      });
    }
  });

  resetJustifyShadow(state);

  state.isScrollable =
    props.direction === "row" ? !(isAtStart && isAtEnd) : false;
  shadowFirstEl.style.opacity = isAtStart ? "0" : "1";
  shadowLastEl.style.opacity = isAtEnd ? "0" : "1";

  state.init = false;
};

export const observeScrollContainer = (
  state: LocalState,
  entries: ResizeObserverEntry[]
) => {
  entries.forEach((entry) => runEntry(state, entry));
};
