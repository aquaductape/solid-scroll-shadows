import { Component, onCleanup, onMount, JSX } from "solid-js";
import { isServer } from "solid-js/web";

export type ScrollShadowsOnEndsHit = (props: {
  isFirstShadow: boolean;
  entry: IntersectionObserverEntry;
  hitEnd: boolean;
  shadow: HTMLElement;
}) => boolean | void;

export type ScrollShadowsShadow = {
  /**
   * Default: `rectangle`
   */
  shape?: "rectangle" | "concave" | "convex";
  size?: string | number;
  /**
   * Default: `#fff`
   *
   * css color value, for shadow gradient.
   */
  color?: string;
  /**
   * image url or css gradient
   */
  image?: {
    first: string;
    last: string;
  };
  animation?: "opacity" | "slide";
  /**
   * animation duration of hiding/showing shadow
   */
  transition?: string | number;
  /**
   * Default: `false`. Is `true` if useragent is Safari.
   *
   * Converts `color` to rgba tranparent equivalent.
   *
   * To fix to Safari's [transparent behavior](https://css-tricks.com/thing-know-gradients-transparent-black/), it will convert `color` value to rgba. If the value is a css variable it will have have to compute style of document element. This is automatically set to true if useragent is Safari.
   */
  colorToRGBA?: boolean;
  components?: {
    first: JSX.Element;
    last: JSX.Element;
    /**
     * Default: `true`
     *
     * Adds default styling such as position, width, ect.
     */
    defaultStyle?: boolean;
  };
};

export type ScrollShadowsComponent = {
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
   * Default: `0px`
   *
   * Set Ends positions to fire when scroll container is at beginning or end;
   */
  endsDetectionMargin?: string | number;
  shadow?: ScrollShadowsShadow;
  /**
   * Default `false`
   *
   * When enabled, shadow state is determined via Intersection Observer API. It observes "sentinel" divs at each end of the scrollable container, which can have better scrolling performance.
   *
   * Use case for disabling it, is when passing a third party list component, such as [Windowing/Virtual](https://praekiko.medium.com/what-is-windowing-also-i-have-heard-about-react-window-and-react-virtualized-c29dc843f4e0). Since the "sentinel"s are inserted in scrollable container, the third party component is unaware of them and could cause potential issues.
   *
   */
  disableIntersectionObserver?: boolean;
};

type TShared = {
  child: "first" | "last";
} & ScrollShadowsComponent;

/**
 *
 * child scrollable container should have already have overflow property and should have `position: relative;` in order to make Intersection Observer to work.
 */
const ScrollShadows: Component<
  {
    class: string;
  } & Omit<TShared, "child">
