import {
  Component,
  onCleanup,
  onMount,
  JSX,
  createRenderEffect,
  createEffect,
} from "solid-js";
import { isServer } from "solid-js/web";
import { editHTMLStr } from "../../ssr";
import { ElementTemplate, TScrollShadows } from "../../types";
import { round } from "../../utils";
import Sentinel from "../Sentinel";
import Shadow from "../Shadow";
import { fitShadowSizeToItem, scrollHorizontally } from "./utils";

/**
 *
 * child scrollable container should have already have overflow property and should have `position: relative;` in order to make Intersection Observer to work.
 */
const ScrollShadows: Component<TScrollShadows> = (props) => {
  const {
    direction,
    shadowSize,
    initShadowSize,
    wheelScrollHorizontally = true,
    justifyShadowsToContentItems,
  } = props;
  const children = props.children as HTMLElement & ElementTemplate;
  const sentinelShadowState = new Map<
    HTMLElement,
    { type: "before" | "after"; el: HTMLElement; visible: boolean }
  >();
  let scrollableContainer = children as HTMLElement;
  let shadowFirstEl!: HTMLElement;
  let shadowLastEl!: HTMLElement;
  // @ts-ignore
  let sentinelBeforeEl = (
    <Sentinel child="before" direction={direction} rtl={props.rtl} />
  ) as HTMLElement & ElementTemplate;
  // @ts-ignore
  let sentinelAfterEl = (
    <Sentinel child="after" direction={direction} rtl={props.rtl} />
  ) as HTMLElement & ElementTemplate;

  if (typeof sentinelBeforeEl === "function") {
    // @ts-ignore
    sentinelBeforeEl = sentinelBeforeEl();
    // @ts-ignore
    sentinelAfterEl = sentinelAfterEl();
  }

  let init = true;
  let initResetSize = false;
  let isScrollable = false;

  if (isServer) {
    const scrollableContainerStr = children.t;
    const sentinelFirstElStr = sentinelBeforeEl.t;
    const sentinelLastElStr = sentinelAfterEl.t;

    const result = editHTMLStr({
      html: scrollableContainerStr,
      insertElementStr: sentinelFirstElStr + sentinelLastElStr,
    });
    children.t = result;
  } else {
    scrollableContainer.style.position = "relative";
    scrollableContainer.appendChild(sentinelBeforeEl);
    scrollableContainer.appendChild(sentinelAfterEl);
  }

  const _scrollHorizontally = (e: WheelEvent) => {
    scrollHorizontally(isScrollable, e);
  };

  const resetInitShadowSize = () => {
    // if (!initShadowSize) return;
    if (!init && !initResetSize) {
      sentinelShadowState.forEach(({ el }) => {
        const [shadowEl, solidEl] =
          el.children as any as NodeListOf<HTMLElement>;
        shadowEl.style.transform = "";
        shadowEl.style.transition = "500ms transform";
        solidEl.style.transform = `scale${
          props.direction === "column" ? "Y" : "X"
        }(0)`;
        solidEl.style.transition = "500ms transform";
      });
      initResetSize = true;
    }
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const { el: shadowEl, type: shadowType } =
          sentinelShadowState.get(target)!;
        let isVisible = false;

        if (entry.isIntersecting) {
          isVisible = true;
        }
        // runAnimationCb({ el: shadowEl, isSentinelVisible: isVisible });
        if (init && shadowType === "after") {
          fitShadowSizeToItem({
            el: shadowEl,
            isSentinelVisible: isVisible,
            rootBounds: entry.rootBounds!,
            rootEl: scrollableContainer,
            rtl: props.rtl!,
            direction: props.direction,
            justifyShadowsToContentItems,
          });
        }
        resetInitShadowSize();
        sentinelShadowState.set(target, {
          type: shadowType,
          el: shadowEl,
          visible: isVisible,
        });
        isScrollable =
          props.direction === "row"
            ? ![...sentinelShadowState].every(
                ([_, { visible }]) => visible === true
              )
            : false;
        shadowEl!.style.opacity = isVisible ? "0" : "1";
      });
      init = false;
    },
    { root: scrollableContainer }
  );

  onMount(() => {
    if (wheelScrollHorizontally) {
      scrollableContainer.addEventListener("wheel", _scrollHorizontally);
    }
    sentinelShadowState.set(sentinelBeforeEl, {
      type: "before",
      el: shadowFirstEl,
      visible: true,
    });
    sentinelShadowState.set(sentinelAfterEl, {
      type: "after",
      el: shadowLastEl,
      visible: false,
    });

    observer.observe(sentinelBeforeEl);
    observer.observe(sentinelAfterEl);

    onCleanup(() => {
      observer && observer.disconnect();
      scrollableContainer.removeEventListener("wheel", _scrollHorizontally);
    });
  });

  return (
    <div
      id={props.id}
      class={props.class}
      classList={props.classList}
      style={props.style}
    >
      <Shadow
        shadowsClass={props.shadowsClass}
        shadowsBlockClass={props.shadowsBlockClass}
        child="before"
        direction={direction}
        shadowSize={shadowSize}
        justifyShadowsToContentItems={justifyShadowsToContentItems}
        rtl={props.rtl}
        ref={shadowFirstEl}
      />
      <Shadow
        shadowsClass={props.shadowsClass}
        shadowsBlockClass={props.shadowsBlockClass}
        child="after"
        direction={direction}
        shadowSize={shadowSize}
        justifyShadowsToContentItems={justifyShadowsToContentItems}
        rtl={props.rtl}
        ref={shadowLastEl}
      />
      {scrollableContainer}
    </div>
  );
};

export default ScrollShadows;
