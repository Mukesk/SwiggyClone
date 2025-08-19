import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import history from "connect-history-api-fallback";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    middlewareMode: false,
    setupMiddlewares(middlewares) {
      middlewares.push(history());
      return middlewares;
    }
  },
  preview: {
    port: 3000,
    strictPort: true,
  }
});
