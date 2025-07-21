import { useCallback, useMemo, useState } from 'react';

import type { SearchResult, SearchState } from '../types';
import { createSearchResults, flattenBookmarks } from '../utils/searchUtils';
import { useBookmarks } from './useBookmarks';
import { useSettings } from './useSettings';

export function useQuickSearch() {
    const { folderColumns } = useBookmarks();
    const { settings } = useSettings();

    const [searchState, setSearchState] = useState<SearchState>({
        isActive: false,
        query: '',
        selectedIndex: 0,
        results: [],
    });

    // 将所有书签扁平化为可搜索的列表
    const allBookmarks = useMemo(() => {
        const allFolders = folderColumns.flat();
        return flattenBookmarks(allFolders);
    }, [folderColumns]);

    // 执行搜索
    const performSearch = useCallback(
        (query: string) => {
            const results = createSearchResults(allBookmarks, query);
            setSearchState((prev) => ({
                ...prev,
                query,
                results,
                selectedIndex: 0, // 重置选中索引
            }));
        },
        [allBookmarks],
    );

    // 激活搜索模式
    const activateSearch = useCallback(() => {
        setSearchState((prev) => ({
            ...prev,
            isActive: true,
            query: '',
            results: [],
            selectedIndex: 0,
        }));
    }, []);

    // 退出搜索模式
    const deactivateSearch = useCallback(() => {
        setSearchState({
            isActive: false,
            query: '',
            selectedIndex: 0,
            results: [],
        });
    }, []);

    // 更新搜索关键词
    const updateQuery = useCallback(
        (query: string) => {
            performSearch(query);
        },
        [performSearch],
    );

    // 选择上一个结果
    const selectPrevious = useCallback(() => {
        setSearchState((prev) => ({
            ...prev,
            selectedIndex:
                prev.selectedIndex > 0 ? prev.selectedIndex - 1 : prev.results.length - 1,
        }));
    }, []);

    // 选择下一个结果
    const selectNext = useCallback(() => {
        setSearchState((prev) => ({
            ...prev,
            selectedIndex:
                prev.selectedIndex < prev.results.length - 1 ? prev.selectedIndex + 1 : 0,
        }));
    }, []);

    // 设置选中索引
    const setSelectedIndex = useCallback((index: number) => {
        setSearchState((prev) => ({
            ...prev,
            selectedIndex: index,
        }));
    }, []);

    // 通用的搜索结果项执行逻辑
    const executeSearchAction = useCallback(
        async (item: SearchResult) => {
            const openInNewTab = settings.linkOpen === 'new-tab';

            if (item.action) {
                await item.action(openInNewTab);
            } else {
                const target = openInNewTab ? '_blank' : '_self';
                window.open(item.url, target);
            }
            deactivateSearch();
        },
        [settings.linkOpen, deactivateSearch],
    );

    // 打开选中的搜索结果项
    const openSelectedItem = useCallback(() => {
        const selectedItem = searchState.results[searchState.selectedIndex];
        if (selectedItem) {
            executeSearchAction(selectedItem);
        }
    }, [searchState.results, searchState.selectedIndex, executeSearchAction]);

    // 打开指定搜索结果项
    const openItem = useCallback(
        (item: SearchResult) => {
            executeSearchAction(item);
        },
        [executeSearchAction],
    );

    // 处理键盘事件
    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!searchState.isActive) {
                return;
            }

            switch (event.key) {
                case 'Escape':
                    event.preventDefault();
                    deactivateSearch();
                    break;
                case 'ArrowUp':
                    event.preventDefault();
                    selectPrevious();
                    break;
                case 'ArrowDown':
                    event.preventDefault();
                    selectNext();
                    break;
                case 'Enter':
                    event.preventDefault();
                    openSelectedItem();
                    break;
                case '1':
                case '2':
                case '3':
                case '4':
                case '5': {
                    event.preventDefault();
                    const index = parseInt(event.key) - 1;
                    if (index < searchState.results.length) {
                        openItem(searchState.results[index]);
                    }
                    break;
                }
            }
        },
        [
            searchState.isActive,
            searchState.results,
            deactivateSearch,
            selectPrevious,
            selectNext,
            openSelectedItem,
            openItem,
        ],
    );

    const isTypingKey = useCallback((event: KeyboardEvent) => {
        return (
            event.key.length === 1 &&
            /[a-zA-Z]/.test(event.key) &&
            !event.ctrlKey &&
            !event.metaKey &&
            !event.altKey
        );
    }, []);

    // 处理全局键盘事件
    const handleGlobalKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (!searchState.isActive && isTypingKey(event)) {
                event.preventDefault();
                activateSearch();
                requestAnimationFrame(() => {
                    updateQuery(event.key);
                });
            }
        },
        [searchState.isActive, isTypingKey, activateSearch, updateQuery],
    );

    return {
        searchState,
        activateSearch,
        deactivateSearch,
        updateQuery,
        selectPrevious,
        selectNext,
        setSelectedIndex,
        openSelectedItem,
        openItem,
        handleKeyDown,
        handleGlobalKeyDown,
    };
}
