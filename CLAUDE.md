# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project actually is

Sarkom FastTrack is a clinical workflow app that lets primary-care physicians refer suspected sarcoma cases to specialized centers in the Czech Republic. The UI is in English; some legacy strings and routes (e.g. `/clanky` for "articles") remain in Czech.

**Important: this repo has two build targets that share most of `app/` but diverge at the entry point.**

1. **Nuxt 4 SPA** (`npm run dev` / `npm run build`) — file-based routes in `app/pages/`, layout in `app/layouts/default.vue`, normal Nuxt auto-imports. Useful for local page development.
2. **Web Component bundle** (`npm run build:wc`) — Vite library build that produces `dist/sarcoma-fasttrack.js`, a set of custom elements (`<sarcoma-fasttrack-app>`, `<sarcoma-fasttrack-dashboard>`, `<sarcoma-fasttrack-report-detail report-id="…">`, …) intended to be served from `ghcr.io/polyfea/spa-base` and embedded inside the WAC shell. **This bundle is the deployed artifact.** It does **not** run Nuxt at runtime.

The two targets render the same product but via different code paths. Edits to a Nuxt page in `app/pages/` do **not** automatically appear in the WC bundle, and vice versa. See "Dual-target gotchas" below.

## Commands

Use plain `npm`. The root sibling project also exposes `mise` (`mise exec -- npm …`) — either works.

```bash
npm install                      # postinstall runs `nuxt prepare`
npm run dev                      # Nuxt dev server on :3000
npm run build                    # Nuxt SSR build (used in CI; not the shipping artifact)
npm run build:wc                 # Vite library build → dist/sarcoma-fasttrack.js + dist/index.html
npm run preview:wc               # serves dist/ on :4173 for WC manual testing
npm run test                     # alias for test:unit
npm run test:unit                # node --test app/components/*.test.js
npm run test:smoke               # verifies the WC bundle (must be built first)
npm run test:functional          # api-smoke.mjs against a running Go API (API_BASE=…)
npm run test:e2e                 # spawns ../WAC-BE Go API and runs api-smoke against it
```

`Makefile` mirrors these with shorter targets (`make dev`, `make test-e2e`, …) and auto-loads `.env`.

API base is read from `NUXT_PUBLIC_API_BASE` (Nuxt runtime) or the `api-base` attribute on the custom element (WC). Default fallbacks point at a remote Render deployment for Nuxt and `http://localhost:8000` for the WC. `.example-env` documents the contract; `.env` is gitignored.

To run a single unit test file: `node --test app/components/sarcoma-wc-utils.test.js`.

## Architecture

### Routing & layouts

- Nuxt SPA: file-based routes in `app/pages/` (`login`, `signup`, `dashboard`, `sarcoma-form`, `analytics`, `api-tester`, `reports/[id]`, `clanky/[id]`). `app/layouts/default.vue` renders the `UHeader` chrome and a role-filtered `UNavigationMenu`.
- WC bundle: **all views live inside one component**, `app/components/SarcomaFasttrackApp.ce.vue`, which renders by `visibleView` and uses an in-memory `vue-router` for internal navigation. `app/components/entry.ts` registers a custom element per view name (see `wcRootTags` in `app/components/sarcoma-wc-utils.js`) and sets `initial-view` based on the tag.

### Auth & RBAC

- `app/stores/auth.ts` is a composable store backed by `useCookie` (`auth_token`, `auth_role`); not Pinia.
- `app/middleware/auth.ts` gates routes by token presence; `app/middleware/role.ts` enforces the per-route role map (`doctor`/`specialist`/`coordinator`/`admin`). `admin` bypasses all restrictions.
- Apply middleware on pages with `definePageMeta({ middleware: ['auth'] })` etc.

### API client

`app/services/apiClient.ts` is the canonical HTTP layer:

