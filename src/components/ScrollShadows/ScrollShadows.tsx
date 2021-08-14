import {
  Component,
  onCleanup,
  onMount,
  JSX,
  untrack,
  createEffect,
  createSignal,
  createMemo,
  Show,
  Match,
  Switch,
  mergeProps,
  splitProps,
} from "solid-js";
import { isServer } from "solid-js/web";
import { editHTMLStr } from "./ssr";
//  animatedEl > shadowEl: inversion

type ShadowElements = HTMLElement | { first: HTMLElement; last: HTMLElement };
type ShadowsActive = {
  first: boolean;
  last: boolean;
  transition: boolean;
};
type ElementTemplate = { t: string };
export type ScrollShadowsOnEndsHit = (props: {
  isFirstShadow: boolean;
  entry: IntersectionObserverEntry;
  hitEnd: boolean;
  shadow: HTMLElement;
}) => boolean | void;

export type ScrollShadowsAnimate = (props: {
  target: HTMLElement;
  isFirst: boolean;
  active: boolean;
  init: boolean;
}) => void;

export interface ScrollShadowsShadow {
  /**
   * Default: `undefined`
   *
   * Takes css class, will override `shape`
   */
  class?: string;
  /**
   * Default: `rectangle`
   */
  shape?: "rectangle" | "concave" | "convex";
  /**
   * Default `undefined`
   *
   * Will also apply border radius on scrollable container
   */
  borderRadius?: string | number;
  /**
   * Default `undefined`
   *
   * If string, must use only pixel units
   */
  insetSize?: string | number;
  /**
   * Default: `50px`
   *
   * size of shadow
   */
  size?: string | number;
  /**
   * Default: `#fff`
   *
   * css color value, for shadow gradient.
   */
  color?: string;
  /**
   * image url or css gradient
   *
   * If `string` is used, the last shadow image is flipped, to disable use object prop and set `flipLast` to `false`
   */
  animation?: "opacity" | "slide";
  /**
   * Default: `300ms`
   *
   * animation duration of hiding/showing shadow
   */
  transition?: string | number;
  /**
   * Callback to customize shadow animation and transition
   */
  onAnimate?: ScrollShadowsAnimate;
  /**
   * Default: `false`. Is `true` if useragent is Safari.
   *
   * Converts `color` to rgba tranparent equivalent.
   *
   * To fix to Safari's [transparent behavior](https://css-tricks.com/thing-know-gradients-transparent-black/), it will convert `color` value to rgba. If the value is a css variable it will have have to compute style of document element. This is automatically set to true if useragent is Safari.
   */
  colorToRGBA?: boolean;
  /**
   * Default `false`
   *
   * Show shadow transition animation after component renders
   */
  transitionInit?: boolean;
  animateClassNames?: string;
  /**
   * Default: `undefined`
   *
   * Use custom element for shadows
   */
  element?: TElement;
  /**
   * Default: `null`
   *
   * Inverts last shadow. Usefull if you want to use one image, instead of two dedicated for first and last shadows
   */
  invert?: "first" | "last" | null;
}

type TElement = JSX.Element | { first: JSX.Element; last: JSX.Element };

export type ScrollShadowsComponent = _TScrollShadowsComponent & {
  shadows: ScrollShadowsShadow;
};

