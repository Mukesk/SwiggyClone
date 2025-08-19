import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    middlewareMode: false,
    setupMiddlewares(middlewares) {
      // 👇 Ensures SPA fallback in dev (so refresh works)
      middlewares.push(history());
      return middlewares;
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
    setupMiddlewares(middlewares) {
      // 👇 Ensures SPA fallback in preview (production build locally)
      middlewares.push(history());
      return middlewares;
    }
  },
  build: {
    outDir: "dist",
  },
  resolve: {
    alias: {
      "@": "/src",
    },
  },
});
