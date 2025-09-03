import { rmSync, existsSync } from "fs";
import { join } from "path";
import os from "os";

function safeRm(path) {
  try {
    if (existsSync(path)) {
      rmSync(path, { recursive: true, force: true });
      console.log(`🧹 Removed: ${path}`);
    } else {
      console.log(`ℹ️ Skip, not found: ${path}`);
    }
  } catch (err) {
    console.log(`⚠️ Could not remove: ${path} (${err.message})`);
  }
}

safeRm(join(process.cwd(), "node_modules", ".vite"));

safeRm(join(process.cwd(), "node_modules"));

safeRm(join(process.cwd(), "package-lock.json"));

if (os.platform() === "win32") {
  safeRm(join(process.env.LOCALAPPDATA || "", "vite"));
} else {
  safeRm(join(os.homedir(), ".vite"));
}

console.log("✅ Clean finished successfully!");
