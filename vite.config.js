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
        name: 'سیگی - همراه ترک سیگار',
        short_name: 'سیگی',
        description: 'همراه هوشمند ترک سیگار با یادآوری و آمار دقیق',
        start_url: '/',
        display: 'standalone',
        background_color: '#0f172a',
        theme_color: '#0f172a',
        orientation: 'portrait',
        dir: 'rtl',
        lang: 'fa',
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
        categories: ['health', 'lifestyle'],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
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
})