- `ApiClient` wraps `ofetch.$fetch` with bearer-token injection via a `tokenProvider` callback and normalizes errors (extracts FastAPI `detail[].msg`).
- `apiPrefix` is `/api/v1`. All backend endpoints live under it; `dbHealth()` is the one exception (`/health/db`).
- `useApiClient()` is the Nuxt-side factory — pulls `runtimeConfig.public.apiBase` and binds the auth cookie as token provider.
- Types in `app/types/api.ts` and `app/types/auth.ts` mirror the Go backend's OpenAPI schema. Keep them in sync when the backend changes.
- `app/services/auth.ts` (`AuthService`) is a separate stub for `/api/auth/*` and is **not** wired to the real backend — the real login flow goes through `ApiClient.login()` and `useAuthStore().setToken()`.

### Patient form state

`app/stores/sarcomaForm.ts` uses `@vueuse/core` `useLocalStorage` to persist the multi-step form (`sarcoma-form-data`, `sarcoma-form-step`). Resetting requires calling `reset()` — clearing the page is not enough.

### Styling

- Tailwind CSS v4 via `@nuxt/ui`'s Vite plugin. Theme tokens live in `app/assets/css/main.css` (inlined via `?inline` into the WC bundle).
- `nuxt.config.ts` declares `ui.theme.colors = ['primary']`; `app.config.ts` maps `primary` to the `primary` palette. The Nuxt SPA uses purple via `tailwind.config.js`.
- **The WC bundle overrides colors**: `app/components/entry.ts` rewrites Nuxt UI's CSS variables so `primary` resolves to green (`uiColors.primary = "green"`). If a color looks wrong inside `<sarcoma-fasttrack-*>` but right in `npm run dev`, this is why.

## Dual-target gotchas

- **No external network in the WC bundle.** `vite.config.ts` aliases `@iconify/vue` to `app/components/local-iconify.js` so Nuxt UI icons resolve from a local SVG map. If you add a new `i-lucide-…` icon and it renders blank in `preview:wc`, add it to `local-iconify.js`.
- **Shadow DOM CSS.** `entry.ts` strips `@property` rules and rewrites `@layer properties{@supports{…}}` so styles work inside a custom-element shadow root. Avoid CSS features that rely on `@property` registration.
- **No Nuxt composables in `.ce.vue`.** `SarcomaFasttrackApp.ce.vue` cannot call `useCookie`, `useRuntimeConfig`, `useRoute`, etc. — it owns its own router and reads config from element attributes (`api-base`, `base-path`, `initial-view`).
- **Routing duplication.** When adding a new screen, update both `app/pages/<new>.vue` *and* the view switch in `SarcomaFasttrackApp.ce.vue`, plus `wcRootTags` / `rootViews` in `entry.ts` and `sarcoma-wc-utils.js` (`pathToView` / `viewToPath`) if it should have its own custom element.
- **Auth surface differs.** Nuxt uses cookies + middleware; the WC stores the bearer token in component state and renders the login screen when absent.

## Conventions

- Don't introduce emojis in code, UI, or comments.
- Prefer reusing existing Nuxt UI v4 components (`UAuthForm`, `UStepper`, `UCard`, `UButton`, `UInput`/`UTextarea`/`USelect`, `URadioGroup`, `UCheckbox`, `UFormGroup`, `UHeader`, `UAlert`, `useToast()`) before adding new ones.
- Form schemas use Zod (already a dependency).
- TypeScript is configured via project references; do not edit root `tsconfig.json` or anything in `.nuxt/`.
- When adding `app/pages/`, `app/components/`, or `app/composables/` files for the first time in a fresh checkout, restart `npm run dev` so Nuxt regenerates auto-imports.
- When pulling in a library or framework you're not sure about, fetch current docs via Context7 (`mcp__context7__resolve-library-id` then `query-docs`) before guessing API shape.

## Deployment context

`build/docker/Dockerfile` packages the WC bundle on top of `ghcr.io/polyfea/spa-base` (port 8080). CI (`.github/workflows/docker-publish.yml`) runs unit + smoke + WC build + Nuxt build on every push and, on `main` / `v1*` tags, publishes `${DOCKERHUB_USERNAME}/sarcoma-fasttrack-wc` with both developer (`main.YYYYMMDD.HHmm`) and semver tags.
