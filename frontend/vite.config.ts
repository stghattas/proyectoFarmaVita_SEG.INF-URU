import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['intranet.farmaceutica.local'],  
    host: true, // Permite conexiones desde la red de Docker (0.0.0.0)
  }
})