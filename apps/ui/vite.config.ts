/// <reference types="vitest/importMeta" />
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vitejs.dev/config/
// @ts-ignore - Known type mismatch between vite and vitest versions (works at runtime)
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React and React DOM - rarely change, good for caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Mantine UI library - large, separate chunk
          'mantine-vendor': ['@mantine/core', '@mantine/form', '@mantine/hooks'],
          // Icons - large library, separate chunk
          'icons-vendor': ['@tabler/icons-react'],
          // React Query - separate chunk
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
    // Increase chunk size warning limit to 600KB (optional - you can remove this if you want stricter warnings)
    chunkSizeWarningLimit: 600,
  },
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx'],
    dedupe: ['react', 'react-dom'],
  },
})
