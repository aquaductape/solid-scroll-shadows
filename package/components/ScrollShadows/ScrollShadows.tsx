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
    smartShadowSize,
  } = props;
  const children = props.children as HTMLElement & ElementTemplate;
  const sentinelShadowState = new Map<
    HTMLElement,
    { type: "first" | "last"; el: HTMLElement }
  >();
  let scrollableContainer = children as HTMLElement;
  let shadowFirstEl!: HTMLElement;
  let shadowLastEl!: HTMLElement;
  let sentinelFirstEl = (
    (<Sentinel child="first" direction={direction} rtl={props.rtl} />) as any
  )() as HTMLElement & ElementTemplate;
  let sentinelLastEl = (
    (<Sentinel child="last" direction={direction} rtl={props.rtl} />) as any
  )() as HTMLElement & ElementTemplate;
  let init = true;
  let initResetSize = false;

  if (isServer) {
    const scrollableContainerStr = children.t;
    const sentinelFirstElStr = sentinelFirstEl.t;
    const sentinelLastElStr = sentinelLastEl.t;

    const result = editHTMLStr({
      html: scrollableContainerStr,
      insertElementStr: sentinelFirstElStr + sentinelLastElStr,
    });
    children.t = result;
  } else {
    scrollableContainer.style.position = "relative";
    scrollableContainer.appendChild(sentinelFirstEl);
    scrollableContainer.appendChild(sentinelLastEl);
  }

  const resetInitShadowSize = () => {
    // if (!initShadowSize) return;
    if (!init && !initResetSize) {
      sentinelShadowState.forEach(({ el }) => {
        const [shadowEl, solidEl] =
          el.children as any as NodeListOf<HTMLElement>;
        shadowEl.style.transform = "";
        solidEl.style.transform = `scale${
          props.direction === "column" ? "Y" : "X"
        }(0)`;
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
        if (init) {
          fitShadowSizeToItem({
            type: shadowType,
            el: shadowEl,
            isSentinelVisible: isVisible,
            rootBounds: entry.rootBounds!,
            rootEl: scrollableContainer,
            rtl: props.rtl!,
            direction: props.direction,
          });
        }
        resetInitShadowSize();
        shadowEl!.style.opacity = isVisible ? "0" : "1";
      });
      init = false;
    },
    { root: scrollableContainer }
  );

  onMount(() => {
    if (wheelScrollHorizontally) {
      scrollableContainer.addEventListener("wheel", scrollHorizontally, {
        passive: true,
      });
    }
    sentinelShadowState.set(sentinelFirstEl, {
      type: "first",
      el: shadowFirstEl,
    });
    sentinelShadowState.set(sentinelLastEl, {
      type: "last",
      el: shadowLastEl,
    });

    observer.observe(sentinelFirstEl);
    observer.observe(sentinelLastEl);

    onCleanup(() => observer && observer.disconnect());
  });

  return (
    <div
      id={props.id}
      class={props.class}
      classList={props.classList}
      style={props.style}
    >
      <Shadow
        child="first"
        direction={direction}
        shadowSize={shadowSize}
        smartShadowSize={smartShadowSize}
        rtl={props.rtl}
        ref={shadowFirstEl}
      />
      <Shadow
        child="last"
        direction={direction}
        shadowSize={shadowSize}
        smartShadowSize={smartShadowSize}
        rtl={props.rtl}
        ref={shadowLastEl}
      />
      {scrollableContainer}
    </div>
  );
};

export default ScrollShadows;
