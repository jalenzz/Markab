import type { FolderItem } from '@/features/bookmarks/types';
import {
    RECENT_FOLDER_ID,
    RECENT_FOLDER_TITLE,
    RECENT_ITEM_PREFIX,
    TOPSITE_FOLDER_ID,
    TOPSITE_FOLDER_TITLE,
    TOPSITE_ITEM_PREFIX,
} from '@/lib/constants';

const demoBookmarkFolders: FolderItem[] = [
    {
        id: 'demo-dev',
        title: 'Development',
        children: [
            {
                id: 'demo-dev-1',
                title: 'GitHub',
                url: 'https://github.com',
                parentId: 'demo-dev',
            },
            {
                id: 'demo-dev-2',
                title: 'MDN Web Docs',
                url: 'https://developer.mozilla.org',
                parentId: 'demo-dev',
            },
            {
                id: 'demo-dev-3',
                title: 'Stack Overflow',
                url: 'https://stackoverflow.com',
                parentId: 'demo-dev',
            },
            {
                id: 'demo-dev-4',
                title: 'React',
                url: 'https://react.dev',
                parentId: 'demo-dev',
            },
        ],
    },
    {
        id: 'demo-design',
        title: 'Design',
        children: [
            {
                id: 'demo-design-1',
                title: 'Figma',
                url: 'https://www.figma.com',
                parentId: 'demo-design',
            },
            {
                id: 'demo-design-2',
                title: 'Dribbble',
                url: 'https://dribbble.com',
                parentId: 'demo-design',
            },
            {
                id: 'demo-design-3',
                title: 'Behance',
                url: 'https://www.behance.net',
                parentId: 'demo-design',
            },
        ],
    },
    {
        id: 'demo-reading',
        title: 'Reading',
        children: [
            {
                id: 'demo-reading-1',
                title: 'Wikipedia',
                url: 'https://www.wikipedia.org',
                parentId: 'demo-reading',
            },
            {
                id: 'demo-reading-2',
                title: 'Hacker News',
                url: 'https://news.ycombinator.com',
                parentId: 'demo-reading',
            },
            {
                id: 'demo-reading-3',
                title: 'Medium',
                url: 'https://medium.com',
                parentId: 'demo-reading',
            },
        ],
    },
    {
        id: 'demo-productivity',
        title: 'Productivity',
        children: [
            {
                id: 'demo-productivity-1',
                title: 'Notion',
                url: 'https://www.notion.so',
                parentId: 'demo-productivity',
            },
            {
                id: 'demo-productivity-2',
                title: 'Google Calendar',
                url: 'https://calendar.google.com',
                parentId: 'demo-productivity',
            },
            {
                id: 'demo-productivity-3',
                title: 'Linear',
                url: 'https://linear.app',
                parentId: 'demo-productivity',
            },
        ],
    },
    {
        id: 'demo-ai',
        title: 'AI',
        children: [
            {
                id: 'demo-ai-1',
                title: 'ChatGPT',
                url: 'https://chatgpt.com',
                parentId: 'demo-ai',
            },
            {
                id: 'demo-ai-2',
                title: 'Claude',
                url: 'https://claude.ai',
                parentId: 'demo-ai',
            },
            {
                id: 'demo-ai-3',
                title: 'Cursor',
                url: 'https://cursor.com',
                parentId: 'demo-ai',
            },
            {
                id: 'demo-ai-4',
                title: 'DeepSeek',
                url: 'https://chat.deepseek.com',
                parentId: 'demo-ai',
            },
        ],
    },
    {
        id: 'demo-tools',
        title: 'Tools',
        children: [
            {
                id: 'demo-tools-1',
                title: 'Can I Use',
                url: 'https://caniuse.com',
                parentId: 'demo-tools',
            },
            {
                id: 'demo-tools-2',
                title: 'Tailwind CSS',
                url: 'https://tailwindcss.com',
                parentId: 'demo-tools',
            },
            {
                id: 'demo-tools-3',
                title: 'Vite',
                url: 'https://vite.dev',
                parentId: 'demo-tools',
            },
        ],
    },
];

const demoTopSitesFolder: FolderItem = {
    id: TOPSITE_FOLDER_ID,
    title: TOPSITE_FOLDER_TITLE,
    children: [
        {
            id: `${TOPSITE_ITEM_PREFIX}0`,
            title: 'GitHub',
            url: 'https://github.com',
            parentId: TOPSITE_FOLDER_ID,
        },
        {
            id: `${TOPSITE_ITEM_PREFIX}1`,
            title: 'MDN Web Docs',
            url: 'https://developer.mozilla.org',
            parentId: TOPSITE_FOLDER_ID,
        },
        {
            id: `${TOPSITE_ITEM_PREFIX}2`,
            title: 'Figma',
            url: 'https://www.figma.com',
            parentId: TOPSITE_FOLDER_ID,
        },
        {
            id: `${TOPSITE_ITEM_PREFIX}3`,
            title: 'React',
            url: 'https://react.dev',
            parentId: TOPSITE_FOLDER_ID,
        },
        {
            id: `${TOPSITE_ITEM_PREFIX}4`,
            title: 'Tailwind CSS',
            url: 'https://tailwindcss.com',
            parentId: TOPSITE_FOLDER_ID,
        },
        {
            id: `${TOPSITE_ITEM_PREFIX}5`,
            title: 'Vite',
            url: 'https://vite.dev',
            parentId: TOPSITE_FOLDER_ID,
        },
    ],
};

const demoRecentlyClosedFolder: FolderItem = {
    id: RECENT_FOLDER_ID,
    title: RECENT_FOLDER_TITLE,
    children: [
        {
            id: `${RECENT_ITEM_PREFIX}0`,
            title: 'Chrome Extensions Docs',
            url: 'https://developer.chrome.com/docs/extensions',
            parentId: RECENT_FOLDER_ID,
        },
        {
            id: `${RECENT_ITEM_PREFIX}1`,
            title: 'TypeScript Handbook',
            url: 'https://www.typescriptlang.org/docs',
            parentId: RECENT_FOLDER_ID,
        },
        {
            id: `${RECENT_ITEM_PREFIX}2`,
            title: 'Zustand',
            url: 'https://zustand.docs.pmnd.rs',
            parentId: RECENT_FOLDER_ID,
        },
        {
            id: `${RECENT_ITEM_PREFIX}3`,
            title: 'Motion',
            url: 'https://motion.dev',
            parentId: RECENT_FOLDER_ID,
        },
    ],
};

export const DEMO_FOLDERS: FolderItem[] = [
    demoRecentlyClosedFolder,
    demoTopSitesFolder,
    ...demoBookmarkFolders,
];