> = (props) => {
  const propHasShadowColor = props.shadow && props.shadow.color;
  const {
    class: className,
    direction,
    shadow = {},
    endsDetectionMargin,
    onEndsHit,
    hover,
    rtl = false,
  } = props;

  if (shadow.size == null) shadow.size = "50px";
  if (shadow.color == null) shadow.color = "rgba(255, 255, 255, 1)";
  if (shadow.transition == null) shadow.transition = "300ms";
  if (shadow.colorToRGBA == null) shadow.colorToRGBA = isSafari;
  if (shadow.shape == null) shadow.shape = "rectangle";
  if (shadow.animation == null) shadow.animation = "opacity";

  let transparentColor = "transparent";

  if (shadow.colorToRGBA && propHasShadowColor) {
    const colorArr = colorToRGBA(shadow.color!);
    shadow.color = colorArrToCSS({ colorArr });
    transparentColor = colorArrToCSS({ colorArr, alpha: 0 });
  }

  const sentinelShadowState = new Map<HTMLElement, HTMLElement>();
  let shadowFirstEl!: HTMLElement;
  let shadowLastEl!: HTMLElement;
  let sentinelFirstEl = (
    <Sentinel
      child="first"
      direction={direction}
      endsDetectionMargin={endsDetectionMargin}
      rtl={rtl}
    />
  ) as HTMLElement;
  let sentinelLastEl = (
    <Sentinel
      child="last"
      direction={direction}
      endsDetectionMargin={endsDetectionMargin}
      rtl={rtl}
    />
  ) as HTMLElement;
  let container!: HTMLDivElement;
  let init = true;
  let initTransition: string | null = "";

  // won't work for SSR
  const scrollableContainer = props.children as HTMLElement;
  scrollableContainer.appendChild(sentinelFirstEl);
  scrollableContainer.appendChild(sentinelLastEl);

  const scrollHorizontally = (e: WheelEvent) => {
    const target = e.currentTarget as HTMLElement;

    target.scrollLeft += e.deltaY;
  };

  const onScrollableContainerHover = (e: MouseEvent) => {
    if (e.type === "mouseleave") {
      scrollableContainer.addEventListener(
        "mouseover",
        onScrollableContainerHover
      );
      sentinelShadowState.forEach((shadowContainerEl) => {
        shadowContainerEl.style.opacity = "0.8";
      });
      return;
    }
    scrollableContainer.removeEventListener(
      "mouseover",
      onScrollableContainerHover
    );
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

        const animationValue = animationState({
          animation: shadow.animation!,
          direction,
          isFirst: isFirstShadow,
          show: !isVisible,
          rtl,
        });

        if (init) {
          initTransition = shadowEl!.style.transition;
          shadowEl!.style.transition = "";
        } else {
          shadowEl!.style.transition = initTransition!;
        }

        if (shadow.animation === "opacity") {
          shadowEl!.style.opacity = animationValue;
        }

        if (shadow.animation === "slide") {
          shadowEl!.style.transform = animationValue;
        }
      });

      init = false;
    });

    if (direction === "horizontal") {
      scrollableContainer.addEventListener("wheel", scrollHorizontally);
    }

    if (hover) {
      shadowFirstEl.style.opacity = "0.8";
      shadowLastEl.style.opacity = "0.8";
      scrollableContainer.addEventListener(
        "mouseover",
        onScrollableContainerHover
      );
      scrollableContainer.addEventListener(
        "mouseleave",
        onScrollableContainerHover
      );
    }

    sentinelShadowState.set(sentinelFirstEl, shadowFirstEl);
    sentinelShadowState.set(sentinelLastEl, shadowLastEl);

    observer.observe(sentinelFirstEl);
    observer.observe(sentinelLastEl);

    onCleanup(() => observer && observer.disconnect());
  });

  return (
    <div class={className} ref={container}>
      <Shadow
        child="first"
        direction={direction}
        shadow={shadow}
        tranparentColor={transparentColor}
        rtl={rtl}
        ref={shadowFirstEl}
      />
      <Shadow
        child="last"
        direction={direction}
        shadow={shadow}
        tranparentColor={transparentColor}
        rtl={rtl}
        ref={shadowLastEl}
      />

      {scrollableContainer}
    </div>
  );
};

const Sentinel: Component<
  Pick<TShared, "direction" | "child" | "endsDetectionMargin" | "rtl">
> = ({ direction, child, endsDetectionMargin = 0, rtl }) => {
  const setPosition = (direction: string) => {
    const isFirst = child === "first";
    const left = rtl ? "right" : "left";
    const right = rtl ? "left" : "right";
    if (direction === "horizontal") {
      return `position: ${isFirst ? "absolute" : "relative"}; top: 0; ${
        isFirst ? left : right
      }: ${endsDetectionMargin}; height: 100%; width: 1px; ${
        isFirst ? "" : "flex-shrink: 0; margin-left: -1px;"
      }`;
    }
    return `position: ${isFirst ? "absolute" : "static"}; left: 0; ${
      isFirst ? "top" : "bottom"
    }: ${endsDetectionMargin}; height: 1px; width: 100% ${
      isFirst ? "" : "flex-shrink: 0; margin-top: -1px;"
    }`;
  };
  const style = `pointer-events: none; ${setPosition(direction)}; `;
  return <div style={style}></div>;
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
  const from = rtl ? "100%" : "-100%";
  const to = rtl ? "-100%" : "100%";

  const value = show ? "0%" : isFirst ? from : to;

  if (direction === "horizontal") {
    return `translateX(${value})`;
  }

  return `translateY(${value})`;
};

