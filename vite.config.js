import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        app: "src/onInit.ts",
        app2: "src/onInit.ts",
      },
      // input: ["src/onInit.ts", "src/onRender.ts"],
      output: {
        format: "iife",
        dir: "dist",
        entryFileNames: "[name].js",
      },
    },
  },
});
