import { LocalState } from "../../../types";

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
