import { scopeModuleClasses } from "../../../utils/moduleClasses";
import {
  DesktopLeftCurtain,
  DesktopRightCurtain,
} from "../../components/icons/curtains";
import ScrollShadows from "../../components/ScrollShadows/ScrollShadows";
import c from "./Hero.module.scss";

const classM = scopeModuleClasses(c);

const Hero = () => {
  return (
    <div class={c["main"]}>
      <ScrollShadows
        class={c["container"]}
        direction="horizontal"
        endsDetectionMargin="10vw"
        shadows={{
          size: "auto",
          animateClassNames: "curtains",
          element: {
            first: (
              <div style="position: relative; height: 100%; width: 500px; display: flex; justify-content: flex-start; align-items: center; transform: scale(1.2); transform-origin: left;">
                <DesktopLeftCurtain />
              </div>
            ),
            last: (
              <div style="position: relative; height: 100%; width: 500px; display: flex; justify-content: flex-end; align-items: center; transform: scale(1.2); transform-origin: right;">
                <DesktopRightCurtain />
              </div>
            ),
          },
        }}
      >
        <div class={c["slides"] + " no-scrollbar"}>
          <div class={c["slide"]}>
            <h1>Scrollbar Shadows</h1>
            <p>
              Fast, lightweight, scrollable shadow indicator
              <br />
              for{" "}
              <a
                target="_blank"
                rel="noreferrer"
                href="https://www.solidjs.com/"
              >
                Solid
              </a>
            </p>
            <div class={c["slide-declaration"]}>Scroll Here</div>
          </div>
          <div class={c["slide"]}>
            <div class={c["slide-content"]}>slide 2</div>
          </div>
          <div class={c["slide"]}>
            {" "}
            <div class={c["slide-content"]}>slide 3</div>
          </div>
        </div>
      </ScrollShadows>
    </div>
  );
};

export default Hero;
