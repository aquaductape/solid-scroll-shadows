import { Component } from "solid-js";
import { TScrollShadows } from "../types";

const Shadow: Component<
  { ref: any } & Pick<
    TScrollShadows,
    "direction" | "rtl" | "shadowSize" | "smartShadowSize"
  > & {
      child: "first" | "last";
    }
> = (props) => {
  const { child, direction, ref, shadowSize, smartShadowSize } = props;
  const refCb = (el: HTMLElement) => {
    ref(el);
    divEl = el;
  };
  let divEl!: HTMLElement;

  const containerStyle = () =>
    setShadowStyle({
      child,
      direction,
      rtl: props.rtl,
      opacity: divEl ? divEl.style.opacity : "",
      shadowSize,
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
    })}; background: #fff; transform: scale${
      props.direction === "column" ? "Y" : "X"
    }(0);`;

  return (
    <div
      aria-hidden="true"
      style={`position: absolute; z-index: 1; pointer-events: none; ${
        !smartShadowSize ? "overflow: hidden" : ""
      } transition: 300ms opacity;${containerStyle()}`}
      ref={refCb}
    >
      {/* static shadow */}
      <div style={shadowStyle()}></div>
      {/* smart shadow */}
      <div style={solidStyle()}></div>
    </div>
  );
};

// rtl is right

export const setShadowPosition = ({
  rtl,
  child,
  direction,
}: Pick<TScrollShadows, "rtl" | "direction"> & { child: "first" | "last" }) => {
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";
  let transformOrigin = child === "first" ? left : right;

  if (direction === "column") {
    transformOrigin = child === "first" ? "top" : "bottom";
  }

  return `position: absolute; transition: 300ms transform; height: 100%; width: 100%; transform-origin: ${transformOrigin};`;
};

export const setShadowStyle = ({
  child,
  direction,
  shadowSize,
  rtl,
  opacity,
  transform,
}: Pick<TScrollShadows, "direction" | "rtl" | "shadowSize"> & {
  child: "first" | "last";
  gradientStart?: string;
  transform?: string;
} & { opacity: string }) => {
  const isFirst = child === "first";
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";
  const width = `width: ${direction === "row" ? shadowSize : "100%"}`;
  const height = `height: ${direction === "row" ? "100%" : shadowSize}`;

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
}: Pick<TScrollShadows, "direction" | "rtl"> & {
  child: "first" | "last";
  gradientStart?: string;
}) => {
  const isFirst = child === "first";
  const left = rtl ? "right" : "left";
  const right = rtl ? "left" : "right";

  if (direction === "row") {
    return `background-image: linear-gradient(to ${
      isFirst ? right : left
    }, rgba(255, 255, 255, 1) ${
      gradientStart || "5%"
    }, rgba(255, 255, 255, 0));`;
  }
  return `background-image: linear-gradient(to ${
    isFirst ? "bottom" : "top"
  }, rgba(255, 255, 255, 1) ${gradientStart || "5%"}, rgba(255, 255, 255, 0));`;
};

export default Shadow;
