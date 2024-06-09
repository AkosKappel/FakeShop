import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/FakeShop',
  plugins: [react()],
  server: {
    // this part doesn't work on GitHub Pages because it must be a static site
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://fakestoreapi.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
  define: {
    'process.env': {
      API_URL: 'https://fakestoreapi.com',
      BASE_URL: '/FakeShop',
    },
  },
});
