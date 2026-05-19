import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';

import { ANIMATION_CONFIG } from '@/shared/animations';

import { useGlobalSearchTriggers } from '../hooks/useGlobalSearchTriggers';
import { useSearchKeyboard } from '../hooks/useSearchKeyboard';
import { handleSearchKey } from '../keyboardActions';
import { useSearchStore } from '../store';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchTrigger } from './SearchTrigger';

export const Search: React.FC = () => {
    const isActive = useSearchStore((s) => s.isActive);
    const query = useSearchStore((s) => s.query);
    const results = useSearchStore((s) => s.results);
    const selectedIndex = useSearchStore((s) => s.selectedIndex);
    const activate = useSearchStore((s) => s.activate);
    const updateQuery = useSearchStore((s) => s.updateQuery);
    const deactivate = useSearchStore((s) => s.deactivate);
    const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
    const openItem = useSearchStore((s) => s.openItem);

    const containerRef = useRef<HTMLDivElement>(null);

    useGlobalSearchTriggers();
    useSearchKeyboard();

    useEffect(() => {
        if (!isActive) return;
        const onMouseDown = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                deactivate();
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [isActive, deactivate]);

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
        event.stopPropagation();
        const isNavigationKey = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key);
        const isNumberKey = /^[1-5]$/.test(event.key);
        if (isNavigationKey || isNumberKey) {
            handleSearchKey(event);
        }
    };

    return (
        <div ref={containerRef} className="relative z-30 mx-auto w-full max-w-md px-4 pt-3">
            <div className={`search-row flex h-10 items-center ${isActive ? 'is-active' : ''}`}>
                {isActive ? (
                    <SearchInput
                        value={query}
                        onChange={updateQuery}
                        onKeyDown={handleInputKeyDown}
                    />
                ) : (
                    <SearchTrigger onClick={activate} />
                )}
            </div>

            <AnimatePresence>
                {isActive && results.length > 0 && (
                    <motion.div
                        {...ANIMATION_CONFIG.presets.slideInUp}
                        exit={{ opacity: 0, y: -4 }}
                        className="absolute inset-x-4 top-full z-30 mt-2 overflow-hidden rounded-md border border-newtab-border bg-newtab-surface-elevated shadow-[0_18px_48px_-24px_rgba(20,20,19,0.35)]"
                    >
                        <SearchResults
                            results={results}
                            selectedIndex={selectedIndex}
                            query={query}
                            onItemClick={openItem}
                            onSelectedIndexChange={setSelectedIndex}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};
