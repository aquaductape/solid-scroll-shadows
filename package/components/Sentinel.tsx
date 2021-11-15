import { Component } from "solid-js";
import { TScrollShadows } from "../types";

const Sentinel: Component<
  Pick<TScrollShadows, "direction" | "rtl"> & { child: "first" | "last" }
> = (props) => {
  const { direction, child } = props;

  const setPosition = () => {
    const isFirst = child === "first";
    const rtl = props.rtl;
    const marginLeft = rtl ? "margin-right" : "margin-left";
    const left = rtl ? "right" : "left";
    const right = rtl ? "left" : "right";

    if (direction === "row") {
      return `position: ${isFirst ? "absolute" : "static"}; top: 0; ${
        isFirst ? left : right
      }: 0; height: 100%; width: 5px; ${
        isFirst ? "" : `flex-shrink: 0; ${marginLeft}: -5px;`
      }`;
    }
    return `position: ${isFirst ? "absolute" : "static"}; left: 0; ${
      isFirst ? "top" : "bottom"
    }: 0; height: 5px; width: 100% ${
      isFirst ? "" : "flex-shrink: 0; margin-top: -5px;"
    }`;
  };
  const style = () => `pointer-events: none; ${setPosition()}; `;
  return <div aria-hidden="true" style={style()}></div>;
};

export default Sentinel;
