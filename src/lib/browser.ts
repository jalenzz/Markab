import type { BookmarkItem, FolderItem } from '@/features/bookmarks/types';
import { DEMO_FOLDERS } from '@/fixtures/demoData';

import {
    RECENT_FOLDER_ID,
    RECENT_ITEM_PREFIX,
    TOPSITE_FOLDER_ID,
    TOPSITE_ITEM_PREFIX,
} from './constants';
import { webext } from './runtime';

const isDemoMode = () => import.meta.env.VITE_DEMO_MODE === 'true';

class BrowserApiService {
    async getTopSitesAsBookmarkFolder(
        topSitesNum: number = 10,
        signal?: AbortSignal,
    ): Promise<FolderItem | null> {
        try {
            const topSites = await webext.topSites.get();
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            if (topSites.length === 0) return null;

            const limitedTopSites = topSites.slice(0, topSitesNum);

            const children: BookmarkItem[] = limitedTopSites.map((site, index) => ({
                id: `${TOPSITE_ITEM_PREFIX}${index}`,
                title: site.title || 'unnamed',
                url: site.url,
                parentId: TOPSITE_FOLDER_ID,
            }));

            return {
                id: TOPSITE_FOLDER_ID,
                title: 'Most Visited',
                children,
            };
        } catch (error) {
            if ((error as Error)?.name === 'AbortError') throw error;
            console.error('getTopSitesAsBookmarkFolder failed:', error);
            return null;
        }
    }

    async getRecentlyClosedAsBookmarkFolder(
        recentlyClosedNum: number = 10,
        signal?: AbortSignal,
    ): Promise<FolderItem | null> {
        try {
            const sessions = await webext.sessions.getRecentlyClosed({
                maxResults: recentlyClosedNum,
            });
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            const recentTabs: BookmarkItem[] = [];

            sessions.forEach((session, sessionIndex) => {
                const isWindow = session.window?.tabs && session.window.tabs.length > 1;

                recentTabs.push({
                    id: `${RECENT_ITEM_PREFIX}${sessionIndex}`,
                    title: isWindow
                        ? `${session.window?.tabs?.length || 0} tabs`
                        : session.tab?.title || 'unnamed',
                    url: session.tab?.url || '',
                    parentId: RECENT_FOLDER_ID,
                    ...(isWindow && {
                        action: async () => {
                            await webext.sessions.restore(session.window?.sessionId);
                        },
                    }),
                });
            });

            if (recentTabs.length === 0) return null;

            return {
                id: RECENT_FOLDER_ID,
                title: 'Recently Closed',
                children: recentTabs,
            };
        } catch (error) {
            if ((error as Error)?.name === 'AbortError') throw error;
            console.error('getRecentlyClosedAsBookmarkFolder failed: ', error);
            return null;
        }
    }

    async getBookmarkFolders(signal?: AbortSignal): Promise<FolderItem[]> {
        try {
            const bookmarkTree = await webext.bookmarks.getTree();

            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

            const folders: FolderItem[] = [];

            const traverseNodes = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
                for (const node of nodes) {
                    if (!node.url && node.children && node.children.length > 0) {
                        const bookmarks: BookmarkItem[] = node.children
                            .filter((child) => !!child.url)
                            .map((child) => ({
                                id: child.id,
                                title: child.title || 'unnamed',
                                url: child.url!,
                                parentId: child.parentId,
                            }));

                        if (bookmarks.length > 0) {
                            folders.push({
                                id: node.id,
                                title: node.title || 'unnamed',
                                children: bookmarks,
                            });
                        }

                        traverseNodes(node.children);
                    }
                }
            };

            for (const rootNode of bookmarkTree) {
                if (rootNode.children) {
                    traverseNodes(rootNode.children);
                }
            }

            return folders;
        } catch (error) {
            if ((error as Error)?.name !== 'AbortError') {
                console.error('getBookmarkFolders failed: ', error);
            }
            throw error;
        }
    }

    /**
     * 获取所有有效的文件夹
     */
    async getAllFolders(
        topSitesNum: number = 10,
        recentlyClosedNum: number = 10,
        signal?: AbortSignal,
    ): Promise<FolderItem[]> {
        if (isDemoMode()) {
            if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
            return DEMO_FOLDERS.map((folder) => ({
                ...folder,
                children: folder.children.slice(
                    0,
                    folder.id === TOPSITE_FOLDER_ID
                        ? topSitesNum
                        : folder.id === RECENT_FOLDER_ID
                          ? recentlyClosedNum
                          : folder.children.length,
                ),
            }));
        }

        const [bookmarkFolders, topSitesFolder, recentlyClosedFolder] = await Promise.all([
            this.getBookmarkFolders(signal),
            this.getTopSitesAsBookmarkFolder(topSitesNum, signal),
            this.getRecentlyClosedAsBookmarkFolder(recentlyClosedNum, signal),
        ]);

        if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');

        const folders: FolderItem[] = [...bookmarkFolders];

        if (recentlyClosedFolder) folders.unshift(recentlyClosedFolder);
        if (topSitesFolder) folders.unshift(topSitesFolder);

        return folders;
    }
}

export const browserApiService = new BrowserApiService();
