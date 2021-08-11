import {
  Component,
  onCleanup,
  onMount,
  JSX,
  createEffect,
  createSignal,
  Show,
  Match,
  Switch,
} from "solid-js";
import { isServer } from "solid-js/web";
import { editHTMLStr } from "./ssr";
//  animatedEl > shadowEl: inversion

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

export type ScrollShadowsShadow = {
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
  elements?: {
    first: JSX.Element;
    last: JSX.Element;
    /**
     * Default: `true`
     *
     * Adds default styling such as position, width, ect.
     */
    defaultStyle?: boolean;
  };
  /**
   * Default: `null`
   *
   * Inverts last shadow. Usefull if you want to use one image, instead of two dedicated for first and last shadows
   */
  invert?: "first" | "last" | null;
};

export type ScrollShadowsComponent = _TScrollShadowsComponent & {
  shadow: ScrollShadowsShadow;
};

export type _TScrollShadowsComponent = {
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
  shadow?: ScrollShadowsShadow;
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
};

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
  } & Omit<TShared, "child">
> = (props) => {
  const {
    direction,
    onEndsHit,
    hover,
    shadow = {},
    scrollableElementId,
  } = props;

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
  const [shadowsActive, setShadowsActive] = createSignal({
    first: false,
    last: false,
    transition: shadow.transitionInit || false,
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

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const shadowContainerEl = sentinelShadowState.get(target)!;
        const shadowEl = shadowContainerEl.firstElementChild as HTMLElement;
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
            transition: shadow.transitionInit || !init,
          }));
        } else {
          setShadowsActive((prev) => ({
            ...prev,
            last: !isVisible,
            transition: shadow.transitionInit || !init,
          }));
        }
      });

      init = false;
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
    const { rtl } = props;

    return `position: relative; ${rtl ? "direction: rtl;" : ""}`;
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
        shadow={props.shadow}
        rtl={props.rtl}
        active={shadowsActive().first}
        transitionActive={shadowsActive().transition}
        ref={shadowFirstEl}
      />
      <Shadow
        child="last"
        direction={props.direction}
        shadow={props.shadow}
        active={shadowsActive().last}
        transitionActive={shadowsActive().transition}
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
  animation,
  direction,
  isFirst,
  show,
  rtl,
}: {
  show: boolean;
  animation: "opacity" | "slide";
  direction: "horizontal" | "vertical";
  isFirst: boolean;
  rtl: boolean;
}) => {
  if (animation === "opacity") {
    return show ? "1" : "0";
  }

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
    ref: any;
    active: boolean;
    transitionActive: boolean;
  } & TShared
> = (props) => {
  const { child } = props;
  let shadowEl!: HTMLDivElement;
  let animatedEl!: HTMLDivElement;
  const isFirst = child === "first";
  let prevDirection: "horizontal" | "vertical" | null = null;
  let prevRTL: boolean = false;
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
    const { direction, rtl = false, shadow = {} } = props;
    let { size = "50px", invert = null } = shadow;

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

  const getShadowStyle = () => {
    let {
      active,
      transitionActive,
      shadow = {},
      direction,
      rtl = false,
    } = props;
    const {
      animation = "opacity",
      class: className,
      shape = "rectangle",
      transition = "300ms",
      invert,
    } = shadow;
    if (shadow.elements) return null;

    const animationProp = animation === "opacity" ? animation : "transform";

    if (prevDirection !== direction) {
      transitionActive = false;
      prevDirection = direction;
    }

    if (prevRTL !== rtl) {
      transitionActive = false;
      prevRTL = rtl;
    }

    const [color, transparentColor] = getColors(
      shadow.color,
      shadow.colorToRGBA != null ? shadow.colorToRGBA : isSafari
    );

    const getInvertScale = () => {
      if (!invert) return "";
      if (invert !== child) return "";
      // if (!rtl) return "";

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
        return `radial-gradient(farthest-side at ${x} ${y},${transparentColor} 25%,${color})`;
      }

      const x = direction === "horizontal" ? right : "bottom";
      const y = direction === "horizontal" ? left : "top";

      return `linear-gradient(to ${
        isFirst ? x : y
      }, ${color}, 50%, ${transparentColor})`;
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
        animation: animation!,
        direction,
        isFirst,
        show: active,
        rtl: rtl!,
      }),
      transform: animationState({
        animation: animation!,
        direction,
        isFirst,
        show: active,
        rtl: rtl!,
      }),
      invertScale: getInvertScale(),
    };
  };

  const getCustomShadowStyle = () => {
    const {
      active,
      transitionActive,
      direction,
      rtl = false,
      shadow = {},
    } = props;
    if (!shadow.elements) return "";

    const { transition, animation } = shadow;

    const animationProp = animation === "opacity" ? animation : "transform";

    const transitionDeclaration = transitionActive
      ? `transition: ${animationProp} ${parseVal(transition, "ms")};`
      : "";

    return `height: 100%; width: 100%; ${animationProp}: ${animationState({
      animation: animation!,
      direction,
      isFirst,
      show: active,
      rtl: rtl!,
    })}; ${transitionDeclaration}`;
  };

  const getAnimatedElClassNames = () => {
    const { active, transitionActive, shadow = {} } = props;
    const { animateClassNames } = shadow;
    if (!animateClassNames) return "";
    const state = active ? "-show" : "-hide";
    const init = !transitionActive ? `${animateClassNames}-init` : "";

    return `${animateClassNames} ${init} ${animateClassNames}${state}`;
  };

  createEffect(() => {
    const {
      backgroundImage,
      backgroundPosition,
      backgroundRepeat,
      backgroundSize,
      transition,
      opacity,
      transform,
      invertScale,
    } = getShadowStyle()!;
    const { shadow = {}, active, transitionActive } = props;

    if (shadow.elements) {
      if (shadow.onAnimate) {
        shadow.onAnimate({
          target: shadow.elements[child] as HTMLElement,
          active,
          isFirst: child === "first",
          init: transitionActive,
        });
      }
      return;
    }

    shadowEl.style.backgroundImage = backgroundImage;
    shadowEl.style.backgroundPosition = backgroundPosition;
    shadowEl.style.backgroundRepeat = backgroundRepeat;
    shadowEl.style.backgroundSize = backgroundSize;
    shadowEl.style.transform = invertScale;

    if (shadow.onAnimate) {
      shadow.onAnimate({
        target: shadowEl,
        active,
        isFirst: child === "first",
        init: !transitionActive,
      });
      return;
    }

    if (shadow.animateClassNames) return;

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
          when={props.shadow && props.shadow.elements}
          fallback={
            <div
              class={getAnimatedElClassNames()}
              style="width: 100%; height: 100%;"
              ref={animatedEl}
              {...dataAttribute}
            >
              <div
                class={props.shadow && props.shadow.class}
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
              class={props.shadow && props.shadow.class}
              style={getCustomShadowStyle()}
            >
              <Switch>
                <Match when={child === "first"}>
                  {props.shadow && props.shadow.elements!.first}
                </Match>
                <Match when={child === "last"}>
                  {props.shadow && props.shadow.elements!.last}
                </Match>
              </Switch>
            </div>
          </div>
        </Show>
      </div>
    </div>
  );
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

export const isSafari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);

export default ScrollShadows;