export interface _TScrollShadowsComponent {
  direction: "horizontal" | "vertical";
  /**
   * Default `false`
   *
   * RTL (Right to Left) to match the text local of writting direction, such as Arabic, which its text is written from right to left fashion.
   *
   * Enabling it will place the shadows in correct Right to Left positions. Only applies when `direction` is `horizontal`.
   */
  rtl?: boolean;
  /**
   * Default: `false`
   *
   * When scrollable container is hovered, the shadows change opacity
   */
  hover?:
    | boolean
    | { opacity: { enter: number; exit: number }; transition: string | number };
  onHover?: (props: boolean) => void;
  /**
   * Callback on when scrollable container's observers enter/leave
   *
   * If you want to completely controll shadow state, have the callback return value to `false`
   */
  onEndsHit?: ScrollShadowsOnEndsHit;
  /**
   * Default: `1px`
   *
   * Set Ends positions to fire when scroll container is at beginning or end;
   */
  endsDetectionMargin?: string | number;
  shadows?: ScrollShadowsShadow;
  /**
   * Default `undefined`
   *
   * If the root element of `props.children` is not a scrollable container, then you must place an `id` attribute on it and set `scrollableElementId` to the same `id` value.
   *
   */
  scrollableElementId?: string;
  /**
   * Default `false`
   *
   * When enabled, shadow state is determined via Intersection Observer API. It observes "sentinel" divs at each end of the `props.children` which is the scrollable container.
   *
   * Use case for disabling it, is when passing a third party list component, such as [Windowing/Virtual](https://praekiko.medium.com/what-is-windowing-also-i-have-heard-about-react-window-and-react-virtualized-c29dc843f4e0). Since the "sentinel"s are inserted in `props.children`, the third party component could be unaware of them and could cause potential issues.
   *
   * Once disabled, the developer provides their own method of hiding/showing shadows, an example would be adding a scroll event to scrollable element that is being passed as `props.children`
   */
  // disableIntersectionObserver?: boolean;
  /**
   * Default `true`
   *
   * Allows scrolling horizontal scrollbar using scrollwheel, without using additional holding down keyboard combinations such as `Shift`.
   */
  // horizontalWheelScroll?: boolean;
}

type TShared = {
  child: "first" | "last";
} & _TScrollShadowsComponent;

/**
 *
 * child scrollable container should have already have overflow property and should have `position: relative;` in order to make Intersection Observer to work.
 */
const ScrollShadows: Component<
  {
    class?: string;
    classList?: { [k: string]: boolean | undefined };
  } & _TScrollShadowsComponent
