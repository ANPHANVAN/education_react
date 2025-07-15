import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // Load biến từ file `.env`, `.env.development`, v.v.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react(), tailwindcss()],
    server: {
      port: 9000,
      host: true,
      allowedHosts: [new URL(env.VITE_API_URL).hostname, new URL(env.VITE_CLIENT_URL).hostname],
    },
    resolve: {
      alias: {
        '@': '/src',
      },
    },
  };
});
