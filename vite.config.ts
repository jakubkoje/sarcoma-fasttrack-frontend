import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [
    vue({
      features: {
        customElement: /\.ce\.vue$/,
      },
    }),
    ui({
      autoImport: {
        imports: ["vue"],
      },
    }),
  ],
  build: {
    lib: {
      entry: "./app/components/entry.ts",
      formats: ["es"],
      fileName: "sarcoma-fasttrack",
    },
    cssCodeSplit: false,
  },
  resolve: {
    alias: {
      "@iconify/vue": fileURLToPath(new URL("./app/components/local-iconify.js", import.meta.url)),
    },
  },
  define: {
    "process.env": {},
  },
});
