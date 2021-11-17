import { Component } from "solid-js";
import { ShadowChildComponent, TScrollShadows } from "../types";

const Shadow: Component<
  { ref: any } & Pick<
    TScrollShadows,
    | "direction"
    | "rtl"
    | "justifyShadowsToContentItems"
    | "shadowsClass"
    | "shadowsBlockClass"
  > &
    ShadowChildComponent
> = (props) => {
  const {
    child,
    direction,
    ref,
    justifyShadowsToContentItems,
    shadowsClass,
    shadowsBlockClass,
  } = props;
  const refCb = (el: HTMLElement) => {
    ref(el);
    divEl = el;
  };
  let divEl!: HTMLElement;
  let init = true;

  const getOpacity = () => {
    if (init && child === "before") return "0";
    init = false;
    return divEl ? divEl.style.opacity : "";
  };

  const containerStyle = () =>
    setShadowStyle({
      child,
      direction,
      rtl: props.rtl,
      opacity: getOpacity(),
    });

  const shadowStyle = () =>
    `${setShadowPosition({
      child,
      rtl: props.rtl,
      direction: props.direction,
    })}${setShadowGradient({
      child,
      direction,
      rtl: props.rtl,
    })}`;

  const solidStyle = () =>
    `${setShadowPosition({
      child,
      rtl: props.rtl,
      direction: props.direction,
      isSolid: true,
    })}; background: #fff; transform: scale${
      props.direction === "column" ? "Y" : "X"
    }(0);`;

  const mirroredStyle = () => {
    const scale = direction === "column" ? "scaleY" : "scaleX";
    return child === "before" ? `transform: ${scale}(-1);` : "";
  };

  return (
    <div
      aria-hidden="true"
      style={`position: absolute; z-index: 1; pointer-events: none; ${mirroredStyle()} ${
        !justifyShadowsToContentItems ? "overflow: hidden" : ""
      } transition: 300ms opacity;${containerStyle()}`}
      ref={refCb}
    >
      {/* static shadow */}
      <div style={shadowStyle()}>
        <div class={shadowsClass}></div>
      </div>
      {/* smart shadow */}
      <div class={shadowsBlockClass} style={solidStyle()}></div>
    </div>
  );
};

// rtl is right

export const setShadowPosition = ({
  rtl,
  child,
  direction,
  isSolid,
}: Pick<TScrollShadows, "rtl" | "direction"> &
  ShadowChildComponent & { isSolid?: boolean }) => {
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";
  let transformOrigin = child === "before" ? right : right;

  if (direction === "column") {
    transformOrigin = child === "before" ? "top" : "bottom";
  }
  const width = `width: ${direction === "row" ? "" : "100%"}`;
  const height = `height: ${direction === "row" ? "100%" : ""}`;
  const position = isSolid ? "position: absolute;" : "";

  return `${position} top: 0; transition: 0ms transform; ${width}; ${height}; transform-origin: ${transformOrigin};`;
};

export const setShadowStyle = ({
  child,
  direction,
  rtl,
  opacity,
  transform,
}: Pick<TScrollShadows, "direction" | "rtl"> &
  ShadowChildComponent & {
    gradientStart?: string;
    transform?: string;
    opacity: string;
  }) => {
  const isFirst = child === "before";
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";
  const width = `width: ${direction === "row" ? "" : "100%"}`;
  const height = `height: ${direction === "row" ? "100%" : ""}`;

  if (direction === "row") {
    return `top: 0; ${
      isFirst ? left : right
    }: 0; ${width}; ${height}; opacity: ${opacity}; transform: ${transform};`;
  }
  return `left: 0; ${
    isFirst ? "top" : "bottom"
  }: 0; ${width}; ${height}; opacity: ${opacity}; transform: ${transform};`;
};

const setShadowGradient = ({
  child,
  direction,
  rtl,
  gradientStart,
}: Pick<TScrollShadows, "direction" | "rtl"> &
  ShadowChildComponent & {
    gradientStart?: string;
  }) => {
  const isFirst = child === "before";
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";

  if (direction === "row") {
    return `background-image: linear-gradient(to ${
      left
      // isFirst ? right : left
    }, rgba(255, 255, 255, 1) ${
      gradientStart || "5%"
    }, rgba(255, 255, 255, 0));`;
  }
  return `background-image: linear-gradient(to ${
    "top"
    // isFirst ? "bottom" : "top"
  }, rgba(255, 255, 255, 1) ${gradientStart || "5%"}, rgba(255, 255, 255, 0));`;
};

export default Shadow;
