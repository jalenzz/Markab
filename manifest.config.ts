import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export type ExtensionBrowser = 'chrome' | 'firefox';

const SHARED_PERMISSIONS = [
    'storage',
    'bookmarks',
    'topSites',
    'history',
    'sessions',
    'search',
] as const;

export function createManifest(browser: ExtensionBrowser) {
    const isFirefox = browser === 'firefox';

    return defineManifest({
        manifest_version: 3,
        name: pkg.name,
        version: pkg.version,
        description: pkg.description,

        chrome_url_overrides: {
            newtab: 'index.html',
        },

        icons: isFirefox
            ? {
                  48: 'public/favicon.ico',
                  96: 'public/logo.png',
              }
            : {
                  16: 'public/favicon.ico',
                  32: 'public/favicon.ico',
                  512: 'public/logo.png',
              },

        permissions: [
            ...SHARED_PERMISSIONS,
            ...(isFirefox ? [] : (['favicon', 'tabs'] as const)),
        ],

        ...(isFirefox
            ? {
                  browser_specific_settings: {
                      gecko: {
                          id: 'markab@bookmark-new-tab',
                          strict_min_version: '109.0',
                      },
                  },
              }
            : {
                  web_accessible_resources: [
                      {
                          resources: ['_favicon/*'],
                          matches: ['<all_urls>'],
                          use_dynamic_url: true,
                      },
                  ],
              }),
    });
}

export default createManifest('chrome');
