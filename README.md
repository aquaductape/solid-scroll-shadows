# Solid Scroll Shadows

<img src="https://img.shields.io/badge/size%20(gzip)-~3.5kb-brightgreen" alt="size of package gzip" />

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

Another downside implementing animations as shadows are toggled.

This small component allows you to easily add shadows as scroll indicators. It runs efficiently by utilizing IntersectionObserver to toggle the shadows. You also have to freedom to customize the animation on how the shadow appears.

## Example

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
    <ScrollShadows
      class="container"
      shadowsClass="shadow"
      direction="row"
      disableIntersectionObserver
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
   * callback on when shadow is toggled
   *
   * To prevent default toggling by opacity, return `true` inside callback.
   *
   * Returning `true` will also not run `enterClass` and `exitClass` animations.
   */
  onToggleShadow?: (props: {
    type: "before" | "after";
    shadowEl: HTMLElement;
    shadowContainerEl: HTMLElement;
    scrollContainerEl: HTMLElement;
    active: boolean;
    init: boolean;
  }) => void | boolean;
};
```