> = (props) => {
  const { direction, onEndsHit, hover, scrollableElementId } = props;

  const [local, shadows] = splitProps(props.shadows ? props.shadows : {}, [
    "element",
  ]);

  const sentinelShadowState = new Map<HTMLElement, HTMLElement>();
  let shadowFirstEl!: HTMLElement;
  let shadowLastEl!: HTMLElement;
  let sentinelFirstEl = (
    <Sentinel
      child="first"
      direction={props.direction}
      endsDetectionMargin={props.endsDetectionMargin}
      rtl={props.rtl}
    />
  ) as HTMLElement & ElementTemplate;
  let sentinelLastEl = (
    <Sentinel
      child="last"
      direction={props.direction}
      endsDetectionMargin={props.endsDetectionMargin}
      rtl={props.rtl}
    />
  ) as HTMLElement & ElementTemplate;
  let container!: HTMLDivElement;
  let init = true;
  const [shadowsActive, setShadowsActive] = createSignal<ShadowsActive>({
    first: false,
    last: false,
    transition: shadows.transitionInit || false,
  });

  const children = props.children as HTMLElement & ElementTemplate;
  let scrollableContainer = children as HTMLElement;

  if (isServer) {
    const scrollableContainerStr = children.t;
    const sentinelFirstElStr = sentinelFirstEl.t;
    const sentinelLastElStr = sentinelLastEl.t;

    const result = editHTMLStr({
      html: scrollableContainerStr,
      insertElementStr: sentinelFirstElStr + sentinelLastElStr,
      id: scrollableElementId,
    });
    children.t = result;
  } else {
    if (scrollableElementId) {
      scrollableContainer = children.querySelector(
        `#${scrollableElementId}`
      ) as HTMLElement;
    }
    scrollableContainer.style.position = "relative";
    scrollableContainer.appendChild(sentinelFirstEl);
    scrollableContainer.appendChild(sentinelLastEl);
  }

  const scrollHorizontally = (e: WheelEvent) => {
    const target = e.currentTarget as HTMLElement;

    target.scrollLeft += e.deltaY;
  };

  const onScrollableContainerHover = (e: MouseEvent) => {
    if (e.type === "mouseleave") {
      children.addEventListener("mouseover", onScrollableContainerHover);
      sentinelShadowState.forEach((shadowContainerEl) => {
        shadowContainerEl.style.opacity = "0.8";
      });
      return;
    }
    children.removeEventListener("mouseover", onScrollableContainerHover);
    sentinelShadowState.forEach((shadowContainerEl) => {
      shadowContainerEl.style.opacity = "1";
    });
  };

  const observerCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      const target = entry.target as HTMLElement;
      const shadowContainerEl = sentinelShadowState.get(target)!;
      const shadowEl = shadowContainerEl.firstElementChild as HTMLElement;
      const shadowAnimationEl = shadowEl.firstElementChild as HTMLElement;
      const isFirstShadow = shadowContainerEl === shadowFirstEl;
      const firstLast = target.dataset.scrollShadowsSentinel!;

      if (onEndsHit) {
        const result = onEndsHit({
          entry,
          isFirstShadow,
          shadow: shadowEl!,
          hitEnd: entry.isIntersecting,
        });

        if (result === false) return;
      }

      let isVisible = false;

      if (entry.isIntersecting) {
        isVisible = true;
      }

      if (firstLast === "first") {
        setShadowsActive((prev) => ({
          ...prev,
          first: !isVisible,
          transition: shadows.transitionInit || !init,
        }));
      } else {
        setShadowsActive((prev) => ({
          ...prev,
          last: !isVisible,
          transition: shadows.transitionInit || !init,
        }));
      }

      console.log(shadowsActive());

      const { opacity, transform, transition } = getShadowStyle({
        child: firstLast as "first",
        direction: props.direction,
        rtl: props.rtl,
        shadowsActive: shadowsActive(),
        shadows: shadows,
      });

      if (shadows.animateClassNames) return;

      // console.log({ shadowContainerEl, shadowEl });
      shadowAnimationEl.style.transition = transition;
      shadowAnimationEl.style.opacity = opacity;
      shadowAnimationEl.style.transform = transform;
    });

    init = false;
  };

  onMount(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: scrollableContainer,
    });

    if (direction === "horizontal") {
      children.addEventListener("wheel", scrollHorizontally);
    }

    if (hover) {
      shadowFirstEl.style.opacity = "0.8";
      shadowLastEl.style.opacity = "0.8";
      children.addEventListener("mouseover", onScrollableContainerHover);
      children.addEventListener("mouseleave", onScrollableContainerHover);
    }

    sentinelShadowState.set(sentinelFirstEl, shadowFirstEl);
    sentinelShadowState.set(sentinelLastEl, shadowLastEl);

    observer.observe(sentinelFirstEl);
    observer.observe(sentinelLastEl);

    onCleanup(() => observer && observer.disconnect());
  });

  const setContainerStyle = () => {
    const { rtl, shadows = {} } = props;

    return `position: relative; ${rtl ? "direction: rtl;" : ""} ${
      shadows!.borderRadius
        ? "overflow:hidden; border-radius:" +
          parseVal(shadows.borderRadius) +
          ";"
        : ""
    }`;
  };

  return (
    <div
      class={props.class}
      classList={props.classList || {}}
      style={setContainerStyle()}
      ref={container}
    >
      <Shadow
        child="first"
        direction={props.direction}
        shadows={shadows}
        customShadows={local.element}
        rtl={props.rtl}
        shadowsActive={shadowsActive}
        ref={shadowFirstEl}
      />
      <Shadow
        child="last"
        direction={props.direction}
        shadows={shadows}
        customShadows={local.element}
        shadowsActive={shadowsActive}
        rtl={props.rtl}
        ref={shadowLastEl}
      />

      {children}
    </div>
  );
};

const Sentinel: Component<
  Pick<TShared, "direction" | "child" | "endsDetectionMargin" | "rtl">
