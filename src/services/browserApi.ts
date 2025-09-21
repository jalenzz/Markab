import browser, { type Bookmarks } from 'webextension-polyfill';

import type { BookmarkItem, FolderItem } from '../types';

class BrowserApiService {
    async getTopSitesAsBookmarkFolder(topSitesNum: number = 10): Promise<FolderItem | null> {
        try {
            const topSites = await browser.topSites.get();
            if (topSites.length === 0) return null;

            const limitedTopSites = topSites.slice(0, topSitesNum);

            const children: BookmarkItem[] = limitedTopSites.map((site, index) => ({
                id: `topsite-${index}`,
                title: site.title || 'unnamed',
                url: site.url,
                parentId: 'topsite-folder',
            }));

            return {
                id: 'topsite-folder',
                title: 'Most Visited',
                children,
            };
        } catch (error) {
            console.error('getTopSitesAsBookmarkFolder failed:', error);
            return null;
        }
    }

    async getRecentlyClosedAsBookmarkFolder(
        recentlyClosedNum: number = 10,
    ): Promise<FolderItem | null> {
        try {
            const sessions = await browser.sessions.getRecentlyClosed({
                maxResults: recentlyClosedNum,
            });
            const recentTabs: BookmarkItem[] = [];

            sessions.forEach((session, sessionIndex) => {
                const isWindow = session.window?.tabs && session.window.tabs.length > 1;

                recentTabs.push({
                    id: `recent-${sessionIndex}`,
                    title: isWindow
                        ? `${session.window?.tabs?.length || 0} tabs`
                        : session.tab?.title || 'unnamed',
                    url: session.tab?.url || '',
                    parentId: 'recent-folder',
                    ...(isWindow && {
                        action: async () => {
                            await browser.sessions.restore(session.window?.sessionId);
                        },
                    }),
                });
            });

            if (recentTabs.length === 0) return null;

            return {
                id: 'recent-folder',
                title: 'Recently Closed',
                children: recentTabs,
            };
        } catch (error) {
            console.error('getRecentlyClosedAsBookmarkFolder failed: ', error);
            return null;
        }
    }

    async getBookmarkFolders(): Promise<FolderItem[]> {
        try {
            const bookmarkTree = await browser.bookmarks.getTree();

            const folders: FolderItem[] = [];

            const traverseNodes = (nodes: Bookmarks.BookmarkTreeNode[]) => {
                for (const node of nodes) {
                    if (!node.url && node.children && node.children.length > 0) {
                        const bookmarks: BookmarkItem[] = node.children
                            .filter((child: Bookmarks.BookmarkTreeNode) => !!child.url)
                            .map((child: Bookmarks.BookmarkTreeNode) => ({
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
            console.error('getBookmarkFolders failed: ', error);
            throw error;
        }
    }

    async getAllFolders(
        topSitesNum: number = 10,
        recentlyClosedNum: number = 10,
    ): Promise<FolderItem[]> {
        const [bookmarkFolders, topSitesFolder, recentlyClosedFolder] = await Promise.all([
            this.getBookmarkFolders(),
            this.getTopSitesAsBookmarkFolder(topSitesNum),
            this.getRecentlyClosedAsBookmarkFolder(recentlyClosedNum),
        ]);

        const folders: FolderItem[] = [...bookmarkFolders];

        if (recentlyClosedFolder) folders.unshift(recentlyClosedFolder);
        if (topSitesFolder) folders.unshift(topSitesFolder);

        return folders;
    }
}

export const browserApiService = new BrowserApiService();
