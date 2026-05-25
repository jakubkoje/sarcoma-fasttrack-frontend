import assert from "node:assert/strict";

const apiBase = (process.env.API_BASE || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request(path, options = {}) {
  const text = await requestText(path, options);
  const payload = text ? JSON.parse(text) : null;
  return payload;
}

async function requestText(path, options = {}) {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");
  const response = await fetch(`${apiBase}${path}`, { ...options, headers });
  const text = await response.text();
  if (!response.ok) {
    throw new Error(`${options.method || "GET"} ${path} -> ${response.status}: ${text}`);
  }
  return text;
}

const health = await request("/health/db");
assert.equal(health.status, "ok");

const openapi = await requestText("/openapi");
assert.ok(openapi.includes("openapi: 3.0.3"));
assert.ok(openapi.includes("/api/v1/auth/login:"));
assert.ok(openapi.includes("/api/v1/reports/{reportId}/classification:"));
assert.ok(openapi.includes("bearerAuth:"));
assert.ok(openapi.includes("responses:"));

const login = await request("/api/v1/auth/login", {
  method: "POST",
  body: JSON.stringify({ email: "admin@admin.com", password: "admin" }),
});
assert.ok(login.access_token);

const authHeaders = { Authorization: `Bearer ${login.access_token}` };
const appTokenHeaders = { "X-Sarcoma-Token": login.access_token };
const users = await request("/api/v1/users", { headers: authHeaders });
assert.ok(users.some((user) => user.email === "admin@admin.com"));

const customHeaderReports = await request("/api/v1/reports", { headers: appTokenHeaders });
assert.ok(Array.isArray(customHeaderReports));

const organizations = await request("/api/v1/organizations", { headers: authHeaders });
assert.ok(organizations.some((organization) => organization.id === 14));

const patient = await request("/api/v1/patients", {
  method: "POST",
  headers: authHeaders,
  body: JSON.stringify({
    first_name: "Smoke",
    last_name: "Test",
    address: "Runtime 1",
    birth_number: "990101/9999",
    phone: "+420999999999",
  }),
});
assert.ok(patient.id);

const report = await request("/api/v1/reports", {
  method: "POST",
  headers: authHeaders,
  body: JSON.stringify({
    patient_id: patient.id,
    doctor_id: 19,
    target_organization_id: 14,
    status: "DRAFT",
    anamnesis: "Smoke test case",
  }),
});
assert.ok(report.id);
assert.equal(report.patient_id, patient.id);

const updated = await request(`/api/v1/reports/${report.id}/status`, {
  method: "PATCH",
  headers: authHeaders,
  body: JSON.stringify({ status: "ACTIVE" }),
});
assert.equal(updated.status, "ACTIVE");

const classification = await request(`/api/v1/reports/${report.id}/classification`, { headers: authHeaders });
assert.ok(classification.severity || classification.severity_code);

console.log(`API smoke verified against ${apiBase} with report #${report.id}`);
