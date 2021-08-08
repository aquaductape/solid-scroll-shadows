import type { Component } from "solid-js";
import Canvas from "./containers/Editor/Canvas/Canvas";

import Header from "./containers/Header/Header";
import Horizontal from "./containers/List/Horizontal/Horizontal";
import Vertical from "./containers/List/Vertical/Vertical";

const App: Component = () => {
  return (
    <div>
      <Horizontal></Horizontal>
      {/* <Vertical></Vertical> */}
    </div>
  );
};

export default App;
