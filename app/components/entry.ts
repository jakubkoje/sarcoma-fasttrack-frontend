import { defineCustomElement } from "vue";
import { createMemoryHistory, createRouter } from "vue-router";
import colors from "tailwindcss/colors";
import SarcomaFasttrackApp from "./SarcomaFasttrackApp.ce.vue";
import cssText from "../assets/css/main.css?inline";
import { wcRootTags } from "./sarcoma-wc-utils.js";

const router = createRouter({
  history: createMemoryHistory(),
  routes: [],
});

function configureApp(app: any) {
  app.use(router);
}

const uiColors: Record<string, string> = {
  primary: "green",
  secondary: "blue",
  success: "green",
  info: "blue",
  warning: "yellow",
  error: "red",
  neutral: "slate",
};

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;

function getColor(color: string, shade: number): string {
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
    min-height: 100%;
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
