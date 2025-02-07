/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: __dirname,
  cacheDir: '../../node_modules/.vite/apps/portal',
  publicDir: '../../libs/client/assets',
  envDir: '../..',

  server: {
    port: 3021,
    host: 'localhost',
  },

  plugins: [react()],
  // Uncomment this if you are using workers.
  // worker: {
  //  plugins: [ nxViteTsPaths() ],
  // },
  resolve: {
    alias: {
      '@shad': path.resolve(__dirname, '../../libs/client/ui/src/components/shad'),
      '@assets': path.resolve(__dirname, '../../libs/client/assets'),
      '@taskboard': path.resolve(__dirname, '../../libs')
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
