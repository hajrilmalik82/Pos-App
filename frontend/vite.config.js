// frontend/vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react()
  ],
  server: {
    allowedHosts: ['.ngrok-free.app'], // Ini sudah benar
    proxy: {
      // Semua permintaan ke /api akan langsung diteruskan ke backend
      '/api': {
        target: 'http://localhost:3000', // Port backend Anda
        changeOrigin: true,
        // Kita tidak perlu 'rewrite' lagi
      }
    }
  }
});