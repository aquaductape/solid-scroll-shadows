import { list as _list } from "../list";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import s from "../List.module.scss";
import ScrollShadow from "../../../components/ScrollShadow/ScrollShadow";

const Horizontal = () => {
  const [list, setList] = createStore([..._list]);

  return (
    <ScrollShadow
      class={s["container"]}
      direction="horizontal"
      shadow={{ color: "var(--brand)", smartHiding: true }}
      endsDetectionMargin="10%"
      onEndsHit={({ isFirstShadow, shadow, hitEnd }) => {
        console.log({ hitEnd, isFirstShadow });
      }}
    >
      <div class={s["scroll-container"] + " no-scrollbar"}>
        <For each={list}>
          {(item) => {
            return <div class={s["item"]}>{item.text}</div>;
          }}
        </For>
      </div>
    </ScrollShadow>
  );
};

export default Horizontal;
