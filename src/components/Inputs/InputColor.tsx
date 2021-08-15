import Pickr from "@simonwep/pickr";
import { Component, JSX, onMount } from "solid-js";
import InputTheme from "./InputTheme";

const InputColor: Component<{
  value: string;
  onInput: (value: string) => void;
}> = ({ value, onInput }) => {
  let btnEl!: HTMLButtonElement;

  onMount(() => {
    const pickr = Pickr.create({
      el: btnEl,
      theme: "nano",
      default: value,
      comparison: false,
      useAsButton: true,
      position: "bottom-start",
      components: {
        // Main components
        preview: true,
        opacity: true,
        hue: true,

        // Input / output Options
        interaction: {
          hex: true,
          rgba: true,
          // hsla: true,
          // hsva: true,
          // cmyk: true,
          input: true,
          clear: false,
          save: false,
        },
      },
    });

    pickr.on("change", (colorOutput: any, source: any, instance: any) => {
      const rgba = colorOutput.toRGBA().toString(3) as string;
      onInput(rgba);
      btnEl.style.background = rgba;
    });
  });
  return (
    <InputTheme
      title="Color"
      input={
        <button
          style={`
    appearance: none;
    border: 0px;
    padding: 0px;
    margin: 0px;
    box-shadow: rgb(0 0 0 / 30%) 0px 0px 0px 3px inset;
    border-radius: 12px;
    border-top-right-radius: 0;
    border-top-left-radius: 0;
    width: 100%;
    height: 45px;
 background: ${value}`}
          ref={btnEl}
        />
      }
    />
  );
};

export default InputColor;
