import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import px2rem from 'postcss-plugin-px2rem';
import postcssPresetEnv from 'postcss-preset-env';
import { resolve } from 'path';
import { VitePWA } from 'vite-plugin-pwa';
import legacy from '@vitejs/plugin-legacy';
import clearConsole from 'vite-plugin-clear-console';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  css: {
    postcss: {
      plugins: [
        postcssPresetEnv(),
        px2rem({
          rootValue: 16,
          propBlackList: ['font-size', 'border', 'border-width'],
          exclude: /(node_module)/,
        }),
      ],
    },
  },
  plugins: [
    vue(),
    legacy({
      targets: [
        'Android >= 39',
        'Chrome >= 50',
        'Safari >= 10.1',
        'iOS >= 10.3',
        '> 1%',
      ],
    }),
    VitePWA({
      injectRegister: 'auto',
      includeManifestIcons: true,
      registerType: 'prompt',
      includeAssets: ['favicon/*.png'],
      manifest: {
        name: '小春2048',
        short_name: '小春2048',
        description: '请小春吃蛋糕',
        lang: 'zh-CN',
        theme_color: '#62abe9',
        icons: [
          {
            src: '/favicon/apple-touch-icon.png',
            sizes: '180x180',
            type: 'image/png',
          },
          {
            src: '/favicon/maskable-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'maskable',
          },
          {
            src: '/favicon/android-chrome-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/favicon/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(mp4|mp3|wav|ogg)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'multimedia-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(woff2?)$/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
            },
          },
          {
            urlPattern: /(ScenarioCharacterNameExcelTable)\.(json)$/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'character-config-table',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|webp|ico|atlas|skel)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'image-live2d-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|json)$/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'asset-cache',
            },
          },
        ],
      },
      // uncomment to unregister service worker
      // selfDestroying: true,
    }),
    {
      ...clearConsole(),
      apply: 'build',
    },
  ],
  build: {
    emptyOutDir: true,
    minify: 'terser',
    terserOptions: {
      toplevel: true,
      safari10: true,
    },
  },
});
