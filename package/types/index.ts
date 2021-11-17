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
  /**
   * Enables horizontal scroll without holding Ctrl key
   *
   * @defaultValue `true`
   */
  useScrollWheel?: boolean;
  /**
   * Enables end detection by using intersection observer, that observes sentinels that neighbors scrollable items.
   *
   * Setting it to `false` will use scroll event to detect ends. Is needed if you are going to use virtual scroll/windowing since the sentinels elements will mostlikely be removed thus shadows won't be triggered.
   *
   * @defaultValue `true`
   */
  useIntersectionObserver?: boolean;
};
export type LocalState = {
  init: boolean;
  initResetSize: boolean;
  isScrollable: boolean;
  scrollableContainer: HTMLElement;
  scrollTimeout: number;
  timeoutActive: boolean;
  containerScrollSize: number;
  containerSize: number;
  sentinelShadowMap: SentinelShadowMap;
  shadowFirstEl: HTMLElement;
  shadowLastEl: HTMLElement;
  props: TScrollShadows;
};

export type ElementTemplate = { t: string };

export type ShadowChildComponent = {
  child: "before" | "after";
};

type SentinelShadowState = {
  type: "before" | "after";
  el: HTMLElement;
  visible: boolean;
  sentinel: HTMLElement;
};

export type SentinelShadowMap = Map<HTMLElement, SentinelShadowState>;
