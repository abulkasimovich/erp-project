import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // har bir "/api" so‘rovni backend’ga yo‘naltirish:
      "/api": {
        target: "[localhost](http://localhost:3000)",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
})
