import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';

import { ANIMATION_CONFIG } from '../../config';
import { useQuickSearch } from '../../hooks/useQuickSearch';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export const QuickSearch: React.FC = () => {
    const {
        searchState,
        deactivateSearch,
        updateQuery,
        setSelectedIndex,
        openBookmark,
        handleKeyDown,
        handleGlobalKeyDown,
    } = useQuickSearch();

    // 监听全局键盘事件
    useEffect(() => {
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [handleGlobalKeyDown]);

    // 监听搜索模式下的键盘事件
    useEffect(() => {
        if (searchState.isActive) {
            document.addEventListener('keydown', handleKeyDown);
            return () => {
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, [searchState.isActive, handleKeyDown]);

    // 处理搜索输入框的键盘事件
    const handleInputKeyDown = (event: React.KeyboardEvent) => {
        // 阻止事件冒泡，避免与全局键盘事件冲突
        event.stopPropagation();

        if (event.key === 'ArrowUp' || event.key === 'ArrowDown' ||
            event.key === 'Enter' || event.key === 'Escape' ||
            /^[1-5]$/.test(event.key)) {
            // 阻止默认行为
            event.preventDefault();

            const nativeEvent = new KeyboardEvent('keydown', {
                key: event.key,
                code: event.code,
                ctrlKey: event.ctrlKey,
                metaKey: event.metaKey,
                altKey: event.altKey,
                shiftKey: event.shiftKey,
            });

            handleKeyDown(nativeEvent);
        }
    };

    // 处理选中索引变化
    const handleSelectedIndexChange = (index: number) => {
        setSelectedIndex(index);
    };

    // 处理背景点击
    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            deactivateSearch();
        }
    };

    return (
        <AnimatePresence>
            {searchState.isActive && (
                <motion.div
                    {...ANIMATION_CONFIG.presets.fadeIn}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm pt-32"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        {...ANIMATION_CONFIG.presets.slideInUp}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg rounded-lg bg-newtab-surface-elevated shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* 搜索输入框 */}
                        <div className="px-2 pt-3">
                            <SearchInput
                                value={searchState.query}
                                onChange={updateQuery}
                                onKeyDown={handleInputKeyDown}
                            />
                        </div>

                        {/* 搜索结果 */}
                        <div className="pt-1">
                            <SearchResults
                                results={searchState.results}
                                selectedIndex={searchState.selectedIndex}
                                query={searchState.query}
                                onItemClick={openBookmark}
                                onSelectedIndexChange={handleSelectedIndexChange}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
