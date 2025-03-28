/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    headers: {
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://safeframe.googlesyndication.com https://www.googletagmanager.com https://www.google-analytics.com https://cdn-cookieyes.com https://cdn-cookieyes.com/client_data/* https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673/*.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.init/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.init_consent/script.js https://cdn-cookieyes.com/client_data/64ceae5ed2ab25cfc6922673gtm.js/script.js https://*.cdn-cookieyes.com https://vizitor.hu https://*.googlesyndication.com https://*.doubleclick.net https://doubleclick.net https://www.google.com https://region1.google-analytics.com; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net data: 'unsafe-hashes'; img-src 'self' data: https: https://www.google-analytics.com https://*.doubleclick.net https://doubleclick.net https://www.google.com; font-src 'self' data: https:; connect-src 'self' https: ws: wss: https://www.google-analytics.com https://cdn-cookieyes.com https://*.cdn-cookieyes.com https://*.doubleclick.net https://doubleclick.net https://www.google.com https://region1.google-analytics.com; worker-src 'self' blob:; frame-src 'self' https://safeframe.googlesyndication.com https://*.googlesyndication.com https://www.googletagmanager.com https://cdn-cookieyes.com https://*.cdn-cookieyes.com https://vizitor.hu https://*.doubleclick.net https://doubleclick.net https://www.google.com; object-src 'none';",
      'Cache-Control': 'public, max-age=31536000',
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block'
    },
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
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
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
