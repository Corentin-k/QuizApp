import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import 'dotenv/config'
const dbPort = process.env.PORT_DB; // Database port
const wsPort = process.env.PORT_WS;   // WebSocket Server port
const frontPort = process.env.PORT_FRONTEND;

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    port: frontPort,
    proxy: {
      '/users': {
        target: `http://localhost:${dbPort}`, // Backend API server
        changeOrigin: true,
      },
      '/ws': {
        target: `ws://localhost:${wsPort}`, // WebSocket server
        ws: true,
        changeOrigin: true,
      },
      '/question':{
        target: `http://localhost:${dbPort}`, // Backend API server
        changeOrigin: true,
      },
    },
  },


})
