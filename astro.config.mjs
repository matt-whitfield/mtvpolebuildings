// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  integrations: [tailwind()],
  build: {
    // Optimize JavaScript and CSS bundles
    minify: true,
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      // Reduce bundle size with better tree shaking
      rollupOptions: {
        output: {
          manualChunks(id) {
            // Keep vendor libs in separate chunks
            if (id.includes('node_modules')) {
              return 'vendor';
            }
          }
        }
      },
      // Enable compression
      cssCodeSplit: true,
      // Minimize unused CSS
      cssMinify: true
    }
  }
});