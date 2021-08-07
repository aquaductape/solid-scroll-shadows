import { defineConfig, UserConfigExport } from "vite";
import solidPlugin from "vite-plugin-solid";
import base62 from "./utils/base64";

let id = 0;

const common = ({ add = {} }: { add?: UserConfigExport } = {}) => {
  return defineConfig({
    plugins: [solidPlugin()],
    build: {
      target: "esnext",
      polyfillDynamicImport: false,
    },
    ...add,
  });
};

const serveConfig: UserConfigExport = {
  css: {
    modules: {
      generateScopedName: () => {
        const className = `a${base62(id)}`;
        id++;
        return className;
      },
    },
  },
};
export default ({ command }: { command: "serve" | "build" }) => {
  if (command === "build") {
    return common({ add: serveConfig });
  }
  return common();
};
