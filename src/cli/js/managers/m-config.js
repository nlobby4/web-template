import os from "os";
import fs from "fs";
import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import { readFile } from "fs/promises";
import pkg from "../../package.json" with { type: "json" };
globalThis.config = { ...pkg.config };

export default class ConfigManager {
  CONFIG = { ...pkg.config };

  _loadConfig() {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const tryPaths = [
      path.join(__dirname, `.erebusrc`),
      path.join(os.homedir(), `.erebusrc`)
    ];

    for (const configPath of tryPaths) {
      if (fs.existsSync(configPath)) {
        try {
          const raw = fs.readFileSync(configPath, "utf8");
          const userConfig = JSON.parse(raw);
          this.config = { ...this.config, ...userConfig };
          console.log(`Loaded config from ${configPath}`);
          break;
        } catch (err) {
          console.error(`Failed to parse ${configPath}:`, err.message);
        }
      }
    }
  }
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tryPaths = [
  path.join(__dirname, `.erebusrc`),
  path.join(os.homedir(), `.erebusrc`)
];

for (const configPath of tryPaths) {
  if (fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, "utf8");
      const userConfig = JSON.parse(raw);
      globalThis.config = { ...globalThis.config, ...userConfig };
      console.log(`Loaded config from ${configPath}`);
      break; // stop at the first valid config
    } catch (err) {
      console.error(`Failed to parse ${configPath}:`, err.message);
    }
  }
}

// Serve static HTML file
const indexPath = path.join(__dirname, "public", "index.html");

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
const port = globalThis.config.PORT || 3000;

server.listen(port, () => {
  console.log(`\nErebus CLI v${pkg.version}`);
  console.log(`Server running on: http://localhost:${port}`);

  // Log external IPv4 address for LAN access
  const nets = os.networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] || []) {
      if (net.family === "IPv4" && !net.internal) {
        console.log(`Accessible on LAN at: http://${net.address}:${port}`);
      }
    }
  }

  console.log(`Using config:\n`, JSON.stringify(globalThis.config, null, 2));
});
