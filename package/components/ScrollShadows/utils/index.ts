import { TScrollShadows } from "../../../types";
import { round } from "../../../utils";

export const fitShadowSizeToItem = ({
  el,
  type,
  isSentinelVisible,
  rootBounds,
  rootEl,
  rtl,
  direction,
}: {
  isSentinelVisible: boolean;
  type: "first" | "last";
  el: HTMLElement;
  rootBounds: DOMRect;
  rootEl: HTMLElement;
} & Pick<TScrollShadows, "direction" | "rtl">) => {
  if (isSentinelVisible) return;

  const [shadowEl, solidEl] = el.children as any as NodeListOf<HTMLElement>;
  const children = rootEl.children;
  let childPosition = rtl ? "right" : "left";
  const isColumn = direction === "column";
  const childDimension = isColumn ? "height" : "width";
  const rootDimension = isColumn ? "height" : "width";
  let rootPosition = "left";
  const rootSize = rootBounds[rootDimension];
  const boundary = rtl ? 0 : rootSize;
  if (isColumn) {
    rootPosition = "top";
    childPosition = "top";
  }

  const rootX = rootBounds[rootPosition as "right"];

  let hideChild!: { el: HTMLElement; bcr: { position: number; size: number } };

  for (const child of children) {
    // if (traversedWidth >= rootWidth) break;

    const childBCR = child.getBoundingClientRect();
    const origSize = childBCR[childDimension];
    let size = origSize;
    const x = childBCR[childPosition as "right"];
    let childX = x - rootX;

    let done = false;

    if (rtl && !isColumn) {
      size *= -1;

      if (childX + size <= boundary) {
        if (childX + size / 2 >= boundary) {
          hideChild = {
            el: child as HTMLElement,
            bcr: { position: x, size: origSize },
          };
        }
        done = true;
      }
    } else {
      if (childX + size >= boundary) {
        if (childX + size / 2 <= boundary) {
          hideChild = {
            el: child as HTMLElement,
            bcr: { position: x, size: origSize },
          };
        }
        done = true;
      }
    }

    if (done) {
      if (!hideChild) {
        hideChild = {
          el: child as HTMLElement,
          bcr: { position: x, size: origSize },
        };
      }
      break;
    }
    hideChild = {
      el: child as HTMLElement,
      bcr: { position: x, size: origSize },
    };
  }

  const shadowSize =
    shadowEl[`client${isColumn ? "Height" : "Width"}` as "clientWidth"];
  const { position, size } = hideChild.bcr;
  const halfWidth =
    rtl && !isColumn
      ? position! - size! - rootX + size! / 3
      : rootSize - (position! - rootX + size!) + size! / 3;
  console.log(halfWidth);
  if (halfWidth < 0) return;

  const translate = isColumn ? "translateY" : "translateX";
  const scale = isColumn ? "scaleY" : "scaleX";

  shadowEl.style.transform = `${translate}(${
    (rtl ? 1 : -1) * (Math.floor(halfWidth) - 1)
  }px)`;
  solidEl.style.transform = `${scale}(${round(halfWidth / shadowSize, 3)})`;
};

export const scrollHorizontally = (e: WheelEvent) => {
  const target = e.currentTarget as HTMLElement;
  target.scrollLeft += e.deltaY;
};

export const runAnimationCb = ({
  el,
  isSentinelVisible,
}: {
  isSentinelVisible: boolean;
  el: HTMLElement;
}) => {
  // if (isSentinelVisible && init) return;
  if (isSentinelVisible) {
    // onExit(el)
    return;
  }
  // onEnter(el)
};
