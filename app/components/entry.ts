import { defineCustomElement } from "vue";
import { createMemoryHistory, createRouter, RouterLink } from "vue-router";
import colors from "tailwindcss/colors";
import SarcomaFasttrackApp from "./SarcomaFasttrackApp.ce.vue";
import cssText from "../assets/css/main.css?inline";
import { setRuntimeRouter } from "./nuxt-wc-runtime";
import { wcRootTags } from "./sarcoma-wc-utils.js";
import ApiTesterPage from "../pages/api-tester.vue";
import ArticleDetailPage from "../pages/clanky/[id].vue";
import ArticleEditorPage from "../pages/clanky/new.vue";
import ArticlesPage from "../pages/clanky/index.vue";
import DashboardPage from "../pages/dashboard.vue";
import IndexPage from "../pages/index.vue";
import LoginPage from "../pages/login.vue";
import OrganizationsPage from "../pages/admin/organizations/index.vue";
import ReportDetailPage from "../pages/reports/[id].vue";
import ReportsPage from "../pages/reports/index.vue";
import SarcomaFormPage from "../pages/sarcoma-form.vue";
import SignupPage from "../pages/signup.vue";

type SarcomaRouteMeta = {
  layout?: false;
  public?: boolean;
  guestOnly?: boolean;
  roles?: string[];
};

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: IndexPage },
    { path: "/login", component: LoginPage, meta: { layout: false, public: true, guestOnly: true } },
    { path: "/signup", component: SignupPage, meta: { layout: false, public: true, guestOnly: true } },
    { path: "/dashboard", component: DashboardPage },
    { path: "/sarcoma-form", component: SarcomaFormPage, meta: { roles: ["doctor", "admin"] } },
    { path: "/reports", component: ReportsPage },
    { path: "/reports/:id", component: ReportDetailPage },
    { path: "/clanky", component: ArticlesPage, meta: { roles: ["doctor", "specialist", "coordinator", "admin"] } },
    { path: "/clanky/new", component: ArticleEditorPage, meta: { roles: ["coordinator", "admin"] } },
    { path: "/clanky/:id", component: ArticleDetailPage, meta: { roles: ["doctor", "specialist", "coordinator", "admin"] } },
    { path: "/admin/organizations", component: OrganizationsPage, meta: { roles: ["admin"] } },
    { path: "/api-tester", component: ApiTesterPage },
    { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
  ],
});

router.beforeEach((to) => {
  const meta = to.meta as SarcomaRouteMeta;
  const isAuthenticated = readStoredAuthToken() !== null;
  const role = readStoredRole();

  if (to.path === "/") {
    return isAuthenticated ? "/dashboard" : "/login";
  }

  if (meta.guestOnly && isAuthenticated) {
    return "/dashboard";
  }

  if (!meta.public && !isAuthenticated) {
    return "/login";
  }

  if (meta.roles && role !== "admin" && (!role || !meta.roles.includes(role))) {
    return "/dashboard";
  }
});

function readStoredAuthToken() {
  return readStoredString("auth_token");
}

function readStoredRole() {
  return readStoredString("auth_role");
}

