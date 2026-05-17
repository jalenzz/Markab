import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { ANIMATION_CONFIG } from '@/shared/animations';

import { useGlobalSearchTriggers } from '../hooks/useGlobalSearchTriggers';
import { useSearchKeyboard } from '../hooks/useSearchKeyboard';
import { handleSearchKey } from '../keyboardActions';
import { useSearchStore } from '../store';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';

export const Search: React.FC = () => {
    const isActive = useSearchStore((s) => s.isActive);
    const query = useSearchStore((s) => s.query);
    const results = useSearchStore((s) => s.results);
    const selectedIndex = useSearchStore((s) => s.selectedIndex);
    const updateQuery = useSearchStore((s) => s.updateQuery);
    const deactivate = useSearchStore((s) => s.deactivate);
    const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
    const openItem = useSearchStore((s) => s.openItem);

    useGlobalSearchTriggers();
    useSearchKeyboard();

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
        // 阻止冒泡，避免与全局 keydown 重复触发
        event.stopPropagation();

        const isNavigationKey = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key);
        const isNumberKey = /^[1-5]$/.test(event.key);

        if (isNavigationKey || isNumberKey) {
            handleSearchKey(event);
        }
    };

    const handleBackdropClick = (event: React.MouseEvent) => {
        if (event.target === event.currentTarget) {
            deactivate();
        }
    };

    return (
        <AnimatePresence>
            {isActive && (
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
                        <div className="px-2 pt-3">
                            <SearchInput
                                value={query}
                                onChange={updateQuery}
                                onKeyDown={handleInputKeyDown}
                            />
                        </div>

                        <div className="pt-1">
                            <SearchResults
                                results={results}
                                selectedIndex={selectedIndex}
                                query={query}
                                onItemClick={openItem}
                                onSelectedIndexChange={setSelectedIndex}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
