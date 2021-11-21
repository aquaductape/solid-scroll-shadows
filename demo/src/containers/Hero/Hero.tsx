// import ScrollShadows from "../../../../package/index";
import { scopeModuleClasses } from "../../../utils/moduleClasses";
import c from "./Hero.module.scss";
import starStruckImg from "../../assets/emojiis/star-struck_1f929.png";
import snowCappedMtImg from "../../assets/emojiis/snow-capped-mountain_1f3d4-fe0f.png";
import flyingSaucerImg from "../../assets/emojiis/flying-saucer_1f6f8.png";
import heartsImg from "../../assets/emojiis/revolving-hearts_1f49e.png";
import evergreenImg from "../../assets/emojiis/evergreen-tree_1f332.png";
import volcanoImg from "../../assets/emojiis/volcano_1f30b.png";
import seeNoEvilImg from "../../assets/emojiis/see-no-evil-monkey_1f648.png";
import whaleImg from "../../assets/emojiis/whale_1f40b.png";
import dragonImg from "../../assets/emojiis/dragon_1f409.png";

import { For } from "solid-js";
import PackageBtn from "./PackageBtn";
import ScrollShadows from "solid-scroll-shadows";

const classM = scopeModuleClasses(c);

const Hero = () => {
  return (
    <div>
      <div class={c["info"]}>
        <h1 class={c["h1"]}>Solid Scroll Shadows</h1>
        <div class={c["info-text"]}>
          <p>Use Shadows as scroll indicators.</p>
          <p>Works everywhere including iOS13+.</p>
          <p>
            Built for{" "}
            <a href="https://solidjs.com" target="_blank">
              SolidJS
            </a>
          </p>
        </div>
        <PackageBtn></PackageBtn>
        <div class="package"></div>
      </div>
      <div class={c["primary-utils"]}></div>
      <div class={c["secondary-utils"]}>
        {/* <ul>
        <button class="btn-gradient"></button>
        <button class="btn-gradient"></button>
        <button class="btn-gradient"></button>
        </ul> */}
      </div>
      <Demo></Demo>
    </div>
  );
};

const Demo = () => {
  const emojiis = [
    starStruckImg,
    snowCappedMtImg,
    flyingSaucerImg,
    heartsImg,
    evergreenImg,
    volcanoImg,
    seeNoEvilImg,
    whaleImg,
    dragonImg,
  ];
  return (
    <div class={c["demo"]}>
      <div class={c["display"]}>
        <ScrollShadows
          class={c["emoji-container"]}
          direction="column"
          shadowsClass="shadow-column"
        >
          <ul class={c["emoji-list"]}>
            <For each={emojiis}>
              {(item) => {
                return <img class={c["emoji-item"]} src={item} />;
              }}
            </For>
          </ul>
        </ScrollShadows>
      </div>
      <div class={c["code"]}></div>
    </div>
  );
};

export default Hero;
