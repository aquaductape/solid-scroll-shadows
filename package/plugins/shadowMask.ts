import { TOnAtEndsProps } from "../types";
import { parseUnit } from "../utils";

type ShadowMaskProps = {
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  size?: number | string;
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  rowSize?: number | string;
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  columnSize?: number | string;
  /**
   * @defaultValue `"-webkit-mask-position 250ms ease-in-out, mask-position 250ms ease-in-out"`
   */
  transition?:
    | {
        /**
         * @defaultValue `250`
         */
        duration?: number;
        /**
         * @defaultValue `"ease-in-out"`
         */
        easing?: string;
        /**
         * @defaultValue `0`
         */
        delay?: number;
      }
    | string;
};

export const shadowMask = (props: ShadowMaskProps = {}) => {
  const onAtEndsCallback = ({
    type,
    rtl,
    isAtStart,
    isAtEnd,
    direction,
    scrollContainerEl,
    init,
  }: TOnAtEndsProps) => {
    const el = scrollContainerEl.parentElement as HTMLElement;

    const getMaskPosition = () => {
      const positionValue: string | number = parseUnit(value, {
        reverseVal: true,
      });
      const positionStart = isAtStart ? positionValue : 0;
      const positionStartNone = isAtStart ? 0 : positionValue;
      const positionEnd = isAtEnd ? 0 : positionValue;
      const positionEndNone = isAtEnd ? positionValue : 0;
      const startValue = !rtl ? positionStart : positionStartNone;
      const endValue = !rtl ? positionEnd : positionEndNone;
      const startX = direction === "column" ? 0 : startValue;
      const endX = direction === "column" ? 0 : endValue;
      const startY = direction === "column" ? positionStart : 0;
      const endY = direction === "column" ? positionEnd : 0;
      return `${startX} ${startY}, ${endX} ${endY}`;
    };

    const getValue = () => {
      if (!props) return 30;
      if (props.size) return props.size || 30;
      return (
        direction === "column" ? props.columnSize : props.rowSize
      ) as number;
    };
    const getTransition = () => {
      if (!props || !props.transition) {
        const transitionProps = "250ms ease-in-out";
        return `-webkit-mask-position ${transitionProps}, mask-position ${transitionProps}`;
      }
      if (typeof props.transition === "string") return props.transition;
      const getVal = (input: any) => {
        if (!input) return null;
        parseUnit(input, { unit: "ms" });
      };

      const duration = getVal(props.transition.duration) || "250ms";
      const easing = props.transition.easing || "ease-in-out";
      const delay = getVal(props.transition.delay) || "";
      const transitionProps = `${duration} ${easing} ${delay}`;

      return `-webkit-mask-position ${transitionProps}, mask-position ${transitionProps}`;
    };

    const value = getValue();
    const sizeUnit = parseUnit(value);

    const maskPosition = getMaskPosition();

    const linearDirection = (start: boolean) => {
      if (direction === "column") {
        return start ? "bottom" : "top";
      }
      const right = !rtl ? "right" : "left";
      const left = !rtl ? "left" : "right";
      return start ? right : left;
    };

    const maskImage = `linear-gradient(to ${linearDirection(
      true
    )}, transparent 0px, #000 ${sizeUnit}), linear-gradient(to ${linearDirection(
      false
    )}, transparent 0px, #000 ${sizeUnit})`;
    const maskSizeValue = `calc(100% + ${sizeUnit})`;
    const maskSize =
      direction == "column" ? `100% ${maskSizeValue}` : `${maskSizeValue} 100%`;

    el.style.webkitMaskImage = maskImage;
    // @ts-ignore
    el.style.maskImage = maskImage;
    el.style.webkitMaskSize = maskSize;
    // @ts-ignore
    el.style.maskSize = maskSize;
    el.style.webkitMaskPosition = maskPosition;
    // @ts-ignore
    el.style.maskPosition = maskPosition;
    el.style.webkitMaskComposite = "source-in";
    // @ts-ignore
    el.style.maskComposite = "intersect";
    if (!init) {
      el.style.transition = getTransition();
    }
  };

  return onAtEndsCallback;
};
