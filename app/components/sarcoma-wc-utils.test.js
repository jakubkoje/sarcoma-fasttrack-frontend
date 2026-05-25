import test from "node:test";
import assert from "node:assert/strict";
import {
  articles,
  normalizeApiBase,
  patientDisplayName,
  pathToView,
  statusLabels,
  viewToPath,
  wcRootTags,
} from "./sarcoma-wc-utils.js";

test("normalizeApiBase strips trailing slash and supports same-origin API calls", () => {
  assert.equal(normalizeApiBase("http://localhost:8000/"), "http://localhost:8000");
  assert.equal(normalizeApiBase("/sarcoma-fasttrack-api/"), "/sarcoma-fasttrack-api");
  assert.equal(normalizeApiBase("/"), "");
  assert.equal(normalizeApiBase(""), "");
});

test("patientDisplayName uses legacy and FHIR names", () => {
  assert.equal(patientDisplayName({ id: 7, first_name: "Ján", last_name: "Novák" }), "Ján Novák");
  assert.equal(patientDisplayName({ id: 8, given_name: "Eva", family_name: "Malá" }), "Eva Malá");
  assert.equal(patientDisplayName({ id: 9 }), "#9");
});

test("pathToView maps host paths to internal custom element views", () => {
  assert.deepEqual(pathToView("/sarcoma/", "/sarcoma/"), { view: "dashboard" });
  assert.deepEqual(pathToView("/sarcoma/dashboard", "/sarcoma/"), { view: "dashboard" });
  assert.deepEqual(pathToView("/sarcoma/login", "/sarcoma/"), { view: "login" });
  assert.deepEqual(pathToView("/sarcoma/signup", "/sarcoma/"), { view: "signup" });
  assert.deepEqual(pathToView("/sarcoma/new", "/sarcoma/"), { view: "new" });
  assert.deepEqual(pathToView("/sarcoma/sarcoma-form", "/sarcoma/"), { view: "new" });
  assert.deepEqual(pathToView("/sarcoma/reports", "/sarcoma/"), { view: "reports" });
  assert.deepEqual(pathToView("/sarcoma/reports/42", "/sarcoma/"), { view: "detail", reportId: 42 });
  assert.deepEqual(pathToView("/sarcoma/clanky", "/sarcoma/"), { view: "articles" });
  assert.deepEqual(pathToView("/sarcoma/clanky/2", "/sarcoma/"), { view: "article", articleId: "2" });
  assert.deepEqual(pathToView("/sarcoma/admin/organizations", "/sarcoma/"), { view: "centers" });
  assert.deepEqual(pathToView("/sarcoma/centers", "/sarcoma/"), { view: "centers" });
  assert.deepEqual(pathToView("/sarcoma/api-tester", "/sarcoma/"), { view: "api-tester" });
  assert.equal(statusLabels.ACTIVE, "Active");
});

test("viewToPath maps custom element views back to host routes", () => {
  assert.equal(viewToPath("dashboard"), "dashboard");
  assert.equal(viewToPath("new"), "sarcoma-form");
  assert.equal(viewToPath("detail", 7), "reports/7");
  assert.equal(viewToPath("article", "3"), "clanky/3");
  assert.equal(viewToPath("centers"), "admin/organizations");
  assert.equal(viewToPath("api-tester"), "api-tester");
});

test("web component metadata exposes every root tag and article screen data", () => {
  assert.ok(wcRootTags.includes("sarcoma-fasttrack-app"));
  assert.ok(wcRootTags.includes("sarcoma-fasttrack-report-detail"));
  assert.ok(wcRootTags.includes("sarcoma-fasttrack-api-tester"));
  assert.ok(wcRootTags.includes("sarcoma-fasttrack-centers"));
  assert.equal(new Set(wcRootTags).size, wcRootTags.length);
  assert.ok(articles.length >= 9);
  assert.ok(articles.every((article) => article.id && article.title && article.sections.length > 0));
  assert.ok(articles.every((article) => article.image && !/^https?:\/\//.test(article.image)));
});
