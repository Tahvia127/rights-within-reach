import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        // Strip width/height so the icon is sized by CSS
        dimensions: false,
        // Use currentColor so stroke inherits text color
        replaceAttrValues: { '#000': 'currentColor' },
      },
    }),
  ],
  server: { port: 5173 },
})
