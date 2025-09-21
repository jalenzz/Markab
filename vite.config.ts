import path from 'node:path';

import { crx, type ManifestV3Export } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import zip from 'vite-plugin-zip-pack';

import { name, version } from './package.json';

const browser = process.env.BROWSER_TARGET || 'chrome';

const manifest = (await import(`./manifest.${browser}.config.ts`)).default as ManifestV3Export;

export default defineConfig({
    resolve: {
        alias: {
            '@': `${path.resolve(__dirname, 'src')}`,
        },
    },
    plugins: [
        react(),
        crx({ manifest }),
        zip({ outDir: 'release', outFileName: `${browser}-${name}-${version}.zip` }),
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
