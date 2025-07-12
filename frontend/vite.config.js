import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: (process.env.VITE_API_BASE_URL || 'https://backend-videotube-oaq4.onrender.com/api/v1').replace('/api/v1', ''),
        changeOrigin: true,
        secure: true
      }
    }
  }
})
