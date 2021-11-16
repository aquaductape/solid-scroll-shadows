import { Component, JSX } from "solid-js";

const InputTheme: Component<{ title: JSX.Element; input: JSX.Element }> = ({
  input,
  title,
}) => {
  return (
    <div
      style="display: block; position: relative; width: 100%; border-radius: 18px;
    box-shadow:0 0 0 10px #eae9ef;"
    >
      <div style=" position: absolute; top: 0; left: 0px; right: 0; height: 88%; box-shadow: 0 12px 6px 1px #1d2a8c59; border-radius: 18px; "></div>
      <div
        style="position: relative; display: flex; flex-direction: column; align-items: center; background: #fff;
    border-radius: 18px;"
      >
        <div
          // style="font-size: 15px; font-weight: bold; text-align: center; width: 100%; padding: 5px 0;"
          style="font-size: 15px; font-weight: bold; text-align: center; width: 100%; padding: 5px 0px ; padding-bottom: 2px ; "
        >
          {title}
        </div>
        <div
          // style="width: 100%; height: 8px; margin-bottom: -3px; background: linear-gradient(to bottom, #1e297c81 -12px, transparent)"
          style=" width: calc(100% - 20px); height: 2px; margin-top: 0px; margin-bottom: -3px; border-radius: 5px; background: #dad7e8;"
        ></div>
        <div style="width: calc(100% - 20px); display: flex; padding: 10px 0px;">
          {input}
        </div>
      </div>
    </div>
  );
};

export default InputTheme;
