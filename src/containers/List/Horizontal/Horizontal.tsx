// @ts-ignore
// const pickr = require("@r-tek/colr_pickr");

// import { ColorPicker } from "../../../lib/colr_pickr/index";
import { list as _list } from "../list";
import { For, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows, {
  ScrollShadowsShadow,
  ScrollShadowsComponent,
} from "../../../components/ScrollShadows/ScrollShadows";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";

const classM = scopeModuleClasses(c);

const Horizontal = () => {
  const [list] = createStore([..._list]);
  const [shadowState, setShadowState] = createStore<ScrollShadowsComponent>({
    direction: "horizontal",
    shadow: {
      color: "magenta",
      size: 50,
    },
    rtl: false,
    endsDetectionMargin: 0,
  });

  return (
    <div>
      <button onClick={() => setShadowState("rtl", !shadowState.rtl)}>
        {!shadowState.rtl ? "RTL" : "LTR"}
      </button>
      <br />
      <button
        onClick={() => {
          const value =
            shadowState.direction === "horizontal" ? "vertical" : "horizontal";
          setShadowState("direction", value);
        }}
      >
        {shadowState.direction !== "horizontal" ? "Horizontal" : "Vertical"}
      </button>
      <br />
      <label>
        Shadow shapes:
        <select
          onInput={(e) => {
            setShadowState(
              "shadow",
              "shape",
              e.currentTarget.value.toLowerCase() as "rectangle"
            );
          }}
        >
          <option>Rectangle</option>
          <option>Concave</option>
          <option>Convex</option>
        </select>
      </label>

      <br />
      <input
        type="color"
        value="#ff00ff"
        onInput={(e) => {
          setShadowState("shadow", "color", e.currentTarget.value);
        }}
      />
      <br />
      <label htmlFor="">
        Size
        <input
          type="range"
          min="5"
          max="100"
          value={shadowState.shadow!.size}
          onInput={(e) => {
            setShadowState("shadow", "size", Number(e.currentTarget.value));
          }}
        />
      </label>
      <br />
      <label htmlFor="">
        endsDetectionMargin
        <input
          type="range"
          min="0"
          max="150"
          value={shadowState.endsDetectionMargin}
          onInput={(e) => {
            setShadowState(
              "endsDetectionMargin",
              Number(e.currentTarget.value)
            );
          }}
        />
      </label>
      <ScrollShadows
        class={classM(
          "container",
          shadowState.direction === "vertical" && "vertical"
        )}
        direction={shadowState.direction}
        // image: {
        //   first: "radial-gradient(red, blue)",
        //   last: "url(https://images.unsplash.com/photo-1613448921377-4d98656a2d57?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80) center/cover",
        // },
        // shadow={{
        //   color: "magenta",
        //   size: shadowState.shadow.size,
        // }}
        shadow={{
          color: shadowState.shadow!.color,
          size: shadowState.shadow!.size,
          shape: shadowState.shadow!.shape,
          onAnimate: ({ target, active, init, isFirst }) => {
            if (isFirst) {
              target.style.transform = active
                ? "scale(1) rotate(0deg)"
                : "scale(0) rotate(270deg)";
            } else {
              target.style.transform = active
                ? "scale(1) rotate(0deg)"
                : "scale(0) rotate(-270deg)";
            }

            if (!init) {
              target.style.transition = "500ms";
            }
          },
        }}
        endsDetectionMargin={shadowState.endsDetectionMargin}
        rtl={shadowState.rtl}
      >
        <div
          class={
            classM(
              "scroll-container",
              shadowState.direction === "vertical" && "vertical"
            ) + " no-scrollbar"
          }
        >
          <For each={list}>
            {(item, idx) => {
              return (
                <div class={c["item"]}>
                  {idx() + 1}: {item.text}
                </div>
              );
            }}
          </For>
        </div>
      </ScrollShadows>
    </div>
  );
};

export default Horizontal;
