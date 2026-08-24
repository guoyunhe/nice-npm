import { resolve } from 'path';

import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },
  },
  input: {
    background: resolve(import.meta.dirname, 'src', 'background.ts'),
    'content-package': resolve(import.meta.dirname, 'src', 'content-package', 'index.ts'),
    'content-search': resolve(import.meta.dirname, 'src', 'content-search', 'index.ts'),
    options: resolve(import.meta.dirname, 'options.html'),
    popup: resolve(import.meta.dirname, 'popup.html'),
  },
  plugins: [preact()],
});
