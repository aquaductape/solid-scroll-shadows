import {
  Accessor,
  onMount,
  createEffect,
  createSignal,
  onCleanup,
  Component,
} from "solid-js";
// <FocusTrap>
// focusBtnOnOut
// by default container queries the first btn
// <FocusOut class="" setToggle setFocus focusBtnOnOut="true" btn={id/selector} exitBtn={id/selector}><button/><dropdown/></FocusOut>

export const FocusOut: Component<{
  class?: string;
  classList?: { [key: string]: boolean };
  btnId?: string;
  focusBtnOnOut?: boolean;
  toggle: Accessor<boolean>;
  setToggle: (v: boolean) => void;
  setFocus?: (v: boolean) => void;
  /**
   * default: `true`
   */
  exitOnEscapeKey?: boolean;
}> = (props) => {
  const { btnId, focusBtnOnOut, exitOnEscapeKey } = props;
  let btnEl!: HTMLElement;
  let focusTrapEl1!: HTMLDivElement;
  let focusTrapEl2!: HTMLDivElement;
  let containerEl!: HTMLDivElement;

  let timeoutId: number | null = 0;
  let init = false;

  const onKeyDown = (e: KeyboardEvent) => {
    if (exitOnEscapeKey === false) return;
    if (e.key !== "Escape") return;
    props.setToggle(false);
  };

  createEffect(() => {
    const toggleVal = props.toggle();

    if (!init) {
      init = true;
      return;
    }

    if (toggleVal) {
      setTabIndexOfFocusTraps("0");
      document.addEventListener("keydown", onKeyDown);
    } else {
      setTabIndexOfFocusTraps("-1");
      document.removeEventListener("keydown", onKeyDown);
    }
  });

  const onFOClick = () => {
    clearTimeout(timeoutId!);
    timeoutId = null;

    const toggleVal = props.toggle();
    props.setToggle(!toggleVal);
  };

  const onFOBlur = () => {
    const newTimeout = window.setTimeout(() => {
      props.setToggle(false);
      if (props.setFocus) {
        props.setFocus(false);
      }
    });
    timeoutId = newTimeout;
  };

  const onFOFocus = () => {
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

  const onTrapsFocus = () => {
    btnEl.focus();
    setTabIndexOfFocusTraps("-1");
  };

  onMount(() => {
    btnEl = containerEl.querySelector(btnId ? `#${btnId}` : "button")!;
    btnEl.addEventListener("click", onFOClick);
  });

  onCleanup(() => {
    document.removeEventListener("keydown", onKeyDown);
    btnEl.removeEventListener("click", onFOClick);
  });

  return (
    <div
      class={props.class}
      classList={props.classList || {}}
      onFocusIn={onFOFocus}
      onFocusOut={onFOBlur}
      tabindex="-1"
      ref={containerEl}
    >
      {focusBtnOnOut && (
        <div
          tabindex="-1"
          onFocus={onTrapsFocus}
          style="position: absolute; top: 0; left: 0; outline: none; pointer-events: none;"
          aria-hidden="true"
          ref={focusTrapEl1}
        ></div>
      )}
      {props.children}
      {focusBtnOnOut && (
        <div
          tabindex="-1"
          onFocus={onTrapsFocus}
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
