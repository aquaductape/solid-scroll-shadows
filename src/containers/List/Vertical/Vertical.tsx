import { list as _list } from "../list";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows from "../../../components/ScrollShadows/ScrollShadows";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";

const classM = scopeModuleClasses(c);

const Vertical = () => {
  const [list, setList] = createStore([..._list]);

  return (
    <ScrollShadows
      class={classM("container", "vertical")}
      shadow={{
        color: "#d9dee7",
        shape: "convex",
        animation: "slide",
        transition: 500,
      }}
      direction="vertical"
    >
      <div class={classM("scroll-container", "vertical") + " no-scrollbar"}>
        <For each={list}>
          {(item) => {
            return <div class={c["item"]}>{item.text}</div>;
          }}
        </For>
      </div>
    </ScrollShadows>
  );
};

export default Vertical;
