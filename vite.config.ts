/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/safeframe': {
        target: 'https://safeframe.googlesyndication.com',
        changeOrigin: true,
        secure: true,
        headers: {
          'Cache-Control': 'public, max-age=3600, must-revalidate',
          'X-Content-Type-Options': 'nosniff',
          'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://safeframe.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn-cookieyes.com https://cdn-cookieyes.com/client_data/* https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673/*.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.init/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.init_consent/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.js/script.js https://*.cdn-cookieyes.com https://vizitor.hu https://*.googlesyndication.com https://*.doubleclick.net https://doubleclick.net https://www.google.com https://region1.google-analytics.com; frame-src 'self' https://safeframe.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://cdn-cookieyes.com https://*.cdn-cookieyes.com https://vizitor.hu https://*.doubleclick.net https://doubleclick.net https://www.google.com;"
        }
      },
      '/api': 'http://localhost:1337',
      '/uploads': 'http://localhost:1337',
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    cssMinify: true,
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'animations': ['framer-motion'],
          'icons': ['lucide-react']
        }
      }
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'framer-motion', 'lucide-react']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
  },
});
