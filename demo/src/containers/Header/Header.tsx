import { scopeModuleClasses } from "../../../utils/moduleClasses";
import { IconGithub, IconLogo } from "../../components/icons";
import ScrollShadows from "../../components/ScrollShadows/ScrollShadows";
import c from "./Header.module.scss";

const classM = scopeModuleClasses(c);

const Header = () => {
  return (
    <header class={c["main"]}>
      <div class={c["container"]}>
        <div class={c["logo"]}>
          <IconLogo />
        </div>
        <nav class={c["nav"]}>
          <ScrollShadows
            class={c["scroll"]}
            direction="horizontal"
            shadows={{
              color: "#000080a1",
              borderRadius: 8,
              insetSize: 25,
            }}
          >
            <ul class={c["links"] + " no-scrollbar"}>
              <li class={c["link"]}>Features</li>
              <li class={c["link"]}>Examples</li>
              <li class={c["link"]}>Docs</li>
            </ul>
          </ScrollShadows>
          <a
            target="_blank"
            rel="no-referrer"
            href="https://github.com/aquaductape/solid-scroll-shadows"
            class={c["github"]}
          >
            <IconGithub />
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
