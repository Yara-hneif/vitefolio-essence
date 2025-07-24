import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc' 
import path from 'path'
// Access environment variables in Vite config using process.env
// Example: process.env.VITE_API_BASE_URL + "/projects"


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
