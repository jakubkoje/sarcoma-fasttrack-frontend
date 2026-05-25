import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const source = resolve(root, "test.html");
const target = resolve(root, "dist", "index.html");

const html = await readFile(source, "utf8");
await mkdir(dirname(target), { recursive: true });
await writeFile(
  target,
  html.replace("./dist/sarcoma-fasttrack.js", "/sarcoma-fasttrack.js"),
);
