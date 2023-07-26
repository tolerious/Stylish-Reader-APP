import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    https: false,
    port: 3000,
    cors: true,
    proxy: {
      '/api/v1/': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace('/api/v1', '')
      }
    }
  }
})
