import { Component, JSX } from "solid-js";
import InputTheme from "./InputTheme";

const Range: Component<{
  min: number | string;
  max: number | string;
  value: number | string;
  onInput?: (props: {
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    };
    value: string | undefined;
    valueAsNumber: number;
  }) => void;
}> = ({ value, min, max, onInput: propsOnInput }) => {
  const getBackground = ({
    max,
    min,
    value,
  }: {
    value: number | string;
    min: number | string;
    max: number | string;
  }) => {
    value = ((Number(value) - Number(min)) / (Number(max) - Number(min))) * 100;

    return `linear-gradient(to right, #000 0%, #000 ${value}%, transparent ${value}%, transparent 100%)`;
  };
  const onInput = (
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    }
  ) => {
    const currentTarget = e.currentTarget;

    currentTarget.style.background = getBackground({
      value: currentTarget.value,
      max: currentTarget.max,
      min: currentTarget.min,
    });
  };

  const style = `background: ${getBackground({
    value,
    min,
    max,
  })}; position: relative;`;

  const sharedTrackStyle =
    "position: absolute; height: 10px; top: 0; border-radius: 6px; box-sizing: border-box;";
  const mainTrackStyle = `${sharedTrackStyle} left: 2px; width: calc(100% - 3px); border: 2px solid #bbb; `;
  const sharedTrackButtStyle = `width: 20px; pointer-events: none; `;
  const trackButtLeftStyle = `${sharedTrackStyle} ${sharedTrackButtStyle} background: linear-gradient(to right, #000 5px, #000 50%, transparent)`;
  const trackButtRightStyle = `${sharedTrackStyle} ${sharedTrackButtStyle} right: 1px; background: linear-gradient(to left, #bbb, transparent)`;

  return (
    <div style="display: inline-flex; padding: 9px 5px; overflow: hidden; width: 100%;">
      <div style="display: inline-flex; position: relative; width: 100%;">
        <div class="track" style={mainTrackStyle}></div>
        <input
          type="range"
          value={value}
          min={min}
          max={max}
          style={style}
          onInput={(e) => {
            const value = e.currentTarget.value;
            const valueAsNumber = e.currentTarget.valueAsNumber;
            propsOnInput && propsOnInput({ e, value, valueAsNumber });
            onInput(e);
          }}
        />
        <div className="track-butt-left" style={trackButtLeftStyle}></div>
      </div>
    </div>
  );
};

const InputRange: Component<{
  text: string;
  min: number | string;
  max: number | string;
  value: number | string;
  onInput?: (props: {
    e: InputEvent & {
      currentTarget: HTMLInputElement;
      target: Element;
    };
    value: string | undefined;
    valueAsNumber: number;
  }) => void;
}> = (props) => {
  const { value, min, max, onInput } = props;
  return (
    <InputTheme
      title={props.text}
      input={<Range {...{ value, max, min, onInput }} />}
    />
  );
};

export default InputRange;
