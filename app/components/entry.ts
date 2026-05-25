import { defineCustomElement } from "vue";
import { createMemoryHistory, createRouter, RouterLink } from "vue-router";
import colors from "tailwindcss/colors";
import SarcomaFasttrackApp from "./SarcomaFasttrackApp.ce.vue";
import cssText from "../assets/css/main.css?inline";
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

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", component: IndexPage },
    { path: "/login", component: LoginPage, meta: { layout: false } },
    { path: "/signup", component: SignupPage, meta: { layout: false } },
    { path: "/dashboard", component: DashboardPage },
    { path: "/sarcoma-form", component: SarcomaFormPage },
    { path: "/reports", component: ReportsPage },
    { path: "/reports/:id", component: ReportDetailPage },
    { path: "/clanky", component: ArticlesPage },
    { path: "/clanky/new", component: ArticleEditorPage },
    { path: "/clanky/:id", component: ArticleDetailPage },
    { path: "/admin/organizations", component: OrganizationsPage },
    { path: "/api-tester", component: ApiTesterPage },
    { path: "/:pathMatch(.*)*", redirect: "/dashboard" },
  ],
});
void router.replace("/dashboard");

function configureApp(app: any) {
  app.use(router);
  app.component("NuxtLink", RouterLink);
  app.component("NuxtRouteAnnouncer", { template: "" });
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
