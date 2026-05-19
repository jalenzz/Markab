import { AnimatePresence, motion } from 'motion/react';
import React, { useEffect, useMemo, useRef } from 'react';

import { ANIMATION_CONFIG } from '@/shared/animations';

import { useGlobalSearchTriggers } from '../hooks/useGlobalSearchTriggers';
import { useSearchKeyboard } from '../hooks/useSearchKeyboard';
import { handleSearchKey } from '../keyboardActions';
import { useSearchStore } from '../store';
import { SearchInput } from './SearchInput';
import { SearchResults } from './SearchResults';
import { SearchTrigger } from './SearchTrigger';

const SEARCH_DEBOUNCE_MS = 100;

interface DebouncedFn {
    (): void;
    cancel: () => void;
    flush: () => void;
}

export const Search: React.FC = () => {
    const isActive = useSearchStore((s) => s.isActive);
    const query = useSearchStore((s) => s.query);
    const results = useSearchStore((s) => s.results);
    const selectedIndex = useSearchStore((s) => s.selectedIndex);
    const activate = useSearchStore((s) => s.activate);
    const setQuery = useSearchStore((s) => s.setQuery);
    const recomputeResults = useSearchStore((s) => s.recomputeResults);
    const deactivate = useSearchStore((s) => s.deactivate);
    const setSelectedIndex = useSearchStore((s) => s.setSelectedIndex);
    const openItem = useSearchStore((s) => s.openItem);

    const containerRef = useRef<HTMLDivElement>(null);
    const recomputeRef = useRef(recomputeResults);
    recomputeRef.current = recomputeResults;

    const debouncedRecompute = useMemo<DebouncedFn>(() => {
        let timer: ReturnType<typeof setTimeout> | null = null;
        const fire = () => {
            timer = null;
            recomputeRef.current();
        };
        const fn = (() => {
            if (timer) clearTimeout(timer);
            timer = setTimeout(fire, SEARCH_DEBOUNCE_MS);
        }) as DebouncedFn;
        fn.cancel = () => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        };
        fn.flush = () => {
            if (timer) {
                clearTimeout(timer);
                fire();
            }
        };
        return fn;
    }, []);

    const handleQueryChange = useMemo(
        () => (value: string) => {
            setQuery(value);
            if (value === '') {
                debouncedRecompute.cancel();
                recomputeRef.current();
            } else {
                debouncedRecompute();
            }
        },
        [setQuery, debouncedRecompute],
    );

    useGlobalSearchTriggers();
    useSearchKeyboard();

    useEffect(() => () => debouncedRecompute.cancel(), [debouncedRecompute]);

    useEffect(() => {
        if (!isActive) {
            debouncedRecompute.cancel();
        }
    }, [isActive, debouncedRecompute]);

    useEffect(() => {
        if (!isActive) return;
        const onMouseDown = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                debouncedRecompute.cancel();
                deactivate();
            }
        };
        document.addEventListener('mousedown', onMouseDown);
        return () => document.removeEventListener('mousedown', onMouseDown);
    }, [isActive, deactivate, debouncedRecompute]);

    const handleInputKeyDown = (event: React.KeyboardEvent) => {
        event.stopPropagation();
        const isNavigationKey = ['ArrowUp', 'ArrowDown', 'Enter', 'Escape'].includes(event.key);
        const isNumberKey = /^[1-5]$/.test(event.key);
        if (isNavigationKey || isNumberKey) {
            if (event.key === 'Enter') {
                debouncedRecompute.flush();
            } else if (event.key === 'Escape') {
                debouncedRecompute.cancel();
            }
            handleSearchKey(event);
        }
    };

    return (
        <div ref={containerRef} className="relative z-30 mx-auto w-full max-w-md px-4 pt-3">
            <div className={`search-row flex h-10 items-center ${isActive ? 'is-active' : ''}`}>
                {isActive ? (
                    <SearchInput
                        value={query}
                        onChange={handleQueryChange}
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
