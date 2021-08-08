// @ts-ignore
// const pickr = require("@r-tek/colr_pickr");

// import { ColorPicker } from "../../../lib/colr_pickr/index";
import { list as _list } from "../list";
import { For, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows, {
  ScrollShadowsShadow,
} from "../../../components/ScrollShadows/ScrollShadows";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";

const classM = scopeModuleClasses(c);

const Horizontal = () => {
  const [list, setList] = createStore([..._list]);
  const [shadow, setShadow] = createSignal<ScrollShadowsShadow>({
    color: "magenta",
  });
  const [color, setColor] = createSignal("magenta");
  const [size, setSize] = createSignal(50);
  const [rtl, setRTL] = createSignal(false);
  let buttonEl!: HTMLButtonElement;

  onMount(() => {});

  return (
    <div>
      <button onClick={() => setRTL(!rtl())}>{!rtl() ? "RTL" : "LTR"}</button>
      <input
        type="color"
        value="#ff00ff"
        onInput={(e) => {
          setColor(e.currentTarget.value);
        }}
      />
      <br />
      <label htmlFor="">
        Size
        <input
          type="range"
          min="5"
          max="100"
          onInput={(e) => {
            setSize(Number(e.currentTarget.value));
          }}
        />
      </label>
      <ScrollShadows
        class={c["container"]}
        direction="horizontal"
        shadow={{
          // image: {
          //   first: "radial-gradient(red, blue)",
          //   last: "url(https://images.unsplash.com/photo-1613448921377-4d98656a2d57?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80) center/cover",
          // },
          // color: "#d9dee7",
          color: color(),
          size: size(),
        }}
        endsDetectionMargin="10%"
        rtl={rtl()}
        // rtl={true}
      >
        <div class={c["scroll-container"] + " no-scrollbar"}>
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
