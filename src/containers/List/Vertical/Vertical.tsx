import { list as _list } from "../list";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import s from "../List.module.scss";
import ScrollShadow from "../../../components/ScrollShadow/ScrollShadow";
import { style } from "../../../../utils/styleModule";

const Vertical = () => {
  const [list, setList] = createStore([..._list]);

  return (
    <ScrollShadow
      class={style(s, "container vertical")}
      shadow={{ color: "magenta" }}
      direction="vertical"
    >
      <div class={style(s, "scroll-container vertical") + " no-scrollbar"}>
        <For each={list}>
          {(item) => {
            return <div class={s["item"]}>{item.text}</div>;
          }}
        </For>
      </div>
    </ScrollShadow>
  );
};

export default Vertical;
