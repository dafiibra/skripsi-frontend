import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    proxy: {
      '/pencari-kerja': 'http://localhost:3000', // Proxy untuk endpoint API
      '/lowongan-kerja': 'http://localhost:3000'  // Tambahkan proxy untuk endpoint lain jika perlu
    }
  }
});
