import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";
import base62 from "./utils/base64";

let id = 0;

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: "esnext",
    polyfillDynamicImport: false,
  },
  css: {
    modules: {
      generateScopedName: () => {
        const className = `a${base62(id)}`;
        id++;
        return className;
      },
    },
  },
});
