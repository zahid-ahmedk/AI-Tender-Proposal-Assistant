import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  server: {
    port: 5173,
    // Backend (FastAPI) runs on :8000 — see backend docs/API_CONTRACT.md
    proxy: { "/api": "http://localhost:8000" },
  },
});
