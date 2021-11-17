import { Component, Show } from "solid-js";
import {
  ShadowChildComponent,
  ShadowClassName,
  TScrollShadows,
} from "../types";

const Shadow: Component<
  { ref: any } & Pick<
    TScrollShadows,
    | "direction"
    | "rtl"
    | "justifyShadowsToContentItems"
    | "shadowsClass"
    | "shadowsBlockClass"
    | "shadowsElement"
    | "animation"
  > &
    ShadowChildComponent
> = (props) => {
  const {
    child,
    direction,
    ref,
    justifyShadowsToContentItems,
    animation,
    shadowsElement,
  } = props;
  const refCb = (el: HTMLElement) => {
    ref(el);
    divEl = el;
  };
  let divEl!: HTMLElement;
  let init = true;

  const getOpacity = () => {
    if (animation) return "";

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
    })}`;

  const solidStyle = () =>
    `${setShadowPosition({
      child,
      rtl: props.rtl,
      direction: props.direction,
      isSolid: true,
    })}; transform: scale${props.direction === "column" ? "Y" : "X"}(0);`;

  const mirroredStyle = () => {
    if (shadowsElement) return "";

    const scale = direction === "column" ? "scaleY" : "scaleX";
    return child === "before" ? `transform: ${scale}(-1);` : "";
  };

  const getClass = (className?: ShadowClassName) => {
    if (!className) return "";
    if (typeof className === "object") {
      return child === "after" ? className.after : className.before;
    }

    return className;
  };

  return (
    <div
      style={`position: absolute; z-index: 1; pointer-events: none; ${mirroredStyle()} ${
        !justifyShadowsToContentItems ? "overflow: hidden;" : ""
      } ${!animation ? "transition: 400ms opacity;" : ""} ${containerStyle()}`}
      ref={refCb}
    >
      <Show
        when={props.shadowsElement}
        fallback={
          <>
            {/* static shadow */}
            <div style={shadowStyle()}>
              <div
                aria-hidden="true"
                class={getClass(props.shadowsClass)}
              ></div>
            </div>
            {/* smart shadow */}
            <div
              aria-hidden="true"
              class={getClass(props.shadowsBlockClass)}
              style={solidStyle()}
            ></div>
          </>
        }
      >
        {props.shadowsElement![child]}
      </Show>
    </div>
  );
};

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

export default Shadow;
