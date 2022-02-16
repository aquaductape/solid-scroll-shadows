import { LocalState } from "../../../types";
import { animateShadow } from "./animate";
import {
  resetJustifyShadow,
  runJustifyShadowsToContentItems,
} from "./justifyShadowToContentItems";

const runEntry = (state: LocalState, entry: IntersectionObserverEntry) => {
  const { init, sentinelShadowMap, scrollableContainer, props } = state;
  const target = entry.target as HTMLElement;
  const {
    el: shadowEl,
    type: shadowType,
    init: shadowInit,
  } = sentinelShadowMap.get(target)!;
  let markedShadowInit = shadowInit;
  let isVisible = false;

  if (entry.isIntersecting) {
    isVisible = true;
  }

  if (shadowType === "after") {
    if (entry.boundingClientRect.right >= entry.rootBounds!.right) {
      markedShadowInit = false;
    }
  } else {
    markedShadowInit = false;
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

  animateShadow(state, shadowEl, !isVisible, shadowType, shadowInit);
};

export const observeSentinels = (
  state: LocalState,
  entries: IntersectionObserverEntry[]
) => {
  entries.forEach((entry) => runEntry(state, entry));
  state.init = false;
};
