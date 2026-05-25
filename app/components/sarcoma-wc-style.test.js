import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const componentSource = readFileSync(resolve(here, "SarcomaFasttrackApp.ce.vue"), "utf8");
const entrySource = readFileSync(resolve(here, "entry.ts"), "utf8");
const themeSource = readFileSync(resolve(here, "../assets/css/main.css"), "utf8");
const copyScriptSource = readFileSync(resolve(here, "../../scripts/copy-wc-test.mjs"), "utf8");

test("web component keeps its production layout centered", () => {
  assert.match(componentSource, /<UApp\s+:portal="false">\s*<div class="light sft-shell">/);
  assert.doesNotMatch(componentSource, /<UApp[^>]*class="light sft-shell"/);
  assert.match(componentSource, /<header\s+v-if="token && !isAuthView"\s+class="sft-topbar">/);
  assert.match(componentSource, /publicViews\s*=\s*new Set<View>\(\["login",\s*"signup"\]\)/);
  assert.doesNotMatch(componentSource, /publicViews[\s\S]*"articles"/);
  assert.match(componentSource, /\.sft-main-auth\s*\{[\s\S]*justify-content:\s*center;/);
  assert.match(entrySource, /:host\s*\{[\s\S]*min-height:\s*max\(720px,\s*calc\(100vh - 80px\)\);[\s\S]*background:\s*#f8fafc;[\s\S]*color:\s*#334155;/);
  assert.match(componentSource, /\.sft-topbar\s*\{[\s\S]*width:\s*min\(100%,\s*1180px\);[\s\S]*margin:\s*0 auto;/);
  assert.match(componentSource, /\.sft-main\s*\{[\s\S]*width:\s*min\(100%,\s*1180px\);[\s\S]*margin:\s*0 auto;/);
  assert.match(componentSource, /\.sft-auth\s*\{[\s\S]*margin-inline:\s*auto;/);
  assert.match(copyScriptSource, /"\/sarcoma-fasttrack\.js"/);
});

test("web component mirrors Nuxt auth and content shells", () => {
  assert.match(componentSource, /<section\s+v-if="visibleView === 'login'"\s+class="sft-auth-screen">/);
  assert.match(componentSource, /<span>Test account<\/span>/);
  assert.match(componentSource, /The application is intended for healthcare professionals\./);
  assert.doesNotMatch(componentSource, /Create account<\/UButton>/);
  assert.match(componentSource, /<img\s+:src="assetUrl\('sarkom-logo\.png'\)"/);
  assert.match(componentSource, /const apiArticles = ref<ArticleRead\[\]>\(\[\]\)/);
  assert.match(componentSource, /apiArticles\.value = await request<ArticleRead\[\]>\("\/api\/v1\/articles"\)/);
  assert.match(componentSource, /const articleCards = computed<ArticleView\[\]>/);
});

test("web component owns stable clinical color tokens", () => {
  assert.match(entrySource, /primary:\s*"teal"/);
  assert.doesNotMatch(themeSource, /--color-green-500:\s*#D89FC4/i);
  assert.match(componentSource, /--ui-primary:\s*var\(--sft-primary\)/);
  assert.match(componentSource, /--ui-success:\s*var\(--sft-success\)/);
  assert.match(componentSource, /--ui-bg-muted:\s*var\(--sft-page-bg\)/);
  assert.match(componentSource, /\.sft-panel h2,[\s\S]*\.sft-reader h2\s*\{[\s\S]*color:\s*var\(--sft-heading\)/);
  assert.match(componentSource, /\.sft-input\s*\{[\s\S]*color:\s*var\(--sft-heading\)/);
});
