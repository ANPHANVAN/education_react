import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // Load biến từ file `.env`, `.env.development`, v.v.
  const env = loadEnv(mode, process.cwd(), '');

  // Xác định host và port cho HMR dựa trên môi trường
  const hmrHost = env.VITE_APP_ENV === 'production' ? 'web.com' : 'localhost';
  const hmrPort = env.VITE_APP_ENV === 'production' ? 80 : 9000;

  return {
    plugins: [react(), tailwindcss()],
    server: {
      host: '0.0.0.0',
      port: 9000,
      strictPort: true,
      cors: false,
      allowedHosts: [new URL(env.VITE_API_URL).hostname, new URL(env.VITE_CLIENT_URL).hostname],
    },
    hmr: {
      host: hmrHost, //example: web.com 👈 RẤT QUAN TRỌNG: để HMR websocket hoạt động đúng qua Nginx
      protocol: env.VITE_WS_URL.startsWith('wss') ? 'wss' : 'ws', //
      port: hmrPort, // 👈 VÌ websocket được gửi qua Nginx (cổng 80)
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
