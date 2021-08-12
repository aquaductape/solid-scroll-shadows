import { scopeModuleClasses } from "../../../utils/moduleClasses";
import c from "./Hero.module.scss";

const classM = scopeModuleClasses(c);

const Hero = () => {
  return <div class={c["main"]}></div>;
};

export default Hero;
