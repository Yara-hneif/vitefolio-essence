import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_BASE_URL || 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'zustand', 'react-hook-form', '@tanstack/react-query'],
          builder: ['@builder.io/react', '@builder.io/sdk'],
          supabase: ['@supabase/supabase-js'],
          animations: ['framer-motion'],
          ui: ['lucide-react'],
        },
      },
    },
  },
})
