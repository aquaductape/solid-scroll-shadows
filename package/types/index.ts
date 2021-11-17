import { JSX } from "solid-js";

export type ShadowClassName =
  | string
  | {
      before: string;
      after: string;
    };

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
  /**
   * applies classes when shadow is entering or exiting
   *
   * @defaultValue classes are not added, shadow is toggled by opacity with 400ms transition
   */
  animation?: {
    enterClass: string;
    exitClass: string;
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
        /**
         * Choose a value from 0 - 1. For example 0.5 will cover 50% of content item
         *
         * @defaultValue `0.3`
         */
        align?: number;
      };
  rtl?: boolean;
  shadowsElement?: {
    before: JSX.Element;
    after: JSX.Element;
  };
  /**
   * Add margins when shadow should appear
   *
   * @defaultValue `0`
   */
  endsMargin?: number;
  /**
   * Disable horizontal scroll without holding Ctrl key
   *
   * @defaultValue `false`
   */
  disableScrollWheel?: boolean;
  /**
   * Disables usage of intersection observer that detects ends of scroll container
   *
   * Setting it to `true` will use scroll event to detect ends. Is needed if you are going to use virtual scroll/windowing since the sentinels elements will most likely be removed thus shadows won't be triggered.
   *
   * @defaultValue `false`
   */
  disableIntersectionObserver?: boolean;
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
  endsMargin: number;
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
