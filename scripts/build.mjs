import { mkdir, copyFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const dist = resolve(root, "dist");

await mkdir(dist, { recursive: true });
await copyFile(resolve(root, "src/sarcoma-fasttrack.js"), resolve(dist, "sarcoma-fasttrack.js"));
await copyFile(resolve(root, "public/index.html"), resolve(dist, "index.html"));

console.log("Built dist/sarcoma-fasttrack.js");
