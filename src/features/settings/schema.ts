export const DEFAULT_SETTINGS = {
    theme: 'auto' as const,
    fontFamily: '',
    fontSize: 14,
    topSitesNum: 10,
    recentlyClosedNum: 10,
    lockLayout: false,
    linkOpen: 'current-tab' as const,
    hiddenFolders: [] as string[],
    searchEngines:
        'Google,https://www.google.com/search?q={query};Bing,https://www.bing.com/search?q={query}',
} as const;

export const SETTINGS_CONFIG = {
    appearance: {
        title: 'Appearance',
        settings: [
            {
                key: 'theme',
                label: 'Theme',
                type: 'select',
                options: [
                    { value: 'auto', label: 'Auto' },
                    { value: 'light', label: 'Light' },
                    { value: 'dark', label: 'Dark' },
                ],
            },
            {
                key: 'fontFamily',
                label: 'Font',
                type: 'input',
                placeholder: 'Font name',
            },
            {
                key: 'fontSize',
                label: 'Font Size',
                type: 'slider',
                min: 10,
                max: 24,
                step: 1,
                showValue: true,
            },
        ],
    },
    general: {
        title: 'General',
        settings: [
            {
                key: 'topSitesNum',
                label: 'Top Sites',
                type: 'slider',
                min: 5,
                max: 20,
                step: 1,
                showValue: true,
            },
            {
                key: 'recentlyClosedNum',
                label: 'Recently Closed',
                type: 'slider',
                min: 5,
                max: 20,
                step: 1,
                showValue: true,
            },
            {
                key: 'lockLayout',
                label: 'Lock Layout',
                type: 'toggle',
            },
            {
                key: 'searchEngines',
                label: 'Search Engines',
                description: 'Format: Name,URL;Name,URL (use {query} for search term)',
                type: 'input',
                placeholder: '',
            },
            {
                key: 'linkOpen',
                label: 'Link Open',
                type: 'select',
                options: [
                    { value: 'current-tab', label: 'Current Tab' },
                    { value: 'new-tab', label: 'New Tab' },
                ],
            },
            {
                key: 'hiddenFolders',
                label: 'Show Folders',
                type: 'multi-select',
            },
        ],
    },
};
