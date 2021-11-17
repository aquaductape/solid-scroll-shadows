import { LocalState } from "../../../types";
import { animateShadow } from "./animate";
import {
  resetJustifyShadow,
  runJustifyShadowsToContentItems,
} from "./justifyShadowToContentItems";

const runEntry = (state: LocalState, entry: IntersectionObserverEntry) => {
  const { init, sentinelShadowMap, scrollableContainer, props } = state;
  const target = entry.target as HTMLElement;
  const { el: shadowEl, type: shadowType } = sentinelShadowMap.get(target)!;
  let isVisible = false;

  if (entry.isIntersecting) {
    isVisible = true;
  }
  // runAnimationCb({ el: shadowEl, isSentinelVisible: isVisible });
  if (init && shadowType === "after") {
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

  resetJustifyShadow(state);

  sentinelShadowMap.set(target, {
    type: shadowType,
    el: shadowEl,
    visible: isVisible,
    sentinel: target,
  });
  state.isScrollable =
    props.direction === "row"
      ? ![...sentinelShadowMap].every(([_, { visible }]) => visible === true)
      : false;

  animateShadow(state, shadowEl, !isVisible, shadowType);
};

export const observeSentinels = (
  state: LocalState,
  entries: IntersectionObserverEntry[]
) => {
  entries.forEach((entry) => runEntry(state, entry));
  state.init = false;
};
