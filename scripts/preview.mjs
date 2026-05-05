import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..", "dist");
const port = Number(process.env.PORT || 4173);

const types = {
  ".html": "text/html",
  ".js": "text/javascript",
};

createServer(async (req, res) => {
  const url = new URL(req.url || "/", `http://localhost:${port}`);
  const file = url.pathname === "/" ? "index.html" : url.pathname.slice(1);
  try {
    const body = await readFile(join(root, file));
    res.writeHead(200, { "Content-Type": types[extname(file)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end("Not found");
  }
}).listen(port, () => {
  console.log(`Preview running on http://localhost:${port}`);
});
