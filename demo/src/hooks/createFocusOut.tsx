import {
  Accessor,
  onMount,
  createEffect,
  createSignal,
  onCleanup,
  Component,
  JSX,
} from "solid-js";
// <FocusTrap>
// focusBtnOnOut
// by default container queries the first btn
// <FocusOut class="" setToggle setFocus focusBtnOnOut="true" btn={id/selector} exitBtn={id/selector}><button/><dropdown/></FocusOut>

export const Dismiss: Component<{
  class?: string;
  classList?: { [key: string]: boolean };
  /**
   * Default: root component element queries first button element
   * css selector, queried from container element, to get menu button element. Or pass JSX element
   */
  menuButton?: string | JSX.Element;
  /**
   * Default: `undefined`
   * css selector, queried from container element, to get close button element(s). Or pass JSX element(s)
   */
  closeButton?: (string | JSX.Element) | (string | JSX.Element)[];
  /**
   * css selector, queried from document, to get modal element. Or pass JSX element
   */
  modal?: string | JSX.Element;

  /**
   * sets `focusTrap` to `true` and `delegateFocus` to menuButton element
   */
  useModal?: boolean;
  focusTrap?: boolean;
  /**
   * Default `undefined`
   *
   * which element, via selector*, to recieve focus after popup closes.
   *
   * *selector: css string queried from document, or if `true` uses menuButton element
   *
   * An example would be to emulate native <select> element behavior, set which sets focus to menu button after dismiss.
   */
  delegateFocus?: string | boolean | JSX.Element;
  toggle: Accessor<boolean>;
  setToggle: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
  /**
   * default: `true`
   */
  escapeKey?: boolean;
}> = (props) => {
  const { menuButton, delegateFocus, escapeKey, closeButton } = props;
  let closeBtn: HTMLElement[] = [];
  let menuBtnEl!: HTMLElement;
  let focusTrapEl1!: HTMLDivElement;
  let focusTrapEl2!: HTMLDivElement;
  let containerEl!: HTMLDivElement;
  let maskEl!: HTMLDivElement;

  const [maskActive, setMaskActive] = createSignal(false);

  let timeoutId: number | null = 0;
  let init = false;

  const runDelegateFocus = () => {
    if (delegateFocus == null) return;

    if (delegateFocus === true) {
      menuBtnEl.focus();
      return;
    }

    if (typeof delegateFocus === "string") {
      const el = document.querySelector(delegateFocus) as HTMLElement;
      el.focus();
      return;
    }
    if (delegateFocus instanceof Element) {
      (delegateFocus as HTMLElement).focus();
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (escapeKey === false) return;
    if (e.key !== "Escape") return;
    menuBtnEl.focus();
    props.setToggle(false);
  };

  const onClickMask = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickCloseButton = () => {
    // runDelegateFocus();
    props.setToggle(false);
  };

  const onClickMenuButton = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;

    const toggleVal = props.toggle();

    props.setToggle(!toggleVal);
  };

  const onFocusOutContainer = (e: FocusEvent) => {
    const newTimeout = window.setTimeout(() => {
      props.setToggle(false);
      console.log("focusOut");

      if (props.setFocus) {
        props.setFocus(false);
      }
    });
    timeoutId = newTimeout;
  };

  const onFocusInContainer = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;

    if (props.setFocus) {
      props.setFocus(true);
    }
  };

  const setTabIndexOfFocusTraps = (tabindex: "0" | "-1") => {
    focusTrapEl1.setAttribute("tabindex", tabindex);
    focusTrapEl2.setAttribute("tabindex", tabindex);
  };

  const onFocusTraps = () => {
    props.setToggle(false);
    // runDelegateFocus();
    setTabIndexOfFocusTraps("-1");
  };

  onMount(() => {
    if (typeof menuButton === "string" || menuButton == null) {
      menuBtnEl = containerEl.querySelector(
        menuButton ? menuButton : "button"
      )!;
    } else {
      menuBtnEl = menuButton as HTMLElement;
    }
    menuBtnEl.addEventListener("click", onClickMenuButton);

    if (closeButton) {
      const getCloseButton = (closeButton: string | JSX.Element) => {
        let el!: HTMLElement;
        if (typeof closeButton === "string") {
          el = containerEl.querySelector(closeButton) as HTMLElement;
        }
        if (closeButton instanceof Element) {
          el = closeButton as HTMLElement;
        }
        el.addEventListener("click", onClickCloseButton);
        closeBtn?.push(el);
      };

      if (!Array.isArray(closeButton)) {
        getCloseButton(closeButton as any);
      }

      (closeButton as (string | JSX.Element)[]).forEach(getCloseButton);
    }
  });

  createEffect(() => {
    const toggleVal = props.toggle();

    if (!init) {
      init = true;
      return;
    }

    if (delegateFocus) {
      setMaskActive(toggleVal);
      if (toggleVal) {
        document.documentElement.style.pointerEvents = "none";
        containerEl.style.pointerEvents = "all";
      } else {
        runDelegateFocus();
        document.documentElement.style.pointerEvents = "";
        containerEl.style.pointerEvents = "";
      }
    }

    if (toggleVal) {
      document.addEventListener("keydown", onKeyDown);
      setTabIndexOfFocusTraps("0");
    } else {
      setTabIndexOfFocusTraps("-1");
      document.removeEventListener("keydown", onKeyDown);
    }
  });

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
    menuBtnEl.removeEventListener("click", onClickMenuButton);
    if (closeButton) {
      closeBtn.forEach((el) =>
        el.removeEventListener("click", onClickCloseButton)
      );
    }
  });

  return (
    <div
      class={props.class}
      classList={props.classList || {}}
      onFocusIn={onFocusInContainer}
      onFocusOut={onFocusOutContainer}
      onClick={() => console.log("click")}
      tabindex="-1"
      ref={containerEl}
    >
      {maskActive() && (
        <div
          style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: none; z-index: -1;"
          onClick={onClickMask}
          ref={maskEl}
        ></div>
      )}
      {delegateFocus && (
        <div
          tabindex="-1"
          onFocus={onFocusTraps}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none;"
          aria-hidden="true"
          ref={focusTrapEl1}
        ></div>
      )}
      {props.children}
      {delegateFocus && (
        <div
          tabindex="-1"
          onFocus={onFocusTraps}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none;"
          aria-hidden="true"
          ref={focusTrapEl2}
        ></div>
      )}
    </div>
  );
};

