import { computed, reactive, ref, watch, type Ref } from "vue";
import { useRoute, useRouter, type Router } from "vue-router";

type RuntimeConfig = {
  public: {
    apiBase: string;
  };
};

const runtimeConfig: RuntimeConfig = {
  public: {
    apiBase: "",
  },
};

let publicAssetBase = new URL(/* @vite-ignore */ "./", import.meta.url).href;
let runtimeRouter: Router | null = null;
const stateMap = new Map<string, Ref<unknown>>();
const appConfig = {
  ui: {
    prefix: "",
    colors: {
      primary: "primary",
      secondary: "blue",
      success: "green",
      info: "blue",
      warning: "yellow",
      error: "red",
      neutral: "slate",
    },
    icons: {
      loading: "i-lucide-loader-circle",
      search: "i-lucide-search",
      external: "i-lucide-external-link",
      chevron: "i-lucide-chevron-down",
      hash: "i-lucide-hash",
      file: "i-lucide-file",
      dark: "i-lucide-moon",
      light: "i-lucide-sun",
      system: "i-lucide-monitor",
      close: "i-lucide-x",
      check: "i-lucide-check",
      copy: "i-lucide-copy",
      copyCheck: "i-lucide-copy-check",
      ellipsis: "i-lucide-ellipsis",
      arrowLeft: "i-lucide-arrow-left",
      arrowRight: "i-lucide-arrow-right",
    },
  },
};
const colorMode = reactive({
  preference: "light",
  value: "light",
  forced: false,
});

watch(() => colorMode.preference, (preference) => {
  colorMode.value = preference === "dark" ? "dark" : "light";
});

export function setRuntimeApiBase(apiBase?: string) {
  runtimeConfig.public.apiBase = apiBase ?? "";
}

export function setRuntimeRouter(router: Router) {
  runtimeRouter = router;
}

export function useRuntimeConfig() {
  return runtimeConfig;
}

export function useAppConfig() {
  return appConfig;
}

export function useNuxtApp() {
  return {
    isHydrating: false,
    payload: {
      serverRendered: false,
    },
  };
}

export function useColorMode() {
  return colorMode;
}

export function useLocale() {
  return {
    locale: ref({ code: "en-US", language: "en-US" }),
    t(key: string) {
      const messages: Record<string, string> = {
        "colorMode.switchToLight": "Switch to light mode",
        "colorMode.switchToDark": "Switch to dark mode",
        "colorMode.system": "System",
        "colorMode.light": "Light",
        "colorMode.dark": "Dark",
        "dashboardSearch.theme": "Theme",
      };
      return messages[key] || key;
    },
  };
}

export function defineShortcuts(_shortcuts: Record<string, unknown>) {
  return undefined;
}

export function useRuntimeHook(_name: string, _callback: (...args: unknown[]) => unknown) {
  return undefined;
}

export function clearError() {
  return undefined;
}

export function defineNuxtPlugin(plugin: (...args: unknown[]) => unknown) {
  return plugin;
}

export function useHead(_head: unknown) {
  return undefined;
}

export function useState<T>(key: string, init: () => T): Ref<T> {
  if (!stateMap.has(key)) {
    stateMap.set(key, ref(init()));
  }
  return stateMap.get(key) as Ref<T>;
}

export function setPublicAssetBase(base: string) {
  publicAssetBase = normalizePublicAssetBase(base);
}

export function publicAsset(path: string) {
  if (/^(?:https?:)?\/\//.test(path) || path.startsWith("data:")) return path;
  return new URL(path.replace(/^\/+/, ""), publicAssetBase).href;
}

export function definePageMeta(_meta: Record<string, unknown>) {
  return undefined;
}

export function navigateTo(to: string, options: { replace?: boolean } = {}) {
  const router = runtimeRouter ?? useRouter();
  return options.replace ? router.replace(to) : router.push(to);
}

export function useCookie<T>(name: string, options: { default?: () => T } = {}): Ref<T> {
  const storageKey = `sarcoma-fasttrack:${name}`;
  const initialValue = readStoredValue<T>(storageKey) ?? (options.default ? options.default() : null as T);
  const state = ref(initialValue) as Ref<T>;

  watch(state, (value) => {
    if (typeof localStorage === "undefined" || typeof document === "undefined") return;
    if (value === null || value === undefined || (value as unknown) === "") {
      localStorage.removeItem(storageKey);
      document.cookie = `${encodeURIComponent(name)}=; Max-Age=0; path=/; SameSite=Lax`;
      return;
    }

    const serialized = JSON.stringify(value);
    localStorage.setItem(storageKey, serialized);
    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(serialized)}; path=/; SameSite=Lax`;
  }, { deep: true });

  return state;
}

export function useToast() {
  return {
    add(payload: { title?: string; description?: string; color?: string }) {
      window.dispatchEvent(new CustomEvent("sarcoma-fasttrack:toast", { detail: payload }));
    },
  };
}

function readStoredValue<T>(storageKey: string): T | null {
  if (typeof localStorage === "undefined") return null;
  const value = localStorage.getItem(storageKey);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return value as T;
  }
}

function normalizePublicAssetBase(base: string) {
  try {
    return new URL(base).href;
  } catch {
    if (typeof document !== "undefined") {
      return new URL(base, document.baseURI).href;
    }
    return new URL(/* @vite-ignore */ "./", import.meta.url).href;
  }
}

export { computed, useRoute, useRouter };
