import { render } from "solid-js/web";
import "@simonwep/pickr/dist/themes/nano.min.css";
// import "./lib/colr_pickr/index.css";
import "./styles/index.scss";
import App from "./App";

render(() => <App />, document.getElementById("root")!);
