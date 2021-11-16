import { JSX } from "solid-js";

export type TScrollShadows = {
  id?: string;
  style?: string | JSX.CSSProperties;
  class?: string;
  classList?: { [key: string]: boolean };
  /**
   * applies class to both shadows, the `before` shadow is mirrored for styling convenience
   *
   * using options object to specify classes on `before` and `after` shadows. The `before` shadow is not mirrored.
   */
  shadowsClass?:
    | string
    | {
        before: string;
        after: string;
      };
  shadowsBlockClass?:
    | string
    | {
        before: string;
        after: string;
      };
  direction: "row" | "column";
  /**
   *
   * aligns shadow to partially cover the last viewable item in the scrollable list
   *
   * @defaultValue `false`
   */
  justifyShadowsToContentItems?:
    | boolean
    | {
        once?: boolean;
        persist?: boolean;
        /**
         * @defaultValue `0.5`: center
         */
        align?: number;
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

export type ShadowChildComponent = {
  child: "before" | "after";
};
