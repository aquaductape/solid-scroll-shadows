import { scopeModuleClasses } from "../../../utils/moduleClasses";
import c from "./Header.module.scss";

const classM = scopeModuleClasses(c);

const Header = () => {
  return (
    <header class={c["main"]}>
      <div class={c["container"]}>
        <div class={c["logo"]}>Logo</div>
        <nav class={c["nav"]}>
          <div class={c["scroll"]}>
            <ul class={c["links"] + " no-scrollbar"}>
              <li class={c["link"]}>Features</li>
              <li class={c["link"]}>Examples</li>
              <li class={c["link"]}>Docs</li>
            </ul>
          </div>
          <div class={c["github"]}>Git</div>
        </nav>
      </div>
    </header>
  );
};

export default Header;
