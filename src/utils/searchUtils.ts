import type { FolderItem, SearchableBookmark } from '../types';

/**
 * 将文件夹结构扁平化为可搜索的书签列表
 */
export function flattenBookmarks(folders: FolderItem[]): SearchableBookmark[] {
    const searchableBookmarks: SearchableBookmark[] = [];

    folders.forEach((folder) => {
        folder.children.forEach((bookmark) => {
            searchableBookmarks.push({
                ...bookmark,
                folderTitle: folder.title,
            });
        });
    });

    return searchableBookmarks;
}

/**
 * 搜索书签
 * @param bookmarks 可搜索的书签列表
 * @param query 搜索关键词
 * @returns 匹配的书签列表，按相关性排序
 */
export function searchBookmarks(
    bookmarks: SearchableBookmark[],
    query: string,
): SearchableBookmark[] {
    if (!query.trim()) {
        return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const results: Array<{ bookmark: SearchableBookmark; score: number }> = [];

    bookmarks.forEach((bookmark) => {
        const titleLower = bookmark.title.toLowerCase();
        const urlLower = bookmark.url.toLowerCase();
        const folderTitleLower = bookmark.folderTitle.toLowerCase();

        let score = 0;

        // 标题完全匹配得分最高
        if (titleLower === normalizedQuery) {
            score += 100;
        }
        // 标题开头匹配
        else if (titleLower.startsWith(normalizedQuery)) {
            score += 80;
        }
        // 标题包含匹配
        else if (titleLower.includes(normalizedQuery)) {
            score += 60;
        }

        // URL匹配
        if (urlLower.includes(normalizedQuery)) {
            score += 40;
        }

        // 文件夹名称匹配
        if (folderTitleLower.includes(normalizedQuery)) {
            score += 20;
        }

        // 如果有任何匹配，添加到结果中
        if (score > 0) {
            results.push({ bookmark, score });
        }
    });

    // 按分数降序排序，只取前4个结果
    results.sort((a, b) => b.score - a.score);

    return results.slice(0, 4).map((result) => result.bookmark);
}

/**
 * 高亮搜索关键词
 * @param text 原始文本
 * @param query 搜索关键词
 * @returns 包含高亮标记的文本
 */
export function highlightText(text: string, query: string): string {
    if (!query.trim()) {
        return text;
    }

    const normalizedQuery = query.toLowerCase().trim();
    const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi');
    
    return text.replace(regex, '<span class="text-newtab-primary font-semibold">$1</span>');
}

/**
 * 转义正则表达式特殊字符
 */
function escapeRegExp(string: string): string {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * 截断长文本
 * @param text 原始文本
 * @param maxLength 最大长度
 * @returns 截断后的文本
 */
export function truncateText(text: string, maxLength: number = 50): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
}
