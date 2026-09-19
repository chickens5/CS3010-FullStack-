// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // Backend target for dev proxy and doesnt reach browser bundle.
  const backendTarget = env.VITE_BACKEND_URL || 'http://localhost:5000';

  return {
    plugins: [react()],
    base: "/",
    root: './',
    build: {
      outDir: './build',
    },
    server: {
      proxy: {
        '/api': { target: backendTarget, changeOrigin: true },
        '/uploads': { target: backendTarget, changeOrigin: true },
      },
    },
  };
});
