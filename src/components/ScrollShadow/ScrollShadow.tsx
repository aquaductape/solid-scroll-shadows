import { Component, onCleanup, onMount, JSX } from "solid-js";

type TShared = {
  direction: "horizontal" | "vertical";
  child: "first" | "last";
  initShadowSize?: boolean;
  onEndsHit?: (props: {
    isFirstShadow: boolean;
    entry: IntersectionObserverEntry;
    hitEnd: boolean;
    shadow: HTMLElement;
  }) => void;
  shadow?: {
    size?: string | number;
    color?: string;
    transition?: string;
    first?: JSX.Element;
    last?: JSX.Element;
    colorToRGBA?: boolean; // enable to support tranparent gradient in Safari https://css-tricks.com/thing-know-gradients-transparent-black/, will convert color values to rgba. If value is css variable it will have have to compute style of document element. This is automatically set to true is useragent is Safari.
    smartHiding?: boolean; // places shadow on halfway across remaining tail end items for better confirmation that the container is scrollable. Uses runtime layout calculation, which could be a problem if there are a lot of visiable items in the scrollable container.
  };
  endsDetectionMargin?: string | number; // position to fire when scroll container is at beginning or end, default is 0px;
};

/**
 *
 * child scrollable container should have already have overflow property and should have `position: relative;` in order to make Intersection Observer to work.
 */
const ScrollShadow: Component<
  {
    class: string;
  } & Omit<TShared, "child">
> = (props) => {
  const propHasShadowColor = props.shadow && props.shadow.color;
  const {
    class: className,
    direction,
    initShadowSize,
    shadow = {},
    endsDetectionMargin,
    onEndsHit,
  } = props;

  if (shadow.size == null) shadow.size = "50px";
  if (shadow.color == null) shadow.color = "rgba(255, 255, 255, 1)";
  if (shadow.transition == null) shadow.transition = "300ms";
  if (shadow.colorToRGBA == null) shadow.colorToRGBA = isSafari;

  let transparentColor = "transparent";

  if (shadow.colorToRGBA && propHasShadowColor) {
    console.log(shadow.color);
    const colorArr = colorToRGBA(shadow.color!);
    shadow.color = colorArrToCSS({ colorArr });
    transparentColor = colorArrToCSS({ colorArr, alpha: 0 });
    // console.log(transparentColor, shadow.colorToRGBA);
  }

  const sentinelShadowState = new Map<HTMLElement, HTMLElement>();
  let shadowFirstEl!: HTMLElement;
  let shadowLastEl!: HTMLElement;
  let sentinelFirstEl = (
    <Sentinel
      child="first"
      direction={direction}
      endsDetectionMargin={endsDetectionMargin}
    />
  ) as HTMLElement;
  let sentinelLastEl = (
    <Sentinel
      child="last"
      direction={direction}
      endsDetectionMargin={endsDetectionMargin}
    />
  ) as HTMLElement;
  let init = true;
  let initResetSize = false;

  // won't work for SSR
  const children = props.children as HTMLElement;
  children.appendChild(sentinelFirstEl);
  children.appendChild(sentinelLastEl);

  onMount(() => {
    const resetInitShadowSize = () => {
      if (!initShadowSize) return;

      if (!init && !initResetSize) {
        sentinelShadowState.forEach((item) => {
          item.style.transform = "";
        });
        initResetSize = true;
      }
    };

    const setInitShadowSize = () => {
      if (!initShadowSize) return;

      sentinelShadowState.forEach((item) => {
        item.style.transform = "scaleX(3)";
        shadowLastEl.style.transformOrigin = "right";
      });
    };

    const runSmartHiding = () => {
      if (!shadow.smartHiding) return;

      const shadowLastBCR = shadowLastEl.getBoundingClientRect();
      const scrollContainerItems = children.children;
      let prevBCR!: DOMRect | null;

      const getLastViewableItem = (
        currentItemBCR: DOMRect,
        prevItemBCR: DOMRect | null
      ) => {
        const viewable = 20; // 20px

        if (shadowLastBCR.right / currentItemBCR.right > 0.8) {
          return;
        }
        if (!prevItemBCR) return;

        const diff =
          prevItemBCR.left - shadowLastBCR.right + shadowLastBCR.width;
        const newWidth = diff + shadowLastBCR.width;
        // const newGradientPosition = (shadowLastBCR.width / newWidth) + 1

        shadowLastEl.style.width = `${newWidth}px`;
      };

      for (let i = 1; i < scrollContainerItems.length; i++) {
        const item = scrollContainerItems[i] as HTMLElement;
        if (item == null) return;
        const itemBCR = item.getBoundingClientRect();

        if (itemBCR.left > shadowLastBCR.right) {
          getLastViewableItem(itemBCR, prevBCR);
          return;
        }
        prevBCR = itemBCR;
      }
    };

    runSmartHiding();

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const target = entry.target as HTMLElement;
        const shadowEl = sentinelShadowState.get(target);

        onEndsHit &&
          onEndsHit({
            entry,
            isFirstShadow: shadowEl === shadowFirstEl,
            shadow: shadowEl!,
            hitEnd: entry.isIntersecting,
          });

        let isVisible = false;

        if (entry.isIntersecting) {
          isVisible = true;
        }
        shadowEl!.style.opacity = isVisible ? "0" : "1";

        resetInitShadowSize();
      });

      init = false;
    });

    sentinelShadowState.set(sentinelFirstEl, shadowFirstEl);
    sentinelShadowState.set(sentinelLastEl, shadowLastEl);

    observer.observe(sentinelFirstEl);
    observer.observe(sentinelLastEl);
    setInitShadowSize();

    onCleanup(() => observer && observer.disconnect());
  });

  return (
    <div class={className}>
      <Shadow
        child="first"
        direction={direction}
        shadow={shadow}
        tranparentColor={transparentColor}
        ref={shadowFirstEl}
      />
      <Shadow
        child="last"
        direction={direction}
        shadow={shadow}
        tranparentColor={transparentColor}
        ref={shadowLastEl}
      />

      {children}
    </div>
  );
};

