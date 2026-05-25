import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import ui from "@nuxt/ui/vite";
import { fileURLToPath, URL } from "node:url";

const apiProxyTarget = process.env.SARCOMA_API_PROXY_TARGET || "http://127.0.0.1:8000";
const apiProxy = {
  target: apiProxyTarget,
  changeOrigin: true,
};
const prefixedApiProxy = {
  target: apiProxyTarget,
  changeOrigin: true,
  rewrite: (path: string) => path.replace(/^\/sarcoma-fasttrack-api(?=\/|$)/, "") || "/",
};

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
  server: {
    proxy: {
      "/api": apiProxy,
      "/health": apiProxy,
      "/openapi": apiProxy,
      "/sarcoma-fasttrack-api": prefixedApiProxy,
    },
  },
  preview: {
    proxy: {
      "/api": apiProxy,
      "/health": apiProxy,
      "/openapi": apiProxy,
      "/sarcoma-fasttrack-api": prefixedApiProxy,
    },
  },
  resolve: {
    alias: {
      "~": fileURLToPath(new URL("./app", import.meta.url)),
      "@": fileURLToPath(new URL("./app", import.meta.url)),
      "#imports": fileURLToPath(new URL("./app/components/nuxt-wc-runtime.ts", import.meta.url)),
      "#ui/types": fileURLToPath(new URL("./node_modules/@nuxt/ui/dist/types.d.mts", import.meta.url)),
      "@iconify/vue": fileURLToPath(new URL("./app/components/local-iconify.js", import.meta.url)),
    },
  },
  define: {
    "process.env": {},
  },
});
