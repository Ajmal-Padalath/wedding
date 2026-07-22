import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages hosts this repository at /wedding/, not at the domain root.
  base: '/wedding/',
  plugins: [react(), tailwindcss()],
})