> = (props) => {
  const { child } = props;

  const setPosition = () => {
    let { endsDetectionMargin = 0, rtl, direction } = props;

    endsDetectionMargin = parseVal(endsDetectionMargin);

    const isFirst = child === "first";
    const left = rtl ? "right" : "left";
    const right = rtl ? "left" : "right";

    if (direction === "horizontal") {
      return `position: ${isFirst ? "absolute" : "relative"}; top: 0; ${
        isFirst ? left : right
      }: ${endsDetectionMargin}; height: auto; width: 5px; ${
        isFirst ? "" : "flex-shrink: 0; margin-left: -5px;"
      }`;
    }
    return `position: ${isFirst ? "absolute" : "static"}; left: 0; ${
      isFirst ? "top" : "bottom"
    }: ${endsDetectionMargin}; height: 5px; width: 100% ${
      isFirst ? "" : "flex-shrink: 0; margin-top: -5px;"
    }`;
  };

  const style = () => `pointer-events: none; ${setPosition()}; `;

  return <div data-scroll-shadows-sentinel={child} style={style()}></div>;
};

const animationState = ({
  type,
  animation,
  direction,
  isFirst,
  show,
  rtl,
}: {
  type: "opacity" | "transform";
  show: boolean;
  animation: "opacity" | "slide";
  direction: "horizontal" | "vertical";
  isFirst: boolean;
  rtl: boolean;
}) => {
  if (animation === "opacity") {
    if (type === "transform") return "";

    return show ? "1" : "0";
  }

  if (type === "opacity") return "";

  const last = !rtl || direction === "vertical" ? "100%" : "-100%";
  const first = !rtl || direction === "vertical" ? "-100%" : "100%";

  const value = show ? "0%" : isFirst ? first : last;

  if (direction === "horizontal") {
    return `translateX(${value})`;
  }

  return `translateY(${value})`;
};

const Shadow: Component<
  {
    child: "first" | "last";
    ref: any;
    shadowsActive: () => {
      first: boolean;
      last: boolean;
      transition: boolean;
    };
    customShadows: TElement;
    shadows: Omit<ScrollShadowsShadow, "element">;
  } & Pick<_TScrollShadowsComponent, "direction" | "rtl">
