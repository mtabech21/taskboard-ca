/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/landing',

  server: {
    port: 5021,
    host: 'localhost',
  },

  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  resolve: {
    alias: {
      '@shad': path.resolve(__dirname, '../../libs/ui/src/components/shad'),
      '@taskboard/ui': path.resolve(__dirname, '../../libs/ui'),
    }
  },
  build: {
    outDir: './dist',
    emptyOutDir: true,
    reportCompressedSize: true,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
