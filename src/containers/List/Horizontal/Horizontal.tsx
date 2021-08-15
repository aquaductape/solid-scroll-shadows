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
import InputRange from "../../../components/Inputs/InputRange";
import InputColor from "../../../components/Inputs/InputColor";

const classM = scopeModuleClasses(c);

const Horizontal = () => {
  const [list] = createStore([..._list]);
  const [shadowState, setShadowState] = createStore<ScrollShadowsComponent>({
    direction: "horizontal",
    shadows: {
      class: "",
      color: "#1F15BE",
      size: 50,
      invert: null,
      insetSize: undefined,
      borderRadius: undefined,
    },
    rtl: false,
    endsDetectionMargin: 0,
  });

  return (
    <div style="padding: 50px">
      <div class="section">
        <button
          class="btn"
          onClick={() => setShadowState("rtl", !shadowState.rtl)}
        >
          {!shadowState.rtl ? "RTL" : "LTR"}
        </button>
      </div>

      <div class="section">
        <button
          class="btn"
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
        <InputColor
          value={shadowState.shadows!.color!}
          onInput={(color) => {
            setShadowState("shadows", "color", color);
          }}
        />
      </div>

      <div class="section">
        <InputRange
          text="Size"
          min="5"
          max="100"
          value={shadowState.shadows!.size!}
          onInput={({ valueAsNumber }) => {
            setShadowState("shadows", "size", valueAsNumber);
          }}
        />
      </div>
      <div class="section">
        <InputRange
          text="Border Radius"
          min="0"
          max="30"
          value={shadowState.shadows!.borderRadius! || 0}
          onInput={({ valueAsNumber }) => {
            setShadowState("shadows", "borderRadius", valueAsNumber);
          }}
        />
      </div>
      <div class="section">
        <InputRange
          text="inset size"
          min="0"
          max="100"
          value={shadowState.shadows!.insetSize || 0}
          onInput={({ valueAsNumber }) => {
            setShadowState("shadows", "insetSize", valueAsNumber);
          }}
        />
      </div>

      <div class="section">
        <InputRange
          text="endsDetectionMargin"
          min="0"
          max="150"
          value={shadowState.endsDetectionMargin || 0}
          onInput={({ valueAsNumber }) => {
            setShadowState("endsDetectionMargin", valueAsNumber);
          }}
        />
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
          borderRadius: shadowState.shadows!.borderRadius,
          insetSize: shadowState.shadows.insetSize,
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
