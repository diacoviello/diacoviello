import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

import { cloudflare } from "@cloudflare/vite-plugin";

// https://vite.dev/config/
export default defineConfig({
  // Served at the apex domain root (diacoviello.com), so base is '/'.
  // If you ever host under username.github.io/<repo>/, change this to '/<repo>/'.
  base: '/',
  plugins: [react(), cloudflare()],
})