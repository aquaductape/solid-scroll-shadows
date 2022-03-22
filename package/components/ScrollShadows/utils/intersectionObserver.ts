import { LocalState } from "../../../types";
import { animateShadow } from "./animate";
import { getShadowEl } from "./getShadowEl";
import {
  resetJustifyShadow,
  runJustifyShadowsToContentItems,
} from "./justifyShadowToContentItems";

const runEntry = (state: LocalState, entry: IntersectionObserverEntry) => {
  const { init, sentinelShadowMap, scrollableContainer, onAtEnds, props } =
    state;
  const target = entry.target as HTMLElement;
  const {
    el: shadowEl,
    type: shadowType,
    init: shadowInit,
  } = sentinelShadowMap.get(target)!;
  const { rtl, direction } = props;
  let markedShadowInit = shadowInit;
  let isVisible = false;

  if (entry.isIntersecting) {
    isVisible = true;
  }

  if (shadowType === "after") {
    if (direction === "column") {
      if (entry.boundingClientRect.bottom >= entry.rootBounds!.bottom) {
        markedShadowInit = false;
      }
    } else {
      if (entry.boundingClientRect.right >= entry.rootBounds!.right) {
        markedShadowInit = false;
      }
    }
  } else {
    if (direction === "column") {
      if (entry.boundingClientRect.top <= entry.rootBounds!.top) {
        markedShadowInit = false;
      }
    } else {
      if (entry.boundingClientRect.left <= entry.rootBounds!.left) {
        markedShadowInit = false;
      }
    }
    // markedShadowInit = false;
  }

  // runAnimationCb({ el: shadowEl, isSentinelVisible: isVisible });
  if (shadowInit && shadowType === "after") {
    runJustifyShadowsToContentItems({
      el: shadowEl,
      isSentinelVisible: isVisible,
      rootBounds: entry.rootBounds!,
      rootEl: scrollableContainer,
      rtl: props.rtl!,
      direction: props.direction,
      justifyShadowsToContentItems: props.justifyShadowsToContentItems,
    });
  }

  if (!shadowInit) {
    resetJustifyShadow(state);
  }

  sentinelShadowMap.set(target, {
    type: shadowType,
    el: shadowEl,
    visible: isVisible,
    sentinel: target,
    init: markedShadowInit,
  });
  state.isScrollable =
    props.direction === "row"
      ? ![...sentinelShadowMap].every(([_, { visible }]) => visible === true)
      : false;

  if (onAtEnds) {
    const sentinelShadowArr = [...sentinelShadowMap];
    const isAtStart = sentinelShadowArr[0][1].visible;
    const isAtEnd = sentinelShadowArr[1][1].visible;
    onAtEnds({
      type: shadowType === "before" ? "start" : "end",
      isAtStart,
      isAtEnd,
      shadowEl: getShadowEl({
        shadowEl,
        hasShadowEl: !!props.shadowsClass,
        animated: !!props.animation,
      }),
      shadowContainerEl: shadowEl,
      scrollContainerEl: scrollableContainer,
      direction: props.direction,
      rtl,
      init,
    });
  }

  if (props.shadowsClass) {
    animateShadow(state, shadowEl, !isVisible, shadowType, shadowInit);
  }
};

export const observeSentinels = (
  state: LocalState,
  entries: IntersectionObserverEntry[]
) => {
  entries.forEach((entry) => runEntry(state, entry));
  state.init = false;
};