const Shadow: Component<{ ref: any; tranparentColor: string } & TShared> = ({
  child,
  direction,
  ref,
  shadow,
  tranparentColor,
  rtl,
}) => {
  let { color, size, transition, image, shape, animation } = shadow!;
  const animationProp = animation === "opacity" ? animation : "transform";
  const isFirst = child === "first";
  const right = rtl ? "left" : "right";
  const left = rtl ? "right" : "left";

  size = parseVal(size);

  const bgRepeat = shape !== "rectangle" ? "background-repeat: no-repeat;" : "";

  const getLinearGradient = (
    isFirst: boolean,
    direction: "horizontal" | "vertical"
  ) => {
    const x = direction === "horizontal" ? right : "bottom";
    const y = direction === "horizontal" ? left : "top";

    return `background: linear-gradient(to ${
      isFirst ? x : y
    }, ${color}, 50%, ${tranparentColor});`;
  };

  const getRadialGradient = (
    isFirst: boolean,
    direction: "horizontal" | "vertical"
  ) => {
    if (shape === "convex") {
      const from = rtl ? "100%" : "0%";
      const to = rtl ? "0%" : "100%";
      const x = direction === "horizontal" ? (isFirst ? from : to) : "50%";
      const y = direction === "horizontal" ? "50%" : isFirst ? "0%" : "100%";
      const bgPosition =
        direction === "horizontal"
          ? isFirst
            ? left
            : right
          : isFirst
          ? "top"
          : "bottom";
      // const bgFrom = rtl ? "75% 25%, 100% 100%": "25% 75%, 100% 100%"
      // const bgTo = rtl ? "25% 75%, 100% 100%": "75% 25%, 100% 100%"
      const bgSize =
        direction === "horizontal"
          ? "25% 75%, 100% 100%"
          : "75% 25%, 100% 100%";

      return `background: radial-gradient(farthest-side at ${x} ${y},${color} 25%, ${tranparentColor}), radial-gradient(farthest-side at ${x} ${y},${color} -15%,${tranparentColor}); background-size: ${bgSize}; background-position: ${bgPosition};`;
    }

    const from = rtl ? "0%" : "100%";
    const to = rtl ? "100%" : "0%";
    const x = direction === "horizontal" ? (isFirst ? from : to) : "50%";
    const y = direction === "horizontal" ? "50%" : isFirst ? "100%" : "0%";
    const bgPosition = direction === "horizontal" ? "right" : "center center";
    const bgSize = direction === "horizontal" ? "100% 345%" : "345% 100%";

    return `background: radial-gradient(farthest-side at ${x} ${y},${tranparentColor} 25%,${color}); background-size: ${bgSize}; background-position: ${bgPosition};`;
  };

  const getImage = (isFirst: boolean) => {
    const imageResult = isFirst ? image?.first : image?.last;
    return `background: ${imageResult};`;
  };

  const bgImage = image
    ? getImage(isFirst)
    : shape === "rectangle"
    ? getLinearGradient(isFirst, direction)
    : getRadialGradient(isFirst, direction);

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
  const style = `position: absolute; z-index: 1; pointer-events: none; overflow: hidden; transition: opacity 300ms; ${getPositionSize()}; `;

  const shadowStyle = `width: 100%; height: 100%; ${bgImage} ${animationProp}: ${animationState(
    { animation: animation!, direction, isFirst, show: false, rtl: rtl! }
  )}; transition: ${animationProp} ${parseVal(transition, "ms")}; ${bgRepeat}`;

  return (
    <div ref={ref} style={style}>
      <div style={shadowStyle}></div>
    </div>
  );
};

// https://gist.github.com/njvack/02ad8efcb0d552b0230d
const colorToRGBA = (color: string) => {
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

  return value;
};

export const isSafari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);

export default ScrollShadows;

// convex

// background-size: 15% 75%, 50% 100%;
// background-position: right;

// concave

// background: radial-gradient(farthest-side at 0% 50%,transparent 25%,red);
// background-repeat: no-repeat;
// background-size: 100% 345%;
// background-position: right;
