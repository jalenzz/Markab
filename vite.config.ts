import path from 'node:path';

import { crx } from '@crxjs/vite-plugin';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, type PluginOption } from 'vite';
import zip from 'vite-plugin-zip-pack';

import { createManifest } from './manifest.config.js';
import { name, version } from './package.json';

export default defineConfig(({ mode }) => {
    const isFirefox = mode === 'firefox';
    const browser = isFirefox ? 'firefox' : 'chrome';
    const outDir = isFirefox ? 'dist/firefox' : 'dist';

    return {
        resolve: {
            alias: {
                '@': `${path.resolve(__dirname, 'src')}`,
            },
        },
        plugins: [
            react(),
            crx({ manifest: createManifest(browser), browser }),
            zip({
                outDir: 'release',
                inDir: outDir,
                outFileName: isFirefox ? `amo-${name}-${version}.zip` : `crx-${name}-${version}.zip`,
            }),
            ...(process.env.ANALYZE
                ? [
                      visualizer({
                          filename: `${outDir}/stats.html`,
                          open: true,
                          gzipSize: true,
                          brotliSize: true,
                      }) as PluginOption,
                  ]
                : []),
        ],
        build: {
            outDir,
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
    };
});
