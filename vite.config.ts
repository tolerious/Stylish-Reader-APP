import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import vueDevTools from 'vite-plugin-vue-devtools';
// https://vitejs.dev/config/
export default defineConfig({
    build: { outDir: 'stylish-reader-app' },
    plugins: [
        vue(),
        vueJsx(),
        AutoImport({ resolvers: [ElementPlusResolver()] }),
        Components({ resolvers: [ElementPlusResolver()] }),
        vueDevTools(),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
        },
    },
    server: {
        https: false,
        host: '0.0.0.0',
        port: 4577,
        cors: true,
        proxy: {
            '/api/v1/': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true,
                rewrite: path => path.replace('/api/v1', ''),
            },
        },
    },
});