type TCb = (t: boolean) => void;
export type FocusOutToggle = TCb;

export const createFocusOut = (
  props: {
    onToggle?: FocusOutToggle;
    debug?: boolean;
    btnEl?: () => Element;
  } = {}
) => {
  const onToggle = props.onToggle;
  const debug = props.debug || false;
  const [toggle, setToggle] = createSignal(false);
  const [focus, setFocus] = createSignal(false);
  let timeoutId: number | null = 0;
  let init = false;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== "Escape") return;
    setToggle(false);
  };

  createEffect(() => {
    const toggleVal = toggle();

    if (!init) {
      init = true;
      return;
    }
    if (!toggleVal && debug) return;

    if (toggleVal) {
      document.addEventListener("keydown", onKeyDown);
    } else {
      document.removeEventListener("keydown", onKeyDown);
    }
    onToggle && onToggle(toggleVal);
  });

  const onFOClick = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;

    const toggleVal = toggle();
    setToggle(!toggleVal);
  };

  const onFOBlur = () => {
    const newTimeout = window.setTimeout(() => {
      if (props.btnEl && toggle()) {
        (props.btnEl() as HTMLElement).focus();
      }
      setToggle(false);
      setFocus(false);
    });
    timeoutId = newTimeout;
  };

  const onFOFocus = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;
    setFocus(true);
  };

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
  });

  return [
    [toggle, setToggle, focus, setFocus],
    { onFOBlur, onFOFocus, onFOClick },
  ] as [
    [() => boolean, (v: boolean) => void, () => boolean, (v: boolean) => void],
    { onFOBlur: () => void; onFOFocus: () => void; onFOClick: () => void }
  ];
};
