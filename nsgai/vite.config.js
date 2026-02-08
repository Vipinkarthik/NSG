import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/camera': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/api/detection': {
        // Proxy detection requests to backend which forwards to AI service
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/api/alerts': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
      '/api/auth': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
