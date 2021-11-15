import { defineConfig, UserConfigExport } from "vite";
import solidPlugin from "vite-plugin-solid";
import base62 from "./utils/base64";

let id = 0;

const shared = ({ add = {} }: { add?: UserConfigExport } = {}) => {
  return defineConfig({
    base: "/solid-scroll-shadows/",
    plugins: [solidPlugin()],
    build: {
      target: "esnext",
      polyfillDynamicImport: false,
    },
    server: {
      fs: {
        // Allow serving files from one level up to the project root
        allow: [".."],
      },
    },
    ...add,
  });
};

const buildConfig: UserConfigExport = {
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
    return shared();
    // return shared({ add: buildConfig });
  }
  return shared();
};
