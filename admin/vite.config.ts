import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import fs from "fs";
import path from "path";
import { printAdminBanner } from "../scripts/printAdminBanner";
import { printServerStop } from "../scripts/printServerStop";

const pkgPath = path.resolve(__dirname, "package.json");
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));
printAdminBanner();
process.on("SIGINT", () => {
  printServerStop("admin", pkg.lastUpdated, pkg.version);
  process.exit(0);
});
process.on("SIGTERM", () => {
  printServerStop("admin", pkg.lastUpdated, pkg.version);
  process.exit(0);
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  logLevel: "error",
  clearScreen: false,
});
