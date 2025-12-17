import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    // Allows the server to be accessible on your local network and via ngrok
    host: '0.0.0.0',
    // Explicitly allow your ngrok domain
    allowedHosts: ['8b949246f621.ngrok-free.app']
  }
})
