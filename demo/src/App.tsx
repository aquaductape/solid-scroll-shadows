import type { Component } from "solid-js";
import "./App.scss";
// import Canvas from "./containers/Editor/Canvas/Canvas";
//
import Header from "./containers/Header/Header";
import Hero from "./containers/Hero/Hero";
import Horizontal from "./containers/List/Horizontal/Horizontal";
// import Vertical from "./containers/List/Vertical/Vertical";

const App: Component = () => {
  return (
    <>
      <Header></Header>
      <main class="main">
        <Hero></Hero>
        <button class="">Button</button>
        <Horizontal></Horizontal>
      </main>
    </>
  );
};

export default App;
