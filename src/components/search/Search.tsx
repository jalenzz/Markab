import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect } from 'react';

import { ANIMATION_CONFIG } from '../../config';
import { useSearch } from '../../hooks/useSearch';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export const Search: React.FC = () => {
    const {
        searchState,
        deactivateSearch,
        updateQuery,
        setSelectedIndex,
        openItem,
        handleKeyDown,
        handleGlobalKeyDown,
        handleGlobalPaste,
    } = useSearch();

    // 监听全局键盘事件
    useEffect(() => {
        document.addEventListener('keydown', handleGlobalKeyDown);
        return () => {
            document.removeEventListener('keydown', handleGlobalKeyDown);
        };
    }, [handleGlobalKeyDown]);

    // 监听全局粘贴事件
    useEffect(() => {
        document.addEventListener('paste', handleGlobalPaste);
        return () => {
            document.removeEventListener('paste', handleGlobalPaste);
        };
    }, [handleGlobalPaste]);

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

        // 检查是否为导航或操作键
        const isNavigationKey = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key);
        const isNumberKey = /^[1-5]$/.test(event.key);

        if (isNavigationKey || isNumberKey) {
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
                    className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 pt-32 backdrop-blur-sm"
                    onClick={handleBackdropClick}
                >
                    <motion.div
                        {...ANIMATION_CONFIG.presets.slideInUp}
                        exit={{ opacity: 0, y: -20 }}
                        className="w-full max-w-lg overflow-hidden rounded-lg bg-newtab-surface-elevated shadow-2xl"
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
                                onItemClick={openItem}
                                onSelectedIndexChange={handleSelectedIndexChange}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
