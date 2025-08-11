import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['vite.svg'],
      manifest: {
        name: 'BlueBadge',
        short_name: 'BlueBadge',
        description: 'Oefenplatform voor cognitieve en taalvaardigheden (NL/TR) voor politie-kandidaten',
        theme_color: '#0A3D91',
        background_color: '#0A3D91',
        display: 'standalone',
        start_url: '/',
        icons: [
          { src: '/icons/icon-192.svg', sizes: '192x192', type: 'image/svg+xml' },
          { src: '/icons/icon-512.svg', sizes: '512x512', type: 'image/svg+xml' }
        ]
      },
      workbox: {
        navigateFallbackDenylist: [/^\/__/, /.*\.(?:map)$/],
      },
    }),
  ],
  build: {
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks: {
          charts: ['chart.js', 'react-chartjs-2', 'chartjs-adapter-date-fns'],
        },
      },
    },
  },
}))