> = (props) => {
  const { child } = props;
  let shadowEl!: HTMLDivElement;
  let animatedEl!: HTMLDivElement;
  const isFirst = child === "first";
  let prevDirection: "horizontal" | "vertical" = props.direction;
  let prevRtl: boolean = !!props.rtl;
  let prevColor = "";
  let prevTransparentColor = "";

  const getColors = (color?: string, colorToRGBA?: boolean) => {
    if (!color) return ["rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0)"];

    if (!colorToRGBA || isServer) return [color, "transparent"];

    if (prevColor !== color) {
      prevColor = color;

      const colorArr = setColorToRGBA(color);

      color = colorArrToCSS({ colorArr, alpha: 1 });
      prevTransparentColor = colorArrToCSS({ colorArr, alpha: 0 });
    }

    return [color, prevTransparentColor];
  };

  const getShadowContainerStyle = () => {
    const { direction, rtl = false, shadows } = props;
    // const {direction, rtl} = other
    let { size = "50px", invert = null } = shadows;

    const isFirst = child === "first";
    const right = rtl ? "left" : "right";
    const left = rtl ? "right" : "left";

    size = parseVal(size);

    const getPositionSize = () => {
      if (direction === "horizontal") {
        return `top: 0; ${
          isFirst ? left : right
        }: 0;  width: ${size}; height: 100%;`;
      }

      return `left: 0; ${
        isFirst ? "top" : "bottom"
      }: 0;  width: 100%; height: ${size}`;
    };

    return `position: absolute; z-index: 1; pointer-events: none; overflow: hidden; transition: opacity 300ms; ${getPositionSize()}; `;
  };

  const getCustomShadowStyle = () => {
    if (!props.customShadows) return "";

    return `height: 100%; width: 100%;`;
  };

  const getAnimatedElClassNames = () => {
    const { shadowsActive, shadows } = props;
    const { animateClassNames } = shadows;
    if (!animateClassNames) return "";
    //     const state = active ? "-show" : "-hide";
    //     const init = !transitionActive ? `${animateClassNames}-init` : "";
    //
    //     return `${animateClassNames} ${init} ${animateClassNames}${state}`;
    return "";
  };

  createEffect(() => {
    const shadowsActive = untrack(props.shadowsActive);
    const rtl = props.rtl;
    const direction = props.direction;
    const shadows = props.shadows;
    const child = props.child;
    const customShadows = props.customShadows;
    const [color, transparentColor] = getColors(
      shadows.color,
      shadows.colorToRGBA
    );

    const {
      backgroundImage,
      backgroundPosition,
      backgroundRepeat,
      backgroundSize,
      transition,
      opacity,
      transform,
      invertScale,
      boxShadow,
      borderRadius,
    } = getShadowStyle({
      child,
      direction,
      shadows,
      shadowsActive,
      rtl,
      prevDirection,
      prevRtl,
      transparentColor,
      color,
    });

    if (customShadows) {
      // @ts-ignore
      const element = customShadows as ShadowElements;
      // if (shadows.onAnimate) {
      //   shadows.onAnimate({
      //     target: element instanceof Element ? element : element[child],
      //     active,
      //     isFirst: child === "first",
      //     init: transitionActive,
      //   });
      // }

      animatedEl.style.transition = transition;
      animatedEl.style.opacity = opacity;
      animatedEl.style.transform = transform;
      return;
    }

    shadowEl.style.backgroundImage = backgroundImage;
    shadowEl.style.backgroundPosition = backgroundPosition;
    shadowEl.style.backgroundRepeat = backgroundRepeat;
    shadowEl.style.backgroundSize = backgroundSize;
    shadowEl.style.boxShadow = boxShadow;
    shadowEl.style.borderRadius = borderRadius;
    shadowEl.style.transform = invertScale;

    // if (shadows.onAnimate) {
    //   shadows.onAnimate({
    //     target: shadowEl,
    //     active,
    //     isFirst: child === "first",
    //     init: !transitionActive,
    //   });
    //   return;
    // }

    if (shadows.animateClassNames) return;

    animatedEl.style.transition = transition;
    animatedEl.style.opacity = opacity;
    animatedEl.style.transform = transform;
  });

  const dataAttribute = isFirst ? { first: "" } : { last: "" };

  return (
    <div ref={props.ref} style={getShadowContainerStyle()}>
      {/* extra wrapper fixes animation bug in Safari, where animation is shown outside of parent despite having overflow:hidden
      
      https://stackoverflow.com/a/42297882/8234457
      */}
      <div style="width: 100%; height: 100%; overflow: hidden;">
        <Show
          when={props.customShadows}
          fallback={
            <div
              class={getAnimatedElClassNames()}
              style="width: 100%; height: 100%;"
              ref={animatedEl}
              {...dataAttribute}
            >
              <div
                class={props.shadows && props.shadows.class}
                ref={shadowEl}
                style={"width: 100%; height: 100%;"}
                {...dataAttribute}
              ></div>
            </div>
          }
        >
          <div
            class={getAnimatedElClassNames()}
            style="width: 100%; height: 100%;"
            ref={animatedEl}
            {...dataAttribute}
          >
            <div
              {...dataAttribute}
              class={props.shadows && props.shadows.class}
              style={getCustomShadowStyle()}
            >
              <Switch>
                <Match
                  when={
                    props.customShadows instanceof Element ||
                    // @ts-ignore
                    props.customShadows.t
                  }
                >
                  {/* @ts-ignore */}
                  {props.customShadows}
                </Match>
                <Match when={child === "first"}>
                  {/* @ts-ignore */}
                  {props.customShadows.first}
                </Match>
                <Match when={child === "last"}>
                  {/* @ts-ignore */}
                  {props.customShadows.last}
                </Match>
              </Switch>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
};

const getShadowStyle = (
  props: Omit<_TScrollShadowsComponent, "shadows"> & {
    child: "first" | "last";
    shadows: ScrollShadowsShadow;
    shadowsActive: ShadowsActive;
    prevDirection?: "horizontal" | "vertical";
    prevRtl?: boolean;
    transparentColor?: string;
    color?: string;
  }
) => {
  // const { direction, rtl = false } = other;
  let {
    shadowsActive,
    shadows,
    direction,
    rtl = false,
    child,
    prevDirection,
    prevRtl,
    transparentColor,
    color,
  } = props;
  // get dom attr if active
  const {
    animation = "opacity",
    class: className,
    shape = "rectangle",
    transition = "300ms",
    invert,
    borderRadius,
    insetSize,
    size = "50px",
  } = shadows;

  const animationProp = animation === "opacity" ? animation : "transform";
  const isFirst = child === "first";
  let transitionActive = shadowsActive.transition;

  if (prevDirection != null) {
    if (prevDirection !== direction) {
      transitionActive = false;
      prevDirection = direction;
    }
  }

  if (prevRtl != null) {
    if (prevRtl !== rtl) {
      transitionActive = false;
      prevRtl = rtl;
    }
  }

  const getBoxShadow = () => {
    if (className) return "";
    if (!insetSize) return "";

    let x = 0;
    let y = 0;
    let blur = 0;
    let spread = 0;
    let val = insetSize as number;

    val = parseValToNum(insetSize);

    if (direction === "horizontal") {
      const from = rtl ? -val : val;
      const to = rtl ? val : -val;
      x = isFirst ? from : to;
    } else {
      y = isFirst ? val : -val;
    }

    blur = val - 3;
    spread = val * -1;
    return `${shadows.color} ${x}px ${y}px ${blur}px ${spread}px inset`;
  };

  const getBorderRadius = () => {
    if (className) return "";
    if (!borderRadius) return "";
    const val = parseVal(borderRadius);
    let topLeft = "0px";
    let topRight = "0px";
    let bottomLeft = "0px";
    let bottomRight = "0px";

    if (direction === "horizontal") {
      if (isFirst) {
        if (rtl) {
          topRight = val;
          bottomRight = val;
        } else {
          topLeft = val;
          bottomLeft = val;
        }
      } else {
        if (rtl) {
          topLeft = val;
          bottomLeft = val;
        } else {
          topRight = val;
          bottomRight = val;
        }
      }
    } else {
      if (isFirst) {
        topLeft = val;
        topRight = val;
      } else {
        bottomLeft = val;
        bottomRight = val;
      }
    }

    return `${topLeft} ${topRight} ${bottomRight} ${bottomLeft}`;
  };

  const getInvertScale = () => {
    if (!invert) return "";
    if (invert !== child) return "";

    const inverseScale =
      direction === "horizontal" ? "scaleX(-1)" : "scaleY(-1)";

    return invert ? inverseScale : "";
  };

  const getBackgroundSize = () => {
    if (className) return "";
    if (shape === "rectangle") return "";

    if (shape === "convex") {
      const bgSize =
        direction === "horizontal"
          ? "50% 100%, 100% 100%"
          : "100% 50%, 100% 100%";
      return bgSize;
    }
    const bgSize = direction === "horizontal" ? "100% 345%" : "345% 100%";
    return bgSize;
  };

  const getBackgroundPosition = () => {
    if (className) return "";

    const right = rtl ? "left" : "right";
    const left = rtl ? "right" : "left";
    if (shape === "rectangle") return "";

    if (shape === "convex") {
      const bgPosition =
        direction === "horizontal"
          ? isFirst
            ? left
            : right
          : isFirst
          ? "top"
          : "bottom";
      return bgPosition;
    }
    const bgPosition = direction === "horizontal" ? "right" : "center center";

    return bgPosition;
  };

  const getBackgroundImage = () => {
    if (className) return "";
    const right = rtl ? "left" : "right";
    const left = rtl ? "right" : "left";

    if (shape === "convex") {
      const from = rtl ? "100%" : "0%";
      const to = rtl ? "0%" : "100%";
      const x = direction === "horizontal" ? (isFirst ? from : to) : "50%";
      const y = direction === "horizontal" ? "50%" : isFirst ? "0%" : "100%";

      return `radial-gradient(farthest-side at ${x} ${y},${color} 0%, ${transparentColor}), radial-gradient(farthest-side at ${x} ${y},${color} -15%,${transparentColor})`;
    }

    if (shape === "concave") {
      const from = rtl ? "0%" : "100%";
      const to = rtl ? "100%" : "0%";
      const x = direction === "horizontal" ? (isFirst ? from : to) : "50%";
      const y = direction === "horizontal" ? "50%" : isFirst ? "100%" : "0%";
      let firstStop: string | number = "0%";
      if (insetSize) {
        firstStop = parseValToNum(insetSize) * -1;
      }
      return `radial-gradient(farthest-side at ${x} ${y},${transparentColor} 25%,${color})`;
    }

    const x = direction === "horizontal" ? right : "bottom";
    const y = direction === "horizontal" ? left : "top";

    let firstStop: string | number = "50%";
    if (insetSize) {
      let numVal = parseValToNum(insetSize);
      const pxUnits = parseVal(size).match(/px/g)!;
      const sizeHasPxUnit = pxUnits != null && pxUnits.length === 1;

      if (sizeHasPxUnit) {
        const numSize = parseValToNum(size);
        if (numVal >= numSize / 2) {
          numVal = numSize / 2 - 1;
        }
      }
      firstStop = `calc(${firstStop} - ${numVal}px)`;
    }

    return `linear-gradient(to ${
      isFirst ? x : y
    }, ${color}, ${firstStop}, ${transparentColor})`;
  };

  const getBackgroundRepeat = () => {
    if (className) return "";
    return "no-repeat";
  };

  const transitionDeclaration = transitionActive
    ? `${animationProp} ${parseVal(transition, "ms")}`
    : "";

  return {
    backgroundImage: getBackgroundImage(),
    backgroundSize: getBackgroundSize(),
    backgroundPosition: getBackgroundPosition(),
    backgroundRepeat: getBackgroundRepeat(),
    transition: transitionDeclaration,
    opacity: animationState({
      type: "opacity",
      animation: animation!,
      direction,
      isFirst,
      show: shadowsActive[child],
      rtl: rtl!,
    }),
    transform: animationState({
      type: "transform",
      animation: animation!,
      direction,
      isFirst,
      show: shadowsActive[child],
      rtl: rtl!,
    }),
    invertScale: getInvertScale(),
    borderRadius: getBorderRadius(),
    boxShadow: getBoxShadow(),
  };
};

// https://gist.github.com/njvack/02ad8efcb0d552b0230d
const setColorToRGBA = (color: string) => {
  // Returns the color as an array of [r, g, b, a] -- all range from 0 - 255
  // color must be a valid canvas fillStyle. This will cover most anything
  // you'd want to use.
  // Examples:
  // colorToRGBA('red')  # [255, 0, 0, 255]
  // colorToRGBA('#f00') # [255, 0, 0, 255]
  const cssVariableResult = color.match(/^var\((.+)\)/);
  if (cssVariableResult) {
    const variableName = cssVariableResult[1];
    const value = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue(variableName);

    color = value;
  }

  const cvs = document.createElement("canvas");
  cvs.height = 1;
  cvs.width = 1;
  const ctx = cvs.getContext("2d")!;
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  return ctx.getImageData(0, 0, 1, 1).data as unknown as number[];
};

const colorArrToCSS = ({
  colorArr,
  alpha,
}: {
  colorArr: number[];
  alpha?: number;
}) => {
  if (alpha != null) {
    colorArr[3] = alpha;
  }

  return `rgba(${colorArr.join(", ")})`;
};

const userAgent = (pattern: RegExp) => {
  // @ts-ignore
  if (typeof window !== "undefined" && window.navigator) {
    return !!(/*@__PURE__*/ navigator.userAgent.match(pattern));
  }
};

const parseVal = (value?: string | number, unit: "px" | "ms" = "px") => {
  if (typeof value === "number") return `${value}${unit}`;

  return value || "";
};

/**
 *
 * if string, should only have px unit
 */
const parseValToNum = (value?: string | number) => {
  if (typeof value === "string") {
    return Number(value.match(/(.+)px/)![1])!;
  }

  return value || 0;
};

export const isSafari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);

export default ScrollShadows;
