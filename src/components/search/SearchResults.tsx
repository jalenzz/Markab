import { motion } from 'motion/react';
import React, { useEffect, useRef } from 'react';

import { ANIMATION_CONFIG } from '../../config';
import type { SearchResult } from '../../types';
import { SearchResultItem } from './SearchResultItem';

interface SearchResultsProps {
    results: SearchResult[];
    selectedIndex: number;
    query: string;
    onItemClick: (item: SearchResult) => void;
    onSelectedIndexChange: (index: number) => void;
}

export const SearchResults: React.FC<SearchResultsProps> = React.memo(
    ({ results, selectedIndex, query, onItemClick, onSelectedIndexChange }) => {
        const selectedItemRef = useRef<HTMLDivElement>(null);
        const containerRef = useRef<HTMLDivElement>(null);

        // 自动滚动到选中项
        useEffect(() => {
            if (selectedItemRef.current && containerRef.current) {
                const container = containerRef.current;
                const selectedItem = selectedItemRef.current;

                const containerRect = container.getBoundingClientRect();
                const itemRect = selectedItem.getBoundingClientRect();

                if (itemRect.top < containerRect.top) {
                    // 选中项在可视区域上方
                    selectedItem.scrollIntoView({ block: 'start', behavior: 'smooth' });
                } else if (itemRect.bottom > containerRect.bottom) {
                    // 选中项在可视区域下方
                    selectedItem.scrollIntoView({ block: 'end', behavior: 'smooth' });
                }
            }
        }, [selectedIndex]);

        if (results.length === 0) {
            return null;
        }

        return (
            <motion.div
                ref={containerRef}
                {...ANIMATION_CONFIG.presets.slideInUp}
                className="max-h-80 overflow-y-auto"
            >
                <div>
                    {results.map((item, index) => (
                        <div
                            key={`${item.id}-${item.folderTitle || ''}`}
                            ref={index === selectedIndex ? selectedItemRef : null}
                        >
                            <SearchResultItem
                                item={item}
                                isSelected={index === selectedIndex}
                                query={query}
                                index={index}
                                onClick={() => onItemClick(item)}
                                onMouseEnter={() => onSelectedIndexChange(index)}
                            />
                        </div>
                    ))}
                </div>
            </motion.div>
        );
    },
);
