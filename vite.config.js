import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        popup: 'popup.html',
        background: 'background.js',
        contentScript: 'contentScript.js'
      },
      output: {
        dir: 'dist',
        format: 'es'
      }
    }
  },
  server: {
    port: 3000,
    open: '/popup.html'
  }
});