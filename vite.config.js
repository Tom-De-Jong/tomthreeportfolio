import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  server: {
    proxy: {
      '/sendForm.php': 'http://localhost:8001',
    },
  },
});
