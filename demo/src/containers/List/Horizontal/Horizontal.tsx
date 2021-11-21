// @ts-ignore
// const pickr = require("@r-tek/colr_pickr");

// import { ColorPicker } from "../../../lib/colr_pickr/index";
import { list as _list } from "../list";
import { For, createSignal, onMount, createUniqueId } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows from "../../../../../package/components/ScrollShadows/ScrollShadows";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";
import InputRange from "../../../components/Inputs/InputRange";
import InputColor from "../../../components/Inputs/InputColor";
import InputSelect from "../../../components/Inputs/InputSelect";

const classM = scopeModuleClasses(c);

const Horizontal = () => {
  const [list] = createStore([..._list]);

  const [shadowClass, setShadowClass] = createSignal("shadow");

  return (
    <div style="padding: 50px">
      <div class="section">
        <button class="btn">Button</button>
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
        />
      </div>

      <div class="section">
        <InputColor value="#1F15BE" onInput={(color) => {}} />
      </div>

      <div class="section">
        <InputRange
          text="Size"
          min="5"
          max="100"
          value="50"
          onInput={({ valueAsNumber }) => {}}
        />
      </div>

      {/* <ScrollShadows
        class={classM("container", "vertical")}
        direction="column"
        shadowsClass="shadow-vertical"
        shadowsBlockClass="shadow-block-vertical"
        justifyShadowsToContentItems
      >
        <div class={classM("scroll-container", "vertical") + " no-scrollbar"}>
          <For each={list}>
            {(item, idx) => {
              return <div class={c["item"]}>{item.text}</div>;
            }}
          </For>
        </div>
      </ScrollShadows> */}
      <ScrollShadows
        class={classM("container")}
        shadowsClass={shadowClass()}
        shadowsBlockClass="shadow-block"
        direction="row"
        // animation={{
        //   enterClass: "enter",
        //   exitClass: "exit",
        // }}
        // justifyShadowsToContentItems
        // disableIntersectionObserver
      >
        <div class={classM("scroll-container") + " no-scrollbar"}>
          <For each={list}>
            {(item) => {
              return <div class={c["item"]}>{item.text}</div>;
            }}
          </For>
        </div>
      </ScrollShadows>
    </div>
  );
};

export default Horizontal;
