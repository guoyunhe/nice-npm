import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import { resolve } from 'path';

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
    background: resolve(import.meta.dirname, 'src/background/index.ts'),
    content: resolve(import.meta.dirname, 'src/content/index.ts'),
    options: resolve(import.meta.dirname, 'options.html'),
    popup: resolve(import.meta.dirname, 'popup.html'),
  },
  plugins: [preact()],
});
