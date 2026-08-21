import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import fs from "fs";

// Custom Vite plugin to copy manifest.json and icons directory into dist
function copyAssetsPlugin() {
  return {
    name: "copy-assets",
    closeBundle() {
      const manifestPath = resolve(__dirname, "src/manifest.json");
      const distManifestPath = resolve(__dirname, "dist/manifest.json");
      if (fs.existsSync(manifestPath)) {
        if (!fs.existsSync(resolve(__dirname, "dist"))) {
          fs.mkdirSync(resolve(__dirname, "dist"), { recursive: true });
        }
        fs.copyFileSync(manifestPath, distManifestPath);
        console.log("Successfully copied manifest.json to dist/");
      }

      const publicIconsDir = resolve(__dirname, "public/icons");
      const distIconsDir = resolve(__dirname, "dist/icons");
      if (fs.existsSync(publicIconsDir)) {
        if (!fs.existsSync(distIconsDir)) {
          fs.mkdirSync(distIconsDir, { recursive: true });
        }
        const files = fs.readdirSync(publicIconsDir);
        files.forEach((file) => {
          fs.copyFileSync(resolve(publicIconsDir, file), resolve(distIconsDir, file));
        });
        console.log("Successfully copied icons to dist/icons/");
      }
    }
  };
}

export default defineConfig({
  plugins: [react(), copyAssetsPlugin()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src")
    }
  },
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "src/popup/index.html"),
        options: resolve(__dirname, "src/options/index.html"),
        background: resolve(__dirname, "src/background/service-worker.ts"),
        content: resolve(__dirname, "src/content/content.ts")
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") return "background.js";
          if (chunkInfo.name === "content") return "content.js";
          return "assets/[name]-[hash].js";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]"
      }
    }
  },
  // Vitest config
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/**/*.test.ts"]
  }
} as any);
