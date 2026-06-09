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
          // React 核心：几乎不变，适合长期缓存
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/') || id.includes('node_modules/react-router')) return 'vendor-react';
          // Radix UI：shadcn 基础，稳定
          if (id.includes('node_modules/@radix-ui/')) return 'vendor-radix';
          // 图标库：较大且版本稳定
          if (id.includes('node_modules/lucide-react')) return 'vendor-icons';
          // 工具库：日期、HTTP、状态管理
          if (id.includes('node_modules/date-fns') || id.includes('node_modules/axios') || id.includes('node_modules/zustand')) return 'vendor-utils';
          // 以下保持原有拆分
          if (id.includes('node_modules/highlight.js')) return 'vendor-highlight';
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3-')) return 'vendor-charts';
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/unified') || id.includes('node_modules/mdast') || id.includes('node_modules/hast')) return 'vendor-markdown';
          if (id.includes('node_modules/@uiw/react-md-editor') || id.includes('node_modules/@uiw/')) return 'vendor-md-editor';
        },
      },
    },
  },
})
