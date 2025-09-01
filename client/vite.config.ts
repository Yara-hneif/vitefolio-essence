import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_BASE_URL || "http://localhost:5000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      onwarn(warning, warn) {
        if (warning.code === "EVAL" && /@builder\.io/.test(String(warning.id ?? ""))) {
          return;
        }
        warn(warning);
      },
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;
          if (id.includes("react")) return "react";
          if (id.includes("@supabase")) return "supabase";
          if (id.includes("@builder.io")) return "builder";
          if (id.includes("framer-motion")) return "animations";
          if (id.includes("lucide-react") || id.includes("@radix-ui")) return "ui";
          return "vendor";
        },
      },
    },
  },

  optimizeDeps: {
    include: [],
  },
});
