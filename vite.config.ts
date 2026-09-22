import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";
import path from "node:path";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: null,
      includeAssets: ["favicon.svg", "icons/apple-touch-icon.png"],
      manifest: {
        id: "/",
        name: "SOS",
        short_name: "SOS",
        description: "SOS — záchranný prostor. Hudba a dech, když to potřebuješ.",
        theme_color: "#07060c",
        background_color: "#07060c",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        scope: "/",
        lang: "cs",
        categories: ["music", "health", "lifestyle"],
        display_override: ["standalone", "minimal-ui"],
        dir: "ltr",
        prefer_related_applications: false,
        icons: [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512-maskable.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff,woff2,webmanifest}"],
        navigateFallback: "/index.html",
        navigateFallbackDenylist: [/^\/audio\//],
        cleanupOutdatedCaches: true,
        skipWaiting: true,
        clientsClaim: true,
        runtimeCaching: [
          {
            urlPattern: /\/audio\/.+\.(?:mp3|m4a|aac|wav|ogg)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "sos-audio",
              rangeRequests: true,
              cacheableResponse: { statuses: [200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: "module",
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    watch: {
      ignored: ["**/public/audio/**"],
    },
  },
});
