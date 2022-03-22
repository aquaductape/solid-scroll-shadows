# Solid Scroll Shadows

<img src="https://img.shields.io/badge/size%20(gzip)-~3.5kb-brightgreen" alt="size of package gzip" />

## Install

```
npm i solid-scroll-shadows
```

```
yarn add solid-scroll-shadows
```

```
pnpm add solid-scroll-shadows
```

## Motivation

Popular online solution uses pure CSS such as this below.

```css
.scrollGradient {
  background: linear-gradient(#249be5 33%, rgba(36, 155, 229, 0)),
    linear-gradient(rgba(36, 155, 229, 0), #249be5 66%) 0 100%, radial-gradient(
      farthest-side at 50% 0,
      rgba(34, 34, 34, 0.5),
      rgba(0, 0, 0, 0)
    ), radial-gradient(
        farthest-side at 50% 100%,
        rgba(34, 34, 34, 0.5),
        rgba(0, 0, 0, 0)
      ) 0 100%;
  background-color: #249be5;
  background-repeat: no-repeat;
  background-attachment: local, local, scroll, scroll;
  background-size: 100% 45px, 100% 45px, 100% 15px, 100% 15px;
}
```

It's a simple and effective but unfortunatly doesn't work for iOS since the shadows aren't able to re-rendere as you scroll. You can [fix by using JS to force rerender](https://www.bram.us/2019/10/24/pure-css-scroll-shadows-vertical-horizontal/#note-mobilesafari) but this currently doesn't work with iOS15.

Another downside is implementing animations to shadows, when they are toggled.

This small component allows you to easily add shadows as scroll indicators. It runs efficiently by utilizing IntersectionObserver to toggle the shadows. You also have to freedom to customize the animation on how the shadow appears.

## Examples

### Regular Shadows

```jsx
const List = () => {
  const list = [
    "Home",
    "Docs",
    "Get Started",
    "Examples",
    "Tutorials",
    "Blog",
    "Contact",
    "Join",
  ];

  return (
    <ScrollShadows class="container" shadowsClass="shadow" direction="row">
      <ul class="scroll-container">
        <For each={list}>{(item) => <li>{item}</li>}</For>
      </ul>
    </ScrollShadows>
  );
};
```

```css
/* css stylesheet */

.shadow {
  /**
   for color gradient
   include alpha value
   in order to render properly
   in Safari
  */
  background-image: linear-gradient(
    to left,
    rgb(30 41 124 / 100%),
    rgb(30 41 124 / 0%)
  );
  width: 20px;
  height: 100%;
}
```

### Mask shadows

```jsx
import ScrollShadows, { shadowMask } from "solid-scroll-shadows";

const List = () => {
  const list = [
    "Home",
    "Docs",
    "Get Started",
    "Examples",
    "Tutorials",
    "Blog",
    "Contact",
    "Join",
  ];

  return (
    <ScrollShadows
      class="container"
      direction="row"
      onAtEnds={shadowMask({
        size: "30px", // can be any css unit such as 'vw', 'rem' ect.
        transition: { duration: 250, easing: "ease-in-out" },
      })}
    >
      <ul class="scroll-container">
        <For each={list}>{(item) => <li>{item}</li>}</For>
      </ul>
    </ScrollShadows>
  );
};
```

## API

```ts
type TScrollShadows = {
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
  /**
   * RTL (Right to Left) indicating that text is written from right to left, therefore the shadows are correctly placed in that order.
   *
   * @defaultValue `false`. Shadows are placed in order that respects LTR (Left to Right)
   */
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
  /**
   * callback on when scroll container is at start or end
   */
  onAtEnds?: (props: TOnAtEndsProps) => void;
};

type TOnAtEndsProps = {
  type: "start" | "end";
  isAtStart: boolean;
  isAtEnd: boolean;
  shadowEl: HTMLElement | null;
  // shadowEls?: { type: "before" | "after"; shadowEl: HTMLElement }[];
  shadowContainerEl: HTMLElement;
  scrollContainerEl: HTMLElement;
  direction: "row" | "column";
  rtl?: boolean;
  init: boolean;
};

type ShadowMaskProps = {
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  size?: number | string;
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  rowSize?: number | string;
  /**
   * @defaultValue `"30px"`
   *
   * number converts to px unit
   */
  columnSize?: number | string;
  /**
   * @defaultValue `"-webkit-mask-position 250ms ease-in-out, mask-position 250ms ease-in-out"`
   */
  transition?:
    | {
        /**
         * @defaultValue `250`
         */
        duration?: number;
        /**
         * @defaultValue `"ease-in-out"`
         */
        easing?: string;
        /**
         * @defaultValue `0`
         */
        delay?: number;
      }
    | string;
};
```
