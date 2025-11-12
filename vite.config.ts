import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const projectRootDir = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 3000,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 3000,
    strictPort: true,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/zrender')) {
            return 'zrender';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@assets': path.resolve(projectRootDir, 'src/assets'),
      '@components': path.resolve(projectRootDir, 'src/components'),
      '@layouts': path.resolve(projectRootDir, 'src/layouts'),
      '@pages': path.resolve(projectRootDir, 'src/pages'),
      '@services': path.resolve(projectRootDir, 'src/services'),
      '@api': path.resolve(projectRootDir, 'src/api'),
      '@contexts': path.resolve(projectRootDir, 'src/contexts'),
      '@utils': path.resolve(projectRootDir, 'src/utils'),
    },
  },
})
