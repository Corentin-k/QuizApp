import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import 'dotenv/config'
import * as path from "node:path";

const dbPort = process.env.PORT_DB; // Database port
const wsPort = process.env.PORT_WS;   // WebSocket Server port
const frontPort = process.env.PORT_FRONTEND||5175;

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',  // Dossier de sortie
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
    },
  },
  plugins: [vue() ],
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
