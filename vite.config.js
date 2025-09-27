import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  root: "src/",

  build: {
    outDir: "../dist",
    rollupOptions: {
      input: {
        main: resolve(__dirname, "src/index.html"),
        search: resolve(__dirname, "src/search/index.html"),
        favorites: resolve(__dirname, "src/favorites/index.html"),
        shopping: resolve(__dirname, "src/shopping/index.html"),
        nutrition: resolve(__dirname, "src/nutrition/index.html"),
      },
    },
  },
});
