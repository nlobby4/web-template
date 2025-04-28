import os from "os";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import pkg from "../../../package.json" with { type: "json" };
globalThis.config = { ...pkg.config };
import ArgumentsManager from "./managers/m-arguments.js";

ArgumentsManager.CHECK();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __root = path.join(__dirname, "..", "..");

(async () => {
  const tryPaths = [
    path.join(__dirname, `.erebusrc`),
    path.join(os.homedir(), `.erebusrc`)
  ];

  for (const configPath of tryPaths) {
    if (fs.existsSync(configPath)) {
      try {
        const raw = await readFile(configPath, "utf8");
        const userConfig = JSON.parse(raw);
        globalThis.config = { ...globalThis.config, ...userConfig };
        console.log(`Loaded config from ${configPath}`);
        return;
      } catch (err) {
        console.error(`Failed to parse ${configPath}:`, err.message);
      }
    }
  }
})();

// Serve static HTML file
const indexPath = path.join(__root, ".dist", "index.html");  //
console.log(`indexPath: ${indexPath}`);

const server = http.createServer(async (req, res) => {
  try {
    const html = await readFile(indexPath, "utf8");
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  } catch (err) {
    res.writeHead(500);
    res.end("Error loading index.html");
  }
});

// Start server
server.listen(config.PORT, () => {
  console.log(`\nErebus CLI v${pkg.version}`);
  console.log(`Server running on: http://localhost:${config.PORT}`);

  // Log external IPv4 address for LAN access
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`Accessible on LAN at: http://${net.address}:${config.PORT}`);
      }
    }
  }

  console.log(`Using config:\n`, JSON.stringify(globalThis.config, null, 2));
});


//process.stdin.resume();
