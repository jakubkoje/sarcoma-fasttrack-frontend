# Sarcom FastTrack Web Component

Nuxt/Vue frontend source with a custom Vite bundle that exports Web Components. The deployed artifact is not a Nuxt server and does not use Stencil. Nuxt remains useful for local page development, while `build:wc` produces the embeddable custom-element module.

## Runtime

Use the root `mise.toml`:

```bash
cd ..
mise install
cd WAC-FE
mise exec -- npm install
```

Nuxt development mode:

```bash
NUXT_PUBLIC_API_BASE=http://localhost:8000 mise exec -- npm run dev
```

## Web Component Build

```bash
mise exec -- npm run test
mise exec -- npm run build:wc
mise exec -- npm run test:smoke
mise exec -- npm run preview:wc
```

The generated files are:

- `dist/sarcoma-fasttrack.js` - ESM custom-element bundle
- `dist/index.html` - local preview page copied from `test.html`
- public image assets copied into `dist` so the production CSP does not need external image/CDN access

The WC Vite build aliases `@iconify/vue` to `app/components/local-iconify.js`, so Nuxt UI button icons render from local SVG paths and the bundle does not call external Iconify endpoints.

Preview URL:

```text
http://localhost:4173
```

Use `admin@admin.com` / `admin` against the local Go API.

## Root Elements

The bundle registers one main app element and separate roots for every original screen:

```html
<sarcoma-fasttrack-app></sarcoma-fasttrack-app>
<sarcoma-fasttrack-login></sarcoma-fasttrack-login>
<sarcoma-fasttrack-signup></sarcoma-fasttrack-signup>
<sarcoma-fasttrack-dashboard></sarcoma-fasttrack-dashboard>
<sarcoma-fasttrack-case-form></sarcoma-fasttrack-case-form>
<sarcoma-fasttrack-report-list></sarcoma-fasttrack-report-list>
<sarcoma-fasttrack-report-detail report-id="1"></sarcoma-fasttrack-report-detail>
<sarcoma-fasttrack-analytics></sarcoma-fasttrack-analytics>
<sarcoma-fasttrack-articles></sarcoma-fasttrack-articles>
<sarcoma-fasttrack-article-detail article-id="0"></sarcoma-fasttrack-article-detail>
<sarcoma-fasttrack-api-tester></sarcoma-fasttrack-api-tester>
```

Common attributes:

- `api-base` - backend base URL, default `http://localhost:8000`
- `base-path` - host route prefix used for pushState navigation
- `initial-view` - one of `dashboard`, `login`, `signup`, `reports`, `new`, `detail`, `analytics`, `articles`, `article`, `api-tester`
- `report-id` - initial report for detail roots
- `article-id` - initial article for article detail roots

Example:

```html
<sarcoma-fasttrack-app
  api-base="http://localhost:8000"
  base-path="/sarcoma/"
  initial-view="dashboard"
></sarcoma-fasttrack-app>
<script type="module" src="/sarcoma-fasttrack.js"></script>
```

## Screen Coverage

The custom element includes:

- login and registration
- dashboard
- full case creation form
- reports list
- report detail with status, feedback and reclassification
- analytics
- article list
- article detail
- API tester

Protected API-backed screens show login until a bearer token is available. Static article screens can render without login.

## Tests

Unit:

```bash
mise exec -- npm run test
```

Build/smoke:

```bash
mise exec -- npm run build:wc
mise exec -- npm run test:smoke
```

Runtime functional smoke against a running Go API:

```bash
API_BASE=http://127.0.0.1:8000 mise exec -- npm run test:functional
```

Local e2e starts a temporary Go API child process and runs the functional smoke against it:

```bash
mise exec -- npm run test:e2e
```

## Docker

```bash
docker build -f build/docker/Dockerfile -t sarcoma-fasttrack-wc .
docker run --rm -p 8080:8080 sarcoma-fasttrack-wc
```

The container serves the WC bundle from `ghcr.io/polyfea/spa-base` on port `8080`.

The Docker build runs unit tests, `build:wc`, and `test:smoke`. The GitHub Actions workflow runs unit tests, `build:wc`, `test:smoke`, and the Nuxt build, then publishes `DOCKERHUB_USERNAME/sarcoma-fasttrack-wc` on `main` and `v1*` tags.

Published tags include developer tags such as `main.20260505.0148` for Flux image automation and semver release tags such as `1.0.0` for the WAC production overlay.
