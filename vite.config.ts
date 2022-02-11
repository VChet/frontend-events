import path from "path";
import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { VitePWA } from "vite-plugin-pwa";
import type { VitePWAOptions } from "vite-plugin-pwa";

const pwaOptions: Partial<VitePWAOptions> = {
  base: "/",
  strategies: "injectManifest",
  srcDir: "src",
  filename: "sw.ts",
  includeAssets: ["favicon.ico", "robots.txt", "apple-touch-icon.png"],
  manifest: {
    name: "Календарь событий по фронтенду",
    short_name: "Frontend Events",
    description: "Конференции, митапы и другие события по фронтенду в одном календаре",
    theme_color: "#202b38",
    background_color: "#202b38",
    icons: [
      { src: "/icon-192x192.png", type: "image/png", sizes: "192x192" },
      { src: "/icon-512x512.png", type: "image/png", sizes: "512x512" },
    ],
  },
  workbox: { sourcemap: true },
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte(), VitePWA(pwaOptions)],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
