#!/usr/bin/env node

import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const httpPath = path.join(__dirname, "network/n-http.js");
const ingressPath = path.join(__dirname, "managers/m-ingress.js");

function run(command, args, label) {
  const proc = spawn(command, args, { stdio: "inherit" });
  proc.on("close", code => {
    console.log(`${label} exited with code ${code}`);
  });
}

// Start both
run("node", [httpPath], "[Erebus] HTTP");
run("node", [ingressPath], "[Erebus] Ingress");
