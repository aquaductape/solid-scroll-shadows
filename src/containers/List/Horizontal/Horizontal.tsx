import { list as _list } from "../list";
import { For, createSignal } from "solid-js";
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

  return (
    <div>
      <ScrollShadows
        class={c["container"]}
        direction="horizontal"
        shadow={{
          // image: {
          //   first: "radial-gradient(red, blue)",
          //   last: "url(https://images.unsplash.com/photo-1613448921377-4d98656a2d57?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80) center/cover",
          // },
          // color: "#d9dee7",
          color: "magenta",
          shape: "convex",
          animation: "slide",
          transition: 500,
        }}
        hover={true}
        endsDetectionMargin="10%"
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
