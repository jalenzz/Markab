import { pinyin } from 'pinyin-pro';

import type { FolderItem, SearchableBookmark } from '../types';

// 搜索评分常量
const SCORES = {
    EXACT_MATCH: 100,
    STARTS_WITH: 80,
    CONTAINS: 60,
    FUZZY_BASE: 20,
    FUZZY_MAX: 20,
    PINYIN_EXACT: 30,
    PINYIN_STARTS_WITH: 25,
    PINYIN_CONTAINS: 20,
    PINYIN_FUZZY_BASE: 10,
    PINYIN_FUZZY_MAX: 10,
} as const;

// 搜索配置常量
const CONFIG = {
    MAX_RESULTS: 5,
    DEFAULT_MAX_TEXT_LENGTH: 50,
} as const;

// 拼音转换缓存
const pinyinCache = new Map<string, string>();

/**
 * 将文件夹结构扁平化为可搜索的书签列表
 */
export function flattenBookmarks(folders: FolderItem[]): SearchableBookmark[] {
    return folders.flatMap((folder) =>
        folder.children.map((bookmark) => ({
            ...bookmark,
            folderTitle: folder.title,
        })),
    );
}

/**
 * 模糊匹配：检查查询字符是否按顺序出现在目标字符串中
 * @param target 目标字符串
 * @param query 查询字符串
 * @returns 匹配分数，0 表示不匹配
 */
function fuzzyMatch(target: string, query: string): number {
    const targetLower = target.toLowerCase();
    const queryLower = query.toLowerCase();

    let targetIndex = 0;
    let queryIndex = 0;
    let matchedChars = 0;

    while (targetIndex < targetLower.length && queryIndex < queryLower.length) {
        if (targetLower[targetIndex] === queryLower[queryIndex]) {
            matchedChars++;
            queryIndex++;
        }
        targetIndex++;
    }

    // 如果所有查询字符都匹配了，返回匹配度分数
    if (queryIndex === queryLower.length) {
        // 分数基于匹配字符数和目标字符串长度的比例
        return Math.round((matchedChars / targetLower.length) * 100);
    }

    return 0;
}

/**
 * 将中文转换为拼音（带缓存）
 * @param text 中文文本
 * @returns 拼音字符串
 */
function toPinyin(text: string): string {
    if (pinyinCache.has(text)) {
        return pinyinCache.get(text)!;
    }

    const result = pinyin(text, { toneType: 'none', type: 'array' }).join('');
    pinyinCache.set(text, result);
    return result;
}

/**
 * 计算书签的搜索评分
 * @param bookmark 书签对象
 * @param normalizedQuery 标准化的查询字符串
 * @returns 评分，0表示不匹配
 */
function calculateBookmarkScore(bookmark: SearchableBookmark, normalizedQuery: string): number {
    const titleLower = bookmark.title.toLowerCase();
    const titlePinyin = toPinyin(bookmark.title).toLowerCase();

    // 1. 直接文本匹配
    if (titleLower === normalizedQuery) {
        return SCORES.EXACT_MATCH;
    }
    if (titleLower.startsWith(normalizedQuery)) {
        return SCORES.STARTS_WITH;
    }
    if (titleLower.includes(normalizedQuery)) {
        return SCORES.CONTAINS;
    }

    // 2. 模糊匹配
    const fuzzyScore = fuzzyMatch(titleLower, normalizedQuery);
    if (fuzzyScore > 0) {
        return SCORES.FUZZY_BASE + Math.min(fuzzyScore, SCORES.FUZZY_MAX);
    }

    // 3. 拼音匹配（仅当有中文字符时）
    if (titlePinyin !== titleLower) {
        if (titlePinyin === normalizedQuery) {
            return SCORES.PINYIN_EXACT;
        }
        if (titlePinyin.startsWith(normalizedQuery)) {
            return SCORES.PINYIN_STARTS_WITH;
        }
        if (titlePinyin.includes(normalizedQuery)) {
            return SCORES.PINYIN_CONTAINS;
        }

        // 拼音模糊匹配
        const pinyinFuzzyScore = fuzzyMatch(titlePinyin, normalizedQuery);
        if (pinyinFuzzyScore > 0) {
            return (
                SCORES.PINYIN_FUZZY_BASE + Math.min(pinyinFuzzyScore / 5, SCORES.PINYIN_FUZZY_MAX)
            );
        }
    }

    return 0;
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

    const results = bookmarks
        .map((bookmark) => ({
            bookmark,
            score: calculateBookmarkScore(bookmark, normalizedQuery),
        }))
        .filter((result) => result.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, CONFIG.MAX_RESULTS)
        .map((result) => result.bookmark);

    return results;
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
    const textLower = text.toLowerCase();

    // 1. 尝试直接匹配高亮
    if (textLower.includes(normalizedQuery)) {
        const regex = new RegExp(`(${escapeRegExp(normalizedQuery)})`, 'gi');
        return text.replace(regex, '<span class="text-newtab-primary font-semibold">$1</span>');
    }

    // 2. 尝试拼音匹配高亮
    const textPinyin = toPinyin(text).toLowerCase();
    if (textPinyin.includes(normalizedQuery)) {
        // 对于拼音匹配，找到对应的中文字符并高亮
        return highlightPinyinMatch(text, normalizedQuery);
    }

    // 3. 尝试模糊匹配高亮
    const fuzzyScore = fuzzyMatch(textLower, normalizedQuery);
    if (fuzzyScore > 0) {
        // 对于模糊匹配，高亮匹配的字符
        return highlightFuzzyMatch(text, normalizedQuery);
    }

    return text;
}

