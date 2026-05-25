<template>
  <div class="light sft-nuxt-wc">
    <RouterView v-slot="{ Component, route }">
      <component :is="Component" v-if="Component && route?.meta?.layout === false" />
      <DefaultLayout v-else-if="Component">
        <component :is="Component" />
      </DefaultLayout>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, onUnmounted, watch } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";
import DefaultLayout from "../layouts/default.vue";
import { pathToView, viewToPath } from "./sarcoma-wc-utils.js";
import { setPublicAssetBase, setRuntimeApiBase } from "./nuxt-wc-runtime";

const props = withDefaults(defineProps<{
  apiBase?: string;
  basePath?: string;
  initialView?: string;
  reportId?: string | number;
  articleId?: string | number;
}>(), {
  apiBase: "",
  basePath: "",
  initialView: "dashboard",
  reportId: "",
  articleId: "0",
});

const route = useRoute();
const router = useRouter();
const normalizedBasePath = computed(() => normalizeBasePath(props.basePath));
let syncingFromHost = false;
let syncingToHost = false;

watch(() => props.apiBase, (apiBase) => setRuntimeApiBase(apiBase), { immediate: true });

function normalizeBasePath(value: string) {
  if (!value) return "";
  const withSlashes = `/${value.replace(/^\/+|\/+$/g, "")}/`;
  return withSlashes === "//" ? "" : withSlashes;
}

function routeFromView(view: string) {
  const detailId = view === "detail"
    ? props.reportId || undefined
    : view === "article"
      ? props.articleId || undefined
      : undefined;
  const path = viewToPath(view, detailId);
  return `/${path}`.replace(/\/+/g, "/");
}

function routeFromHostLocation() {
  if (!props.basePath || typeof window === "undefined") return routeFromView(props.initialView);
  const mapped = pathToView(window.location.pathname, normalizedBasePath.value);
  const detailId = mapped.reportId ?? mapped.articleId;
  return `/${viewToPath(mapped.view, detailId)}`.replace(/\/+/g, "/");
}

function hostPathFromRoute(path: string) {
  const base = normalizedBasePath.value;
  if (!base) return "";
  const cleanPath = path.replace(/^\/+/, "");
  return new URL(cleanPath, new URL(base, document.baseURI)).pathname;
}

async function syncRouterFromHost(replace = true) {
  const nextRoute = routeFromHostLocation();
  if (route.path === nextRoute) return;
  syncingFromHost = true;
  try {
    await (replace ? router.replace(nextRoute) : router.push(nextRoute));
  } finally {
    await nextTick();
    syncingFromHost = false;
  }
}

function syncHostFromRouter(path: string) {
  if (!props.basePath || syncingFromHost || syncingToHost || typeof window === "undefined") return;
  const target = hostPathFromRoute(path);
  if (!target || window.location.pathname === target) return;
  syncingToHost = true;
  window.history.pushState({}, "", target);
  syncingToHost = false;
}

function handlePopState() {
  void syncRouterFromHost(true);
}

onMounted(async () => {
  setPublicAssetBase(new URL(/* @vite-ignore */ "./", import.meta.url).href);
  await syncRouterFromHost(true);
  window.addEventListener("popstate", handlePopState);
});

watch(() => route.path, (path) => syncHostFromRouter(path));

onUnmounted(() => {
  window.removeEventListener("popstate", handlePopState);
});
</script>

<style scoped>
.sft-nuxt-wc {
  min-height: max(720px, calc(100vh - 80px));
  background: #ffffff;
  color: #111827;
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
</style>
