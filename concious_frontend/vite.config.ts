import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const frontendRoot = path.dirname(fileURLToPath(import.meta.url));
const workspaceNodeModules = path.resolve(frontendRoot, "../node_modules");

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      react: path.join(workspaceNodeModules, "react"),
      "react-dom": path.join(workspaceNodeModules, "react-dom"),
    },
  },
});
