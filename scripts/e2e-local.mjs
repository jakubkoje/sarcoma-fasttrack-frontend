import { spawn } from "node:child_process";
import { once } from "node:events";
import { setTimeout as sleep } from "node:timers/promises";
import { resolve } from "node:path";

const port = Number(process.env.E2E_API_PORT || 18081);
const apiBase = `http://127.0.0.1:${port}`;
const backendDir = resolve(import.meta.dirname, "../../WAC-BE");

const api = spawn("go", ["run", "./cmd/sarcoma-api-service"], {
  cwd: backendDir,
  env: {
    ...process.env,
    SARCOMA_API_PORT: String(port),
    SARCOMA_API_ENVIRONMENT: "test",
  },
  detached: true,
  stdio: ["ignore", "pipe", "pipe"],
});

let bootLog = "";
api.stdout.on("data", (chunk) => {
  bootLog += chunk.toString();
});
api.stderr.on("data", (chunk) => {
  bootLog += chunk.toString();
});

try {
  await waitForHealth(apiBase);
  process.env.API_BASE = apiBase;
  await import("./api-smoke.mjs");
  console.log(`Local e2e verified with API child process on ${apiBase}`);
} finally {
  await stopApi();
}

async function waitForHealth(baseUrl) {
  let lastError;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    if (api.exitCode !== null) {
      throw new Error(`API exited before health check passed.\n${bootLog}`);
    }
    try {
      const response = await fetch(`${baseUrl}/health/db`);
      if (response.ok) return;
      lastError = new Error(`health returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await sleep(200);
  }
  throw new Error(`API did not become healthy: ${lastError?.message || "unknown error"}\n${bootLog}`);
}

async function stopApi() {
  if (api.exitCode !== null || api.signalCode !== null) return;
  process.kill(-api.pid, "SIGINT");
  const timeout = sleep(2_000).then(() => "timeout");
  const result = await Promise.race([once(api, "close"), timeout]);
  if (result === "timeout" && api.exitCode === null) {
    process.kill(-api.pid, "SIGKILL");
    await once(api, "close");
  }
}
