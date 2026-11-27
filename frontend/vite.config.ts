import path from 'node:path';
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  base: process.env.VITE_BASE_PATH ?? '/English/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@english-quest/shared': path.resolve(__dirname, '../packages/shared/src/index.ts'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('recharts') || id.includes('d3-')) return 'vendor-charts';
          if (id.includes('motion')) return 'vendor-motion';
          if (id.includes('@tanstack') || id.includes('zustand')) return 'vendor-query';
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/')) {
            return 'vendor-react';
          }
          return undefined;
        },
      },
    },
  },
}));
