import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import VueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),VueJsx()],
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    preprocessorOptions: {
        less: {
            modifyVars: {
            },
            javascriptEnabled: true,
        },
    },
},
  build: {
    manifest: true
  }
});
