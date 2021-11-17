import { Component } from "solid-js";
import { ShadowChildComponent, TScrollShadows } from "../types";

const Sentinel: Component<
  Pick<TScrollShadows, "direction" | "rtl" | "endsMargin"> &
    ShadowChildComponent
> = (props) => {
  const { direction, child, endsMargin = 0 } = props;

  const setPosition = () => {
    const isFirst = child === "before";
    const rtl = props.rtl;
    const marginLeft = rtl ? "margin-right" : "margin-left";
    const left = rtl ? "right" : "left";
    const right = rtl ? "left" : "right";
    const position = isFirst ? "absolute" : "relative";

    if (direction === "row") {
      return `position: ${position}; top: 0; ${
        isFirst ? left : right
      }: ${endsMargin}px; height: 100%; width: 5px; ${
        isFirst ? "" : `flex-shrink: 0; ${marginLeft}: -5px;`
      }`;
    }
    return `position: ${position}; left: 0; ${
      isFirst ? "top" : "bottom"
    }: ${endsMargin}px; height: 5px; width: 100% ${
      isFirst ? "" : "flex-shrink: 0; margin-top: -5px;"
    }`;
  };
  const style = () => `pointer-events: none; ${setPosition()}; `;
  return <div aria-hidden="true" style={style()}></div>;
};

export default Sentinel;
