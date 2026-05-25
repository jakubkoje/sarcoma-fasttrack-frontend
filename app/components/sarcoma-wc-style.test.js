import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const componentSource = readFileSync(resolve(here, "SarcomaFasttrackApp.ce.vue"), "utf8");
const entrySource = readFileSync(resolve(here, "entry.ts"), "utf8");
const runtimeSource = readFileSync(resolve(here, "nuxt-wc-runtime.ts"), "utf8");
const themeSource = readFileSync(resolve(here, "../assets/css/main.css"), "utf8");
const layoutSource = readFileSync(resolve(here, "../layouts/default.vue"), "utf8");
const loginSource = readFileSync(resolve(here, "../pages/login.vue"), "utf8");
const dashboardSource = readFileSync(resolve(here, "../pages/dashboard.vue"), "utf8");
const viteSource = readFileSync(resolve(here, "../../vite.config.ts"), "utf8");
const copyScriptSource = readFileSync(resolve(here, "../../scripts/copy-wc-test.mjs"), "utf8");
const testHtmlSource = readFileSync(resolve(here, "../../test.html"), "utf8");

test("web component hosts the real Nuxt route tree", () => {
  assert.match(componentSource, /<RouterView\s+v-slot="\{ Component, route \}">/);
  assert.match(componentSource, /v-if="Component && route\?\.meta\?\.layout === false"/);
  assert.match(componentSource, /<DefaultLayout v-else-if="Component">/);
  assert.match(entrySource, /import DashboardPage from "\.\.\/pages\/dashboard\.vue"/);
  assert.match(entrySource, /import ReportsPage from "\.\.\/pages\/reports\/index\.vue"/);
  assert.match(entrySource, /import SarcomaFormPage from "\.\.\/pages\/sarcoma-form\.vue"/);
  assert.match(entrySource, /import OrganizationsPage from "\.\.\/pages\/admin\/organizations\/index\.vue"/);
  assert.match(entrySource, /\{ path: "\/login", component: LoginPage, meta: \{ layout: false, public: true, guestOnly: true \} \}/);
  assert.match(entrySource, /app\.component\("NuxtLink", RouterLink\)/);
  assert.match(entrySource, /"sarcoma-fasttrack-centers": "centers"/);
  assert.match(componentSource, /watch\(\(\) => props\.apiBase, \(apiBase\) => setRuntimeApiBase\(apiBase\), \{ immediate: true \}\)/);
  assert.ok(
    componentSource.indexOf("setRuntimeApiBase(apiBase)") < componentSource.indexOf("onMounted(async"),
    "api-base must be copied into the runtime before routed pages create API clients",
  );
  assert.match(componentSource, /setPublicAssetBase/);
  assert.match(copyScriptSource, /"\/sarcoma-fasttrack\.js"/);
  assert.doesNotMatch(testHtmlSource, /api-base="http:\/\/localhost:8000"/);
  assert.match(testHtmlSource, /api-base="\/sarcoma-fasttrack-api"/);
});

test("web component provides the Nuxt runtime pieces used by the pages", () => {
  assert.match(runtimeSource, /export function useRuntimeConfig\(\)/);
  assert.match(runtimeSource, /export function setRuntimeRouter\(router/);
  assert.match(runtimeSource, /export function useCookie<T>/);
  assert.match(runtimeSource, /apiBase:\s*""/);
  assert.match(runtimeSource, /const router = runtimeRouter \?\? useRouter\(\)/);
  assert.match(runtimeSource, /export function definePageMeta/);
  assert.match(runtimeSource, /export function useState<T>/);
  assert.match(runtimeSource, /export function useAppConfig\(\)/);
  assert.match(runtimeSource, /export function useColorMode\(\)/);
  assert.match(runtimeSource, /export \{ computed, useRoute, useRouter \}/);
  assert.match(runtimeSource, /new URL\(\/\* @vite-ignore \*\/ "\.\/", import\.meta\.url\)\.href/);
  assert.match(viteSource, /"#imports": fileURLToPath\(new URL\("\.\/app\/components\/nuxt-wc-runtime\.ts"/);
  assert.match(viteSource, /preview:\s*\{\s*proxy:/);
  assert.match(viteSource, /"\/api": apiProxy/);
  assert.match(viteSource, /"\/sarcoma-fasttrack-api": prefixedApiProxy/);
  assert.ok(viteSource.includes('path.replace(/^\\/sarcoma-fasttrack-api(?=\\/|$)/, "")'));
  assert.match(testHtmlSource, /connect-src 'self'/);
});

test("web component enforces auth in its standalone router", () => {
  assert.match(entrySource, /router\.beforeEach\(\(to\) =>/);
  assert.match(entrySource, /if \(!meta\.public && !isAuthenticated\) \{/);
  assert.match(entrySource, /return "\/login"/);
  assert.match(entrySource, /meta\.roles && role !== "admin"/);
  assert.match(entrySource, /readStoredString\("auth_token"\)/);
  assert.match(entrySource, /setRuntimeRouter\(router\)/);
});

test("web component reuses Nuxt auth and content shells", () => {
  assert.match(layoutSource, /<UApp\s+:portal="false">/);
  assert.match(layoutSource, /<UHeader title="Sarkom FastTrack"/);
  assert.match(layoutSource, /<UNavigationMenu v-if="isAuthenticated" :items="items"/);
  assert.match(layoutSource, /:src="publicAsset\('sarkom-logo\.png'\)"/);
  assert.match(loginSource, /<UAuthForm/);
  assert.match(loginSource, /The application is intended for healthcare professionals\./);
  assert.match(dashboardSource, /Quick overview of all sarcoma cases/);
  assert.match(dashboardSource, /Expert articles on sarcomas/);
  assert.doesNotMatch(componentSource, /class="sft-auth-screen"/);
  assert.doesNotMatch(componentSource, /class="sft-stat-grid/);
  assert.match(copyScriptSource, /"\/sarcoma-fasttrack\.js"/);
});

test("web component owns stable clinical color tokens", () => {
  assert.match(entrySource, /primary:\s*"primary"/);
  assert.match(themeSource, /--color-primary-500:\s*#D89FC4/i);
  assert.match(themeSource, /--color-green-500:\s*#D89FC4/i);
  assert.match(entrySource, /500:\s*"#D89FC4"/);
  assert.match(entrySource, /`--ui-\$\{key\}: var\(--ui-color-\$\{key\}-500\);`/);
  assert.match(componentSource, /background:\s*#ffffff;/);
});
