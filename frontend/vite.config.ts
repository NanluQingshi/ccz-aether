import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/highlight.js')) return 'vendor-highlight';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts';
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/unified') || id.includes('node_modules/mdast') || id.includes('node_modules/hast')) return 'vendor-markdown';
          if (id.includes('node_modules/@uiw/react-md-editor') || id.includes('node_modules/@uiw/')) return 'vendor-md-editor';
        },
      },
    },
  },
})
