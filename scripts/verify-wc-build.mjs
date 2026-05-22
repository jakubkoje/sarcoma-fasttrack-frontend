import { readFile, stat } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { wcRootTags } from "../app/components/sarcoma-wc-utils.js";

const root = resolve(import.meta.dirname, "..");
const bundlePath = resolve(root, "dist/sarcoma-fasttrack.js");
const htmlPath = resolve(root, "dist/index.html");

const bundleStat = await stat(bundlePath);
assert.ok(bundleStat.size > 100_000, `bundle is unexpectedly small: ${bundleStat.size} bytes`);

const bundle = await readFile(bundlePath, "utf8");
for (const tag of wcRootTags) {
  assert.ok(bundle.includes(tag), `bundle does not define ${tag}`);
}
assert.ok(bundle.includes("customElements.define"), "bundle does not register custom elements");
assert.ok(bundle.includes("/api/v1/reports"), "bundle does not contain API wiring");
assert.ok(!bundle.includes("images.unsplash.com"), "bundle still references blocked external article images");
assert.ok(!bundle.includes("ui-avatars.com"), "bundle still references blocked external avatar images");
assert.ok(!bundle.includes("api.iconify.design"), "bundle still references the external Iconify API");
assert.ok(!bundle.includes("api.simplesvg.com"), "bundle still references the external SimpleSVG API");
assert.ok(!bundle.includes("api.unisvg.com"), "bundle still references the external Unisvg API");
assert.match(
  bundle,
  /:host\s*\{\s*display:\s*block;\s*width:\s*100%;\s*min-height:\s*max\(720px,\s*calc\(100vh - 80px\)\);\s*background:\s*#f8fafc;\s*color:\s*#334155;/,
  "bundle does not include the custom-element host layout fallback",
);
assert.ok(bundle.includes("color:var(--sft-heading)"), "bundle does not include explicit heading/input colors");

const html = await readFile(htmlPath, "utf8");
assert.ok(html.includes("sarcoma-fasttrack-app"), "dist/index.html does not mount the main component");
assert.ok(html.includes("sarcoma-fasttrack.js"), "dist/index.html does not load the WC bundle");

console.log(`WC build verified: ${wcRootTags.length} root elements, ${bundleStat.size} bytes`);
