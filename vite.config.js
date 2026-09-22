import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { readFileSync } from 'node:fs'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'icon-192.png', 'icon-512.png'],
      manifest: {
        name: 'Cigi - Quit Smoking',
        short_name: 'Cigi',
        description: 'Your premium quit smoking companion with reminders, stats, and progress tracking',
        start_url: '/',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        background_color: '#0a0e1a',
        theme_color: '#0a0e1a',
        orientation: 'portrait',
        dir: 'ltr',
        lang: 'en',
        scope: '/',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        categories: ['health', 'lifestyle', 'medical'],
        shortcuts: [
          {
            name: 'Log Cigarette',
            short_name: 'Log',
            description: 'Quickly log a cigarette',
            url: '/?action=log',
            icons: [{ src: '/icon-192.png', sizes: '192x192' }],
          },
        ],
        screenshots: [],
        prefer_related_applications: false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    https: {
      key: readFileSync('key.pem'),
      cert: readFileSync('cert.pem'),
    },
  },
  preview: {
    host: '0.0.0.0',
    https: {
      key: readFileSync('key.pem'),
      cert: readFileSync('cert.pem'),
    },
  },
  build: {
    sourcemap: true,
  },
})