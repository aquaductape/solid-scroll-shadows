import { list as _list } from "../list";
import { For } from "solid-js";
import { createStore } from "solid-js/store";
import c from "../List.module.scss";
import ScrollShadows from "../../../components/ScrollShadows/ScrollShadows";
import { scopeModuleClasses } from "../../../../utils/moduleClasses";

const classM = scopeModuleClasses(c);

const Vertical = () => {
  const [list] = createStore(_list);

  return (
    <ScrollShadows
      class="container"
      direction="vertical"
      shadows={{
        color: "#d9dee7",
      }}
    >
      <ul class="group">
        <li>🤩</li>
        <li>⛰️</li>
        <li>🛸</li>
      </ul>
    </ScrollShadows>
  );
};

export default Vertical;
