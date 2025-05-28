import { defineConfig } from '@octohash/vite-config'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  vue: true,
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})
