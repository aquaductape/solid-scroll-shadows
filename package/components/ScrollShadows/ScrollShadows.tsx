import { Component, onCleanup, onMount, Show } from "solid-js";
import { isServer } from "solid-js/web";
import { editHTMLStr } from "../../ssr";
import {
  ElementTemplate,
  LocalState,
  SentinelShadowMap,
  TScrollShadows,
} from "../../types";
import Sentinel from "../Sentinel";
import Shadow from "../Shadow";
import { observeSentinels } from "./utils/intersectionObserver";
import { observeScrollContainer } from "./utils/resizeObserver";
import { onScroll, scrollHorizontally } from "./utils/scrolling";

/**
 *
 * child scrollable container should have already have overflow property and should have `position: relative;` in order to make Intersection Observer to work.
 */
const ScrollShadows: Component<TScrollShadows> = (props) => {
  const {
    direction,
    disableScrollWheel,
    disableIntersectionObserver,
    justifyShadowsToContentItems,
    endsMargin = 0,
    onAtEnds,
  } = props;
  // const children = props.children as HTMLElement & ElementTemplate;
  const sentinelShadowMap: SentinelShadowMap = new Map();
  const scrollableContainer = props.children as HTMLElement;
  // @ts-ignore
  let sentinelBeforeEl: HTMLElement & ElementTemplate =
    !disableIntersectionObserver ? (
      <Sentinel
        child="before"
        direction={direction}
        rtl={props.rtl}
        endsMargin={endsMargin}
      />
    ) : null;
  // @ts-ignore
  let sentinelAfterEl: HTMLElement & ElementTemplate =
    !disableIntersectionObserver ? (
      <Sentinel
        child="after"
        direction={direction}
        rtl={props.rtl}
        endsMargin={endsMargin}
      />
    ) : null;

  if (typeof sentinelBeforeEl === "function") {
    // @ts-ignore
    sentinelBeforeEl = sentinelBeforeEl();
    // @ts-ignore
    sentinelAfterEl = sentinelAfterEl();
  }

  if (isServer) {
    //     const scrollableContainerStr = children.t;
    //     const sentinelFirstElStr = sentinelBeforeEl.t;
    //     const sentinelLastElStr = sentinelAfterEl.t;
    //
    //     const result = editHTMLStr({
    //       html: scrollableContainerStr,
    //       insertElementStr: sentinelFirstElStr + sentinelLastElStr,
    //     });
    //     children.t = result;
  } else {
    scrollableContainer.style.position = "relative";
    if (!disableIntersectionObserver) {
      scrollableContainer.appendChild(sentinelBeforeEl);
      scrollableContainer.appendChild(sentinelAfterEl);
    }
  }

  const state: LocalState = {
    init: true,
    initResetSize: false,
    isScrollable: false,
    scrollableContainer,
    containerSize: 0,
    scrollTimeout: 0,
    timeoutActive: false,
    containerScrollSize: 0,
    sentinelShadowMap,
    isAtStart: true,
    isAtEnd: false,
    shadowFirstEl: null as any,
    shadowLastEl: null as any,
    endsMargin,
    direction,
    onAtEnds,
    props,
  };

  const _scrollHorizontally = (e: WheelEvent) => {
    scrollHorizontally(state, e);
  };

  const _onScroll = (e: Event) => {
    onScroll(state, e);
  };

  const intersectionObserver: IntersectionObserver | null =
    !disableIntersectionObserver && !isServer
      ? new IntersectionObserver(
          (entries) => {
            observeSentinels(state, entries);
          },
          {
            root: scrollableContainer,
          }
        )
      : null;
  const resizeObserver: ResizeObserver | null = !isServer
    ? new ResizeObserver((entries) => {
        if (!props.shadowsClass) return;
        observeScrollContainer(state, entries);
      })
    : null;

  onMount(() => {
    if (!disableScrollWheel) {
      scrollableContainer.addEventListener("wheel", _scrollHorizontally);
    }

    const setElKey = (el: HTMLElement) => {
      if (!intersectionObserver) return {} as any;
      return el;
    };

    sentinelShadowMap.set(setElKey(sentinelBeforeEl), {
      type: "before",
      el: state.shadowFirstEl,
      visible: true,
      sentinel: sentinelBeforeEl,
      init: true,
    });
    sentinelShadowMap.set(setElKey(sentinelAfterEl), {
      type: "after",
      el: state.shadowLastEl,
      visible: false,
      sentinel: sentinelAfterEl,
      init: true,
    });

    if (intersectionObserver) {
      intersectionObserver.observe(sentinelBeforeEl);
      intersectionObserver.observe(sentinelAfterEl);
    } else {
      resizeObserver!.observe(scrollableContainer);
      scrollableContainer.addEventListener("scroll", _onScroll, {
        passive: true,
      });
    }

    onCleanup(() => {
      if (intersectionObserver) {
        intersectionObserver && intersectionObserver.disconnect();
      }
      scrollableContainer.removeEventListener("wheel", _scrollHorizontally);
      scrollableContainer.removeEventListener("scroll", _onScroll);
    });
  });

  return (
    <div class={props.class} classList={props.classList}>
      <Show when={props.shadowsClass}>
        <Shadow
          shadowsClass={props.shadowsClass}
          shadowsBlockClass={props.shadowsBlockClass}
          child="before"
          direction={direction}
          justifyShadowsToContentItems={justifyShadowsToContentItems}
          animation={props.animation}
          rtl={props.rtl}
          ref={state.shadowFirstEl}
        />
        <Shadow
          shadowsClass={props.shadowsClass}
          shadowsBlockClass={props.shadowsBlockClass}
          child="after"
          direction={direction}
          justifyShadowsToContentItems={justifyShadowsToContentItems}
          animation={props.animation}
          rtl={props.rtl}
          ref={state.shadowLastEl}
        />
      </Show>
      {scrollableContainer}
    </div>
  );
};

export default ScrollShadows;
