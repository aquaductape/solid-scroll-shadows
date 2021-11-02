// @ts-ignore
// const pickr = require("@r-tek/colr_pickr");

// import { ColorPicker } from "../../../lib/colr_pickr/index";
import { list as _list } from "../list";
import { For, createSignal, onMount, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows, {
  ScrollShadowsShadow,
  ScrollShadowsComponent,
} from "../../../../../package/index";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";
import InputRange from "../../../components/Inputs/InputRange";
import InputColor from "../../../components/Inputs/InputColor";
import InputSelect from "../../../components/Inputs/InputSelect";

const classM = scopeModuleClasses(c);

const Horizontal = () => {
  const [list] = createStore([..._list, ..._list, ..._list]);
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
        <InputSelect
          title="Shape"
          list={[
            {
              content: "Rectangle",
            },
            { content: "Concave" },
            { content: "Convex" },
          ]}
          onInput={(value) => {
            setShadowState(
              "shadows",
              "shape",
              value.toLowerCase() as "rectangle"
            );
          }}
        />
      </div>
      <div class="section">
        <InputSelect
          title="Invert"
          list={[
            {
              content: "None",
            },
            { content: "First" },
            { content: "Last" },
          ]}
          onInput={(_value) => {
            let value: string | null = _value.toLowerCase();
            if (value === "none") {
              value = null;
            }
            setShadowState("shadows", "invert", value as "first");
          }}
        />
      </div>
      <div class="section">
        <InputSelect
          title="CSS class"
          list={[
            {
              content: "None",
            },
            { content: "foo" },
          ]}
          onInput={(_value) => {
            let value = _value.toLowerCase();
            if (value === "none") {
              value = "";
            }
            setShadowState("shadows", "class", value);
          }}
        />
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
        shadows={{
          class: shadowState.shadows!.class,
          color: shadowState.shadows!.color,
          size: shadowState.shadows!.size,
          shape: shadowState.shadows!.shape,
          borderRadius: shadowState.shadows!.borderRadius,
          insetSize: shadowState.shadows.insetSize,
          animation: "slide",
          transition: "1s",
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