function readStoredString(name: string) {
  const storageKey = `sarcoma-fasttrack:${name}`;
  try {
    if (typeof localStorage !== "undefined") {
      const value = localStorage.getItem(storageKey);
      if (value) return parseStoredString(value);
    }
  } catch {
    // Fall back to the cookie written by the Nuxt-compatible useCookie shim.
  }

  if (typeof document !== "undefined") {
    const cookie = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${encodeURIComponent(name)}=`));
    if (cookie) return parseStoredString(decodeURIComponent(cookie.split("=").slice(1).join("=")));
  }

  return null;
}

function parseStoredString(value: string) {
  try {
    const parsed = JSON.parse(value);
    return typeof parsed === "string" && parsed ? parsed : null;
  } catch {
    return value || null;
  }
}

function configureApp(app: any) {
  setRuntimeRouter(router);
  app.use(router);
  app.component("NuxtLink", RouterLink);
  app.component("NuxtRouteAnnouncer", { template: "" });
  app.component("ULoadingIcon", {
    template: '<span class="i-lucide-loader-circle animate-spin" aria-hidden="true" />',
  });
}

const uiColors: Record<string, string> = {
  primary: "primary",
  secondary: "blue",
  success: "green",
  info: "blue",
  warning: "yellow",
  error: "red",
  neutral: "slate",
};

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function getColor(color: string, shade: number): string {
  if (color === "primary") {
    return ({
      50: "#fdf4f9",
      100: "#fce8f3",
      200: "#fad1e8",
      300: "#f6acd4",
      400: "#ef7bb7",
      500: "#D89FC4",
      600: "#c67aa8",
      700: "#a8608a",
      800: "#8b5172",
      900: "#73455f",
      950: "#462738",
    } as Record<number, string>)[shade] || "";
  }
  const palette = (colors as any)[color];
  return palette && typeof palette === "object" && shade in palette ? palette[shade] : "";
}

function generateColorsCss(): string {
  const shadesCSS = Object.entries(uiColors)
    .map(([key, value]) =>
      shades
        .map(
          (shade) =>
            `--ui-color-${key}-${shade}: var(--color-${value === "neutral" ? "old-neutral" : value}-${shade}, ${getColor(value, shade)});`,
        )
        .join("\n  "),
    )
    .join("\n  ");

  const { neutral: _, ...semanticColors } = uiColors;
  const lightColors = Object.keys(semanticColors)
    .map((key) => `--ui-${key}: var(--ui-color-${key}-500);`)
    .join("\n  ");
  const darkColors = Object.keys(semanticColors)
    .map((key) => `--ui-${key}: var(--ui-color-${key}-400);`)
    .join("\n  ");

  return `@layer theme {
  :host {
    display: block;
    width: 100%;
    min-height: max(720px, calc(100vh - 80px));
    background: #ffffff;
    color: #111827;
    color-scheme: light;
  }
  :root, :host {
  ${shadesCSS}
  }
  :root, :host, .light {
  ${lightColors}
  }
  .dark {
  ${darkColors}
  }
  [data-reka-popper-content-wrapper],
  [data-reka-teleport-wrapper] {
    z-index: 1000 !important;
  }
}`;
}

const colorsCss = generateColorsCss();
const shadowCompatCss = cssText
  .replace(/@property\s+--[\w-]+\s*\{[^}]*\}/g, "")
  .replace(
    /@layer properties\{@supports[^{]+\{([\s\S]*?)\}\s*\}/,
    "@layer properties{$1}",
  );

function withStyles(component: any) {
  component.styles = [shadowCompatCss, colorsCss, ...(component.styles || [])];
  return component;
}

const styledComponent = withStyles(SarcomaFasttrackApp);
const rootViews: Record<string, string> = {
  "sarcoma-fasttrack-app": "dashboard",
  "sarcoma-fasttrack-login": "login",
  "sarcoma-fasttrack-signup": "signup",
  "sarcoma-fasttrack-dashboard": "dashboard",
  "sarcoma-fasttrack-case-form": "new",
  "sarcoma-fasttrack-report-list": "reports",
  "sarcoma-fasttrack-report-detail": "detail",
  "sarcoma-fasttrack-articles": "articles",
  "sarcoma-fasttrack-article-detail": "article",
  "sarcoma-fasttrack-centers": "centers",
  "sarcoma-fasttrack-api-tester": "api-tester",
};

function defineRootElement(elementName: string, initialView: string) {
  if (customElements.get(elementName)) return;
  const BaseElement = defineCustomElement(styledComponent, { configureApp });
  customElements.define(
    elementName,
    class extends BaseElement {
      connectedCallback() {
        if (!this.hasAttribute("initial-view")) {
          this.setAttribute("initial-view", initialView);
        }
        super.connectedCallback();
      }
    },
  );
}

for (const elementName of wcRootTags) {
  defineRootElement(elementName, rootViews[elementName] || "dashboard");
}
