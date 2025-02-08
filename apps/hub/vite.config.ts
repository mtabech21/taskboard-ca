/// <reference types='vitest' />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(
  {
    root: __dirname,
    cacheDir: '../../node_modules/.vite/apps/hub',
    publicDir: '../../libs/client/assets',
    envDir: '../..',
    server: {
      port: 4021,
      host: 'localhost',
      watch: {
        ignored: (file) => !file.startsWith(path.resolve(__dirname))
      }
    },

    plugins: [react()],

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
  }

)

