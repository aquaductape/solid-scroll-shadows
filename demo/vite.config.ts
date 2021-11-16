import { defineConfig, UserConfigExport } from "vite";
import solidPlugin from "vite-plugin-solid";

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

export default ({ command }: { command: "serve" | "build" }) => {
  if (command === "build") {
    return shared();
  }
  return shared();
};
