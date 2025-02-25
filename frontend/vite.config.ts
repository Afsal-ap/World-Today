import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['simple-peer', 'readable-stream'], // Pre-bundle these
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true, // Handle mixed module types
    },
    rollupOptions: {
      external: [], // Don’t externalize simple-peer
    },
  },
});