/**
 * 高亮拼音匹配的中文字符
 * @param text 原始文本
 * @param query 查询字符串
 * @returns 高亮后的文本
 */
function highlightPinyinMatch(text: string, query: string): string {
    const queryLower = query.toLowerCase();
    const textPinyin = toPinyin(text).toLowerCase();

    // 如果拼音完全匹配或包含查询，高亮对应的中文部分
    if (textPinyin === queryLower || textPinyin.startsWith(queryLower)) {
        // 计算查询对应的中文字符数量
        let matchedChars = 0;
        let currentPinyin = '';

        for (let i = 0; i < text.length; i++) {
            const char = text[i];
            const charPinyin = pinyin(char, { toneType: 'none', type: 'array' })[0] || char;
            currentPinyin += charPinyin.toLowerCase();
            matchedChars++;

            if (currentPinyin.length >= queryLower.length) {
                break;
            }
        }

        const matchedPart = text.slice(0, matchedChars);
        const remainingPart = text.slice(matchedChars);

        return `<span class="text-newtab-primary font-semibold">${matchedPart}</span>${remainingPart}`;
    }

    // 如果拼音包含查询，找到匹配的位置
    if (textPinyin.includes(queryLower)) {
        const startIndex = textPinyin.indexOf(queryLower);

        // 计算对应的中文字符位置
        let charIndex = 0;
        let pinyinLength = 0;

        // 找到开始位置对应的中文字符
        while (charIndex < text.length && pinyinLength < startIndex) {
            const char = text[charIndex];
            const charPinyin = pinyin(char, { toneType: 'none', type: 'array' })[0] || char;
            pinyinLength += charPinyin.length;
            charIndex++;
        }

        const startChar = Math.max(0, charIndex - 1);

        // 计算匹配长度对应的中文字符数
        let matchLength = 0;
        let currentPinyin = '';

        for (let i = startChar; i < text.length; i++) {
            const char = text[i];
            const charPinyin = pinyin(char, { toneType: 'none', type: 'array' })[0] || char;
            currentPinyin += charPinyin.toLowerCase();
            matchLength++;

            if (currentPinyin.length >= queryLower.length) {
                break;
            }
        }

        const beforeMatch = text.slice(0, startChar);
        const matchedPart = text.slice(startChar, startChar + matchLength);
        const afterMatch = text.slice(startChar + matchLength);

        return (
            beforeMatch +
            `<span class="text-newtab-primary font-semibold">${matchedPart}</span>` +
            afterMatch
        );
    }

    // 如果没有找到精确匹配，尝试模糊拼音匹配
    return highlightFuzzyPinyinMatch(text, queryLower);
}

/**
 * 高亮模糊拼音匹配
 * @param text 原始文本
 * @param query 查询字符串
 * @returns 高亮后的文本
 */
function highlightFuzzyPinyinMatch(text: string, query: string): string {
    const textPinyin = toPinyin(text).toLowerCase();
    const fuzzyScore = fuzzyMatch(textPinyin, query);

    if (fuzzyScore > 0) {
        // 对于模糊拼音匹配，高亮整个文本
        return `<span class="text-newtab-primary font-semibold">${text}</span>`;
    }

    return text;
}

/**
 * 高亮模糊匹配的字符
 * @param text 原始文本
 * @param query 查询字符串
 * @returns 高亮后的文本
 */
function highlightFuzzyMatch(text: string, query: string): string {
    const textLower = text.toLowerCase();
    const queryLower = query.toLowerCase();

    let result = '';
    let textIndex = 0;
    let queryIndex = 0;

    while (textIndex < text.length && queryIndex < queryLower.length) {
        if (textLower[textIndex] === queryLower[queryIndex]) {
            result += `<span class="text-newtab-primary font-semibold">${text[textIndex]}</span>`;
            queryIndex++;
        } else {
            result += text[textIndex];
        }
        textIndex++;
    }

    // 添加剩余的字符
    result += text.slice(textIndex);

    return result;
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
export function truncateText(
    text: string,
    maxLength: number = CONFIG.DEFAULT_MAX_TEXT_LENGTH,
): string {
    if (text.length <= maxLength) {
        return text;
    }
    return text.slice(0, maxLength) + '...';
}
