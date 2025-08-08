import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // Load biến từ file `.env`, `.env.development`, v.v.
  const env = loadEnv(mode, process.cwd(), '');

  // Disable HMR in production, enable in development
  const isProduction = env.VITE_APP_ENV === 'production';
  const hmrConfig = isProduction
    ? false
    : {
        protocol: 'ws',
        host: 'localhost',
        port: 9000,
        clientPort: 9000,
        timeout: 30000,
      };
  // Xác định host và port cho HMR dựa trên môi trường
  const hmrHost = env.CLIENT_SERVER_NAME; // example: web.com
  const hmrPort = 443;

  return {
    plugins: [react(), tailwindcss()],
    build: {
      sourcemap: false,
      rollupOptions: {
        external: ['path', 'fs', 'url', 'source-map-js', 'postcss', '@tailwindcss/node'],
      },
      optimizeDeps: {
        exclude: ['path', 'fs', 'url', 'source-map-js', 'postcss', '@tailwindcss/node'],
      },
    },
    server: {
      host: '0.0.0.0',
      port: 9000,
      strictPort: true,
      cors: false,
      allowedHosts: true,
      // [
      //   new URL(env.VITE_API_URL).hostname,
      //   new URL(env.VITE_CLIENT_URL).hostname,
      //   'http://localhost:9000',
      // ],
      hmr: hmrConfig,
      watch: true,
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
    define: {
      // Truyền biến môi trường vào client-side code
      'process.env.VITE_APP_ENV': JSON.stringify(env.VITE_APP_ENV),
      'process.env.VITE_API_URL': JSON.stringify(env.VITE_API_URL),
      'process.env.VITE_CLIENT_URL': JSON.stringify(env.VITE_CLIENT_URL),
      'process.env.VITE_LOG_LEVEL': JSON.stringify(env.VITE_LOG_LEVEL),
    },
  };
});
