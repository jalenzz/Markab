import { defineManifest } from '@crxjs/vite-plugin';

import pkg from './package.json';

export default defineManifest({
    manifest_version: 3,
    name: pkg.name,
    version: pkg.version,
    description: pkg.description,

    chrome_url_overrides: {
        newtab: 'index.html',
    },

    icons: {
        16: 'public/favicon.ico',
        32: 'public/favicon.ico',
        512: 'public/logo.png',
    },

    permissions: ['storage', 'bookmarks', 'topSites', 'history', 'sessions', 'favicon', 'tabs'],

    web_accessible_resources: [
        {
            resources: ['_favicon/*'],
            matches: ['<all_urls>'],
            use_dynamic_url: true,
        },
    ],
});
