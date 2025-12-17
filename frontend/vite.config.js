// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'

// // https://vite.dev/config/
// export default defineConfig({
//   plugins: [react()],
//    server: {
//     // Allows the server to be accessible on your local network and via ngrok
//     host: '0.0.0.0',
//     // Explicitly allow your ngrok domain
//     allowedHosts: ['8b949246f621.ngrok-free.app']
//   }
// })

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Add base for Vercel deployment
  base: '/',
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  // Remove dev server config for production
  // server: { ... } // ← Comment this out or remove
})