const Sentinel: Component<
  Pick<TShared, "direction" | "child" | "endsDetectionMargin">
> = ({ direction, child, endsDetectionMargin = 0 }) => {
  const setPosition = (direction: string) => {
    const isFirst = child === "first";
    if (direction === "horizontal") {
      return `position: ${isFirst ? "absolute" : "relative"}; top: 0; ${
        isFirst ? "left" : "right"
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

const Shadow: Component<{ ref: any; tranparentColor: string } & TShared> = ({
  child,
  direction,
  ref,
  shadow,
  tranparentColor,
}) => {
  let { color, size, transition } = shadow!;
  size = parseVal(size);

  const setPosition = () => {
    const isFirst = child === "first";
    if (direction === "horizontal") {
      return `top: 0; ${
        isFirst ? "left" : "right"
      }: 0;   background: linear-gradient(to ${
        isFirst ? "right" : "left"
      }, ${color}, 50%, ${tranparentColor}); width: ${size}; height: 100%;`;
    }

    return `left: 0; ${
      isFirst ? "top" : "bottom"
    }: 0; background: linear-gradient(to ${
      isFirst ? "bottom" : "top"
    }, ${color}, 50%, ${tranparentColor}); width: 100%; height: ${size}`;
  };
  const style = `position: absolute; z-index: 1; pointer-events: none; opacity: 0; transition: 300ms opacity, 300ms transform; ${setPosition()};`;

  return <div ref={ref} style={style}></div>;
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

const parseVal = (value?: string | number) => {
  if (typeof value === "number") return `${value}px`;

  return value;
};

export const isSafari =
  userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);

export default ScrollShadow;
