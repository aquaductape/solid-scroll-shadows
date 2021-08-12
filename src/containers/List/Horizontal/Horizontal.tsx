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
    shadows: {
      class: "",
      color: "magenta",
      size: 50,
      invert: null,
    },
    rtl: false,
    endsDetectionMargin: 0,
  });

  return (
    <div>
      <div class="section">
        <button onClick={() => setShadowState("rtl", !shadowState.rtl)}>
          {!shadowState.rtl ? "RTL" : "LTR"}
        </button>
      </div>

      <div class="section">
        <button
          onClick={() => {
            const value =
              shadowState.direction === "horizontal"
                ? "vertical"
                : "horizontal";
            setShadowState("direction", value);
          }}
        >
          {shadowState.direction !== "horizontal" ? "Horizontal" : "Vertical"}
        </button>
      </div>

      <div class="section">
        <label>
          Shadow shapes:
          <select
            onInput={(e) => {
              setShadowState(
                "shadows",
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
      </div>
      <div class="section">
        <label>
          Invert shadow:
          <select
            onInput={(e) => {
              let value: string | null = e.currentTarget.value.toLowerCase();
              if (value === "none") {
                value = null;
              }
              setShadowState("shadows", "invert", value as "first");
            }}
          >
            <option>None</option>
            <option>First</option>
            <option>Last</option>
          </select>
        </label>
      </div>
      <div class="section">
        <label>
          CSS class:
          <select
            onInput={(e) => {
              let value: string = e.currentTarget.value;
              if (value === "None") {
                value = "";
              }
              setShadowState("shadows", "class", value);
            }}
          >
            <option>None</option>
            <option>foo</option>
          </select>
        </label>
      </div>

      <div class="section">
        <input
          type="color"
          value="#ff00ff"
          onInput={(e) => {
            setShadowState("shadows", "color", e.currentTarget.value);
          }}
        />
      </div>

      <div class="section">
        <label htmlFor="">
          Size
          <input
            type="range"
            min="5"
            max="100"
            value={shadowState.shadows!.size}
            onInput={(e) => {
              setShadowState("shadows", "size", Number(e.currentTarget.value));
            }}
          />
        </label>
      </div>

      <div class="section">
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
      </div>

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
        shadows={{
          class: shadowState.shadows!.class,
          color: shadowState.shadows!.color,
          size: shadowState.shadows!.size,
          shape: shadowState.shadows!.shape,
          //           onAnimate: ({ target, active, init, isFirst }) => {
          //             if (isFirst) {
          //               target.style.transform = active
          //                 ? "scale(1) rotate(0deg)"
          //                 : "scale(0) rotate(270deg)";
          //             } else {
          //               target.style.transform = active
          //                 ? "scale(1) rotate(0deg)"
          //                 : "scale(0) rotate(-270deg)";
          //             }
          //
          //             if (!init) {
          //               target.style.transition = "500ms";
          //             }
          //           },
          animation: "slide",
          invert: shadowState.shadows.invert,
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
