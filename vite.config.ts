import path from 'node:path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import zip from 'vite-plugin-zip-pack';

import manifest from './manifest.config.js';
import { name, version } from './package.json';

export default defineConfig({
    resolve: {
        alias: {
            '@': `${path.resolve(__dirname, 'src')}`,
        },
    },
    plugins: [
        react(),
        crx({ manifest }),
        zip({ outDir: 'release', outFileName: `crx-${name}-${version}.zip` }),
        ...(process.env.ANALYZE
            ? [
                  visualizer({
                      filename: 'dist/stats.html',
                      open: true,
                      gzipSize: true,
                      brotliSize: true,
                  }) as PluginOption,
              ]
            : []),
    ],
    build: {
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('pinyin-pro')) {
                            return 'pinyin';
                        }
                        if (id.includes('emoji')) {
                            return 'emoji';
                        }
                        if (id.includes('motion') || id.includes('framer')) {
                            return 'motion';
                        }
                        return 'vendor';
                    }
                },
            },
        },
    },
    server: {
        cors: {
            origin: [/chrome-extension:\/\//],
        },
    },
});
