import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/shadcn-vue-multiselect/', // IMPORTANT for GitHub Pages
  plugins: [vue()],
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})
