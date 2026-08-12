import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "."),
      "next/font/google": path.resolve(import.meta.dirname, "test/mocks/next-font.ts"),
      "next/font/local": path.resolve(import.meta.dirname, "test/mocks/next-font.ts"),
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: ["./test/setup.ts"],
    globals: true,
    exclude: ["node_modules/**", ".next/**"],
  },
});
