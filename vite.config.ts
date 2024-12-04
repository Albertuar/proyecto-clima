import MillionLint from "@million/lint";
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [MillionLint.vite({
    enabled: true
  }), react()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
  
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
