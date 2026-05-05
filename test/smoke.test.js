import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

test("web component bundle is self-contained and calls backend", async () => {
  const source = await readFile(resolve(import.meta.dirname, "../src/sarcoma-fasttrack.js"), "utf8");

  assert.ok(source.includes("sarcoma-fasttrack-app"));
  assert.ok(source.includes("customElements.define"));
  assert.ok(source.includes("/api/message"));
  assert.equal(source.includes("http://cdn"), false);
  assert.equal(source.includes("https://cdn"), false);
});
