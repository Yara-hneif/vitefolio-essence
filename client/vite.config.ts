import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "node:path";
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    visualizer({
      open: true,
      filename: "bundle-analysis.html",
      gzipSize: true,
      brotliSize: true,
    }),
  ],
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
    alias: { "@": path.resolve(__dirname, "./src") },
    dedupe: ["react", "react-dom"],
  },
  build: {
    target: "es2020",
    sourcemap: mode !== "production",
    chunkSizeWarningLimit: 1500,
    commonjsOptions: {
      transformMixedEsModules: true,
      include: [/node_modules/],
    },
    rollupOptions: {
      onwarn(warning, warn) {
        // تجاهل تحذيرات eval من مكتبات Builder.io فقط
        if (warning.code === "EVAL" && warning.id?.includes("@builder.io")) return;
        warn(warning);
      },
      output: {
        // تقسيم أدقّ لمكاتب كبيرة بدل vendor واحد
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          if (id.includes("react-dom/client") || id.includes("react-dom") || id.includes("/react/"))
            return "react-core";
          if (id.includes("react-router") || id.includes("@remix-run/router")) return "router";
          if (id.includes("@tanstack/")) return "query";
          if (id.includes("@clerk/")) return "clerk";
          if (id.includes("@supabase/")) return "supabase";
          if (id.includes("@radix-ui/")) return "radix";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("react-spring")) return "spring";
          if (id.includes("@builder.io/")) return "builder";
          if (id.includes("react-toast") || id.includes("sonner")) return "toasts";
          if (id.includes("axios")) return "axios";
          return "vendor";
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
    minify: "terser",
    terserOptions: {
      compress: { drop_console: true, drop_debugger: true },
    },
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-dom/client", "use-sync-external-store"],
  },
}));
