import type { BookmarkItem, FolderItem } from '../types';

class BrowserApiService {
    async getTopSitesAsBookmarkFolder(): Promise<FolderItem | null> {
        try {
            const topSites = await chrome.topSites.get();
            if (topSites.length === 0) return null;

            const limitedTopSites = topSites.slice(0, 10);

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

    async getRecentlyClosedAsBookmarkFolder(): Promise<FolderItem | null> {
        try {
            const sessions = await chrome.sessions.getRecentlyClosed();
            const recentTabs: BookmarkItem[] = [];

            sessions.forEach((session, sessionIndex) => {
                if (session.tab) {
                    // 单个标签页
                    recentTabs.push({
                        id: `recent-tab-${sessionIndex}`,
                        title: session.tab.title || 'unnamed',
                        url: session.tab.url || '',
                        parentId: 'recent-folder',
                    });
                } else if (session.window?.tabs) {
                    // 窗口中的多个标签页
                    session.window.tabs.forEach((tab, tabIndex) => {
                        recentTabs.push({
                            id: `recent-window-${sessionIndex}-tab-${tabIndex}`,
                            title: tab.title || 'unnamed',
                            url: tab.url || '',
                            parentId: 'recent-folder',
                        });
                    });
                }
            });

            if (recentTabs.length === 0) return null;

            const limitedRecentTabs = recentTabs.slice(0, 10);

            return {
                id: 'recent-folder',
                title: 'Recently Closed',
                children: limitedRecentTabs,
            };
        } catch (error) {
            console.error('getRecentlyClosedAsBookmarkFolder failed: ', error);
            return null;
        }
    }

    async getBookmarkFolders(): Promise<FolderItem[]> {
        try {
            const bookmarkTree = await new Promise<chrome.bookmarks.BookmarkTreeNode[]>(
                (resolve, reject) => {
                    chrome.bookmarks.getTree((result) => {
                        if (chrome.runtime.lastError) {
                            reject(new Error(chrome.runtime.lastError.message));
                        } else {
                            resolve(result);
                        }
                    });
                },
            );

            const folders: FolderItem[] = [];

            // 递归遍历所有节点
            const traverseNodes = (nodes: chrome.bookmarks.BookmarkTreeNode[]) => {
                for (const node of nodes) {
                    // 如果是文件夹且有子项
                    if (!node.url && node.children && node.children.length > 0) {
                        // 提取直接的书签子项
                        const bookmarks: BookmarkItem[] = node.children
                            .filter((child) => !!child.url) // 只要有 url 的就是书签
                            .map((child) => ({
                                id: child.id,
                                title: child.title || 'unnamed',
                                url: child.url!,
                                parentId: child.parentId,
                            }));

                        // 如果包含书签，创建文件夹
                        if (bookmarks.length > 0) {
                            folders.push({
                                id: node.id,
                                title: node.title || 'unnamed',
                                children: bookmarks,
                            });
                        }

                        // 递归处理子文件夹
                        traverseNodes(node.children);
                    }
                }
            };

            // 遍历根节点
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

    /**
     * 获取所有有效的文件夹
     */
    async getAllFolders(options?: {
        showMostVisited?: boolean;
        showRecentlyClosed?: boolean;
    }): Promise<FolderItem[]> {
        const [bookmarkFolders, topSitesFolder, recentlyClosedFolder] = await Promise.all([
            this.getBookmarkFolders(),
            this.getTopSitesAsBookmarkFolder(),
            this.getRecentlyClosedAsBookmarkFolder(),
        ]);

        const folders: FolderItem[] = [...bookmarkFolders];

        // 添加特殊文件夹到开头
        if (options?.showRecentlyClosed && recentlyClosedFolder)
            folders.unshift(recentlyClosedFolder);
        if (options?.showMostVisited && topSitesFolder) folders.unshift(topSitesFolder);

        return folders;
    }
}

export const browserApiService = new BrowserApiService();
