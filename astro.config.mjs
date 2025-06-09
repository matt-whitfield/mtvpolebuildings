// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import compress from 'astro-compress';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind(),
    compress({
      CSS: true,
      HTML: true,
      Image: false, // Keep images as they're already optimized
      JavaScript: true,
      SVG: true,
    })
  ],
  build: {
    minify: true,
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['astro', '@astrojs/tailwind']
          }
        }
      }
    }
  }
});