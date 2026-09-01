// frontend/vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: "/",
  resolve: {
    alias: {
      '@': '/src'  // Allows imports like "@/components/Header"
    }
  },


  root: './',  // Use './' to point to your current directory inside '/frontend'
  build: {
    outDir: './build',  // Vite will put the build files in /frontend/build
  },
});
