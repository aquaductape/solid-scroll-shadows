import { JSX } from "solid-js";

export type TScrollShadows = {
  id?: string;
  style?: string | JSX.CSSProperties;
  class?: string;
  classList?: { [key: string]: boolean };
  direction: "row" | "column";
  /**
   * @defaultValue `false`
   */
  smartShadowSize?:
    | boolean
    | {
        once: boolean;
        behavior: { type: "persist" | "in-view"; timeout: number };
      };
  rtl?: boolean;
  shadowSize: string;
  initShadowSize?: boolean;
  /**
   * Enables horizontal scroll without holding Ctrl key
   *
   * @defaultValue `true`
   */
  wheelScrollHorizontally?: boolean;
};
export type ElementTemplate = { t: string };
