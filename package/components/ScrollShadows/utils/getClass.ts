import { ShadowClassName } from "../../../types";

export const getClass = (
  type: "before" | "after",
  className?: ShadowClassName
) => {
  if (!className) return "";
  if (typeof className === "object") {
    return type === "after" ? className.after : className.before;
  }

  return className;
